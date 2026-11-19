import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { reducedMotion } from '../lib/motion.js'
import { useReveal } from '../lib/useReveal.js'
import { useLang, tr } from '../lib/lang.jsx'
import { CATEGORIES, PROJECTS } from '../data/content.js'
import Split from './Split.jsx'

function ProjectCard({ p, lang }) {
  const el = useRef(null)
  const catLabel = CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(el.current, {
        opacity: 0,
        y: 80,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.current, start: 'top 92%', once: true },
      })
      gsap.fromTo(el.current.querySelector('img'), { scale: 1.18 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: el.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const open = (e) => { if (!p.url || p.url === '#') e.preventDefault() }
  const external = p.url && p.url !== '#' && /^https?:/.test(p.url)

  return (
    <article className="proj" ref={el}>
      <a className="proj__media" href={p.url || '#'} onClick={open} tabIndex={-1} aria-hidden="true"
         target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} data-cursor>
        <img src={p.image} alt="" width="1200" height="750" loading="lazy" decoding="async" />
        {p.demo && <span className="proj__demo">DEMO</span>}
        <span className="proj__veil"><span>VIEW</span></span>
      </a>
      <div className="proj__meta">
        <span className="proj__cat">{catLabel}</span>
        <h3>{p.title}</h3>
        <p>{tr(p.desc, lang)}</p>
        <a className="btn btn--line" href={p.url || '#'} onClick={open}
           target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          VIEW PROJECT
        </a>
      </div>
    </article>
  )
}

export default function Projects() {
  const root = useRef(null)
  const [cat, setCat] = useState('all')
  const { lang } = useLang()
  useReveal(root)

  const list = useMemo(() => PROJECTS.filter((p) => cat === 'all' || p.category === cat), [cat])
  const used = useMemo(() => new Set(PROJECTS.map((p) => p.category)), [])

  // list height changed → recalculate scroll triggers (the chain route follows automatically)
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => clearTimeout(t)
  }, [cat])

  return (
    <section id="work" className="sec work" ref={root}>
      <div className="sec__bg work__bg" />

      <i className="cp" data-cp="0.95" data-layer="back" style={{ top: '3%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.04" data-layer="back" style={{ top: '48%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.96" data-layer="back" style={{ top: '94%' }} aria-hidden="true" />

      <div className="sec__in">
        <h2 className="display h2"><Split text="SELECTED WORK." /></h2>

        <div className="filters" role="tablist" aria-label="Project categories" data-up>
          {CATEGORIES.filter((c) => c.key === 'all' || used.has(c.key)).map((c) => (
            <button key={c.key} role="tab" aria-selected={cat === c.key}
                    className={cat === c.key ? 'is-on' : ''} onClick={() => setCat(c.key)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="projects">
          {list.map((p) => <ProjectCard key={p.id} p={p} lang={lang} />)}
        </div>
      </div>
    </section>
  )
}
