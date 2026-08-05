import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import {
  LOCALE_STORAGE_KEY,
  LOCALE_TAG,
  localeFromPathname,
  messages,
  switchLocalePath,
  type Locale,
} from './index'
import type { Messages } from './en'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Messages
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * URL 是语言唯一真相源：/zh 前缀 → zh，无前缀 → en（默认）。
 * SSR 与 CSR 从同一 pathname 推导，天然一致，无 hydration 漂移。
 * setLocale = 记住手动选择（最高优先级，见 LOCALE_REDIRECT_SCRIPT）+ 跳转到
 * 目标语言的等价 URL——语言切换就是一次普通导航，loader/head 全部随之重跑。
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const locale = localeFromPathname(pathname)
  const router = useRouter()

  const setLocale = useCallback(
    (l: Locale) => {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, l)
        document.documentElement.lang = LOCALE_TAG[l]
      } catch {
        /* storage unavailable — navigation below still switches the language */
      }
      if (l !== localeFromPathname(pathname)) {
        router.history.push(switchLocalePath(pathname, l))
      }
    },
    [pathname, router],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: messages(locale) }),
    [locale, setLocale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within <LocaleProvider>')
  return ctx
}

/** Shorthand: just the message catalog for the current locale. */
export function useT(): Messages {
  return useLocale().t
}
