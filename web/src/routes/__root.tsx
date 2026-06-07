import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: '42-research · 严谨、可溯源、可同行评审的技术研究',
      },
      {
        name: 'description',
        content:
          '42-research — 一个严谨、可复现、可同行评审的技术研究项目。研究产物为自包含语义化 HTML，真相源在 git，查询索引在 D1。',
      },
      // 浏览器 UI 主题色：随系统亮/暗自动取值
      { name: 'theme-color', content: '#0a0a0f', media: '(prefers-color-scheme: dark)' },
      { name: 'theme-color', content: '#f5f5f2', media: '(prefers-color-scheme: light)' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // favicon 体系 — SVG 优先，.ico 兜底旧浏览器，apple-touch 用于 iOS 主屏
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
      // RSS 订阅源 — 供 Feed Reader 与 AI Aggregator 发现
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: '42-research',
        href: '/rss.xml',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(246,130,31,0.26)]">
        <Header />
        {children}
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
