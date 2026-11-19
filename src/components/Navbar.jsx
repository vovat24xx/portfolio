import { useEffect, useState } from 'react'
import { NAV } from '../data/content.js'
import { SITE } from '../config.js'
import { useLang } from '../lib/lang.jsx'
import { goTo } from '../lib/motion.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang } = useLang()

  useEffect(() => {
    const l = window.__lenis
    if (l) (open ? l.stop() : l.start())
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    // wait one tick so Lenis is running again before scrolling
    setTimeout(() => goTo(href), 30)
  }

  return (
    <>
      <header className="nav">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, '#top')} aria-label="Back to top">
          <span className="nav__mark" aria-hidden="true" />
          {SITE.name}
        </a>
        <nav className="nav__links" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a>
          ))}
        </nav>
        <div className="nav__right">
          <div className="lang" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'is-on' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
            <button className={lang === 'uk' ? 'is-on' : ''} onClick={() => setLang('uk')} aria-pressed={lang === 'uk'}>UA</button>
          </div>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} tabIndex={open ? 0 : -1}>{n.label}</a>
        ))}
      </div>
    </>
  )
}
