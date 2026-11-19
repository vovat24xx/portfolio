import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || 'en' } catch { return 'en' }
  })
  useEffect(() => {
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en'
    try { localStorage.setItem('lang', lang) } catch { /* private mode */ }
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)

/** pick the string for the current language: tr({en:'..',uk:'..'}, lang) */
export const tr = (o, lang) => (typeof o === 'string' ? o : o[lang] ?? o.en)
