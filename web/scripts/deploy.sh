#!/usr/bin/env bash
# 42-research 一键部署（build → deploy → purge → 边缘收敛验证 → 端点巡检）
#
# 背景：Cloudflare worker 脚本版本传播存在分钟级延迟（实测 HKG 15-30 分钟），
# 而静态资产层是即时的——仅凭页面能打开无法确认 SSR 已是新版。本脚本用构建期
# 注入的 BUILD_ID（/version.txt）轮询确认收敛，收敛前不报成功。
#
# 用法: pnpm -C web deploy   （凭证读仓库根 .cloudflare.env，gitignored）
set -euo pipefail

cd "$(dirname "$0")/.."          # web/
ROOT="$(cd .. && pwd)"

# ---- 凭证 ----
if [[ -f "$ROOT/.cloudflare.env" ]]; then
  set -a; source "$ROOT/.cloudflare.env"; set +a
fi
: "${CLOUDFLARE_API_TOKEN:?缺 CLOUDFLARE_API_TOKEN（见 .cloudflare.env）}"
: "${CLOUDFLARE_ZONE_ID:?缺 CLOUDFLARE_ZONE_ID（见 .cloudflare.env）}"

BASE_URL="${DEPLOY_BASE_URL:-https://42r.larrykoo.com}"

# ---- 构建（注入唯一 BUILD_ID）----
BUILD_ID="$(git rev-parse --short HEAD)-$(date -u +%Y%m%d%H%M%S)"
export BUILD_ID
echo "==> build (BUILD_ID=$BUILD_ID)"
pnpm run build

# ---- 部署 ----
echo "==> wrangler deploy"
pnpm exec wrangler deploy

# ---- 清边缘缓存（旧部署的缓存会残留 404/旧 sitemap）----
echo "==> purge zone cache"
purge_ok=$(curl -s -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -d '{"purge_everything":true}' | python3 -c 'import json,sys; print(json.load(sys.stdin)["success"])')
[[ "$purge_ok" == "True" ]] || { echo "!! purge 失败"; exit 1; }

# ---- 等待边缘收敛（最长 30 分钟）----
echo "==> waiting for edge convergence on $BASE_URL/version.txt"
deadline=$((SECONDS + 1800))
while true; do
  live="$(curl -sf --max-time 10 "$BASE_URL/version.txt" || true)"
  if [[ "$live" == "$BUILD_ID" ]]; then
    echo "==> converged: $live"
    break
  fi
  if (( SECONDS > deadline )); then
    echo "!! 超时（30min）：线上仍为 '${live:-<empty>}'，期望 $BUILD_ID"
    echo "   部署本身已成功；边缘传播异常时可稍后重跑本脚本的巡检部分确认。"
    exit 1
  fi
  printf '   still %s (elapsed %ss)\n' "${live:-<empty>}" "$SECONDS"
  sleep 20
done

# ---- 收敛后再清一次缓存（收敛前的请求可能把旧响应重新写入了缓存）----
curl -s -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -d '{"purge_everything":true}' > /dev/null

# ---- 端点巡检 ----
echo "==> endpoint sweep"
fail=0
for u in "" "research" "sitemap.xml" "rss.xml" "llms.txt" "robots.txt"; do
  code=$(curl -s -o /dev/null --max-time 15 -w '%{http_code}' "$BASE_URL/$u")
  printf '   /%-14s -> %s\n' "$u" "$code"
  [[ "$code" == "200" ]] || fail=1
done
(( fail == 0 )) || { echo "!! 巡检存在非 200"; exit 1; }
echo "==> deploy OK ($BUILD_ID)"
