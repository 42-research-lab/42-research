#!/usr/bin/env python3
"""校验 42-research 课题 HTML 产物的质量门 (ADR-001)。

检查项:
  1. JSON-LD 可解析且 @type == ScholarlyArticle
  2. JSON-LD 必填字段齐全
  3. identifier 与目录名一致
  4. citation[] 非空, 字段完整, 至少一条 primary
  5. researchStatus 取值合法
  6. CSS 颜色值无非 ASCII 字符混入 (中文输入法易混入西里尔字母)
  7. 自包含: 无外部 <link rel=stylesheet> / 外部 <script src>

用法: python3 validate_artifact.py <path/to/index.html>
退出码: 0 通过 / 1 失败
"""
import json
import re
import sys
from pathlib import Path

REQUIRED_FIELDS = [
    "identifier", "headline", "abstract", "datePublished",
    "keywords", "researchStatus", "hypothesis", "conclusion", "citation",
]
VALID_STATUS = {"hypothesis", "survey", "experiment", "verify", "synthesize", "publish"}
VALID_TIERS = {"primary", "secondary"}
CITATION_FIELDS = ["url", "name", "tier"]
_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _is_date(s) -> bool:
    return isinstance(s, str) and bool(_DATE_RE.match(s))


def fail(msg, errs):
    errs.append(msg)


def validate(path: Path) -> list[str]:
    errs: list[str] = []
    if not path.exists():
        return [f"文件不存在: {path}"]
    s = path.read_text(encoding="utf-8")

    # 1+2+3+4+5: JSON-LD
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    if not m:
        fail("未找到 JSON-LD <script type=\"application/ld+json\">", errs)
    else:
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError as e:
            fail(f"JSON-LD 解析失败: {e}", errs)
            data = None
        if data is not None:
            if data.get("@type") != "ScholarlyArticle":
                fail(f"@type 应为 ScholarlyArticle, 实为 {data.get('@type')!r}", errs)
            for f in REQUIRED_FIELDS:
                if not data.get(f):
                    fail(f"JSON-LD 缺少必填字段: {f}", errs)
            ident = data.get("identifier", "")
            dirname = path.parent.name
            if ident and ident != dirname:
                fail(f"identifier ({ident!r}) 与目录名 ({dirname!r}) 不一致", errs)
            status = data.get("researchStatus")
            if status and status not in VALID_STATUS:
                fail(f"researchStatus {status!r} 非法, 合法值: {sorted(VALID_STATUS)}", errs)
            cites = data.get("citation") or []
            if not cites:
                fail("citation[] 为空, 研究产物必须有引用", errs)
            primary = 0
            for i, c in enumerate(cites):
                for cf in CITATION_FIELDS:
                    if not c.get(cf):
                        fail(f"citation[{i}] 缺少字段: {cf}", errs)
                tier = c.get("tier")
                if tier and tier not in VALID_TIERS:
                    fail(f"citation[{i}] tier {tier!r} 非法, 合法值: {sorted(VALID_TIERS)}", errs)
                if tier == "primary":
                    primary += 1
            if cites and primary == 0:
                fail("无任何 primary(一手)来源; 核心结论需一手支撑", errs)

            # dateModified 不应早于 datePublished (产物自洽)
            dp, dm = data.get("datePublished"), data.get("dateModified")
            if dp and dm and _is_date(dp) and _is_date(dm) and dm < dp:
                fail(f"dateModified ({dm}) 早于 datePublished ({dp}); 时间线矛盾", errs)

    # 6: CSS 颜色值非 ASCII 混入
    for ln, line in enumerate(s.splitlines(), 1):
        for hx in re.findall(r'#[0-9a-fA-FЀ-ӿ一-鿿]{3,8}', line):
            if re.search(r'[^#0-9a-fA-F]', hx):
                fail(f"第 {ln} 行颜色值含非 ASCII 字符: {hx!r}", errs)

    # 7: 自包含
    if re.search(r'<link[^>]+rel=["\']stylesheet["\']', s):
        fail("发现外部样式表 <link rel=stylesheet>; 产物应自包含(内联 CSS)", errs)
    if re.search(r'<script[^>]+src=', s):
        fail("发现外部脚本 <script src>; 产物应自包含", errs)

    # 8: 外链必须新标签打开 (target="_blank"), 避免读者被导离站点
    for am in re.finditer(r'<a\s+([^>]*)>', s, re.S):
        attrs = am.group(1)
        if re.search(r'href="https?://', attrs) and 'target=' not in attrs:
            href = re.search(r'href="([^"]*)"', attrs)
            fail(f"外链缺少 target=\"_blank\": {href.group(1) if href else attrs[:80]}", errs)

    return errs


def main():
    if len(sys.argv) != 2:
        print("用法: python3 validate_artifact.py <path/to/index.html>")
        sys.exit(2)
    path = Path(sys.argv[1])
    errs = validate(path)
    if errs:
        print(f"❌ 校验失败 ({len(errs)} 项): {path}")
        for e in errs:
            print(f"   · {e}")
        sys.exit(1)
    print(f"✅ 质量门通过: {path}")
    sys.exit(0)


if __name__ == "__main__":
    main()
