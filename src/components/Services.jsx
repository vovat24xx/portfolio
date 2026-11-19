import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { reducedMotion } from '../lib/motion.js'
import { useReveal } from '../lib/useReveal.js'
import { useLang, tr } from '../lib/lang.jsx'
import { SERVICES } from '../data/content.js'
import Split from './Split.jsx'

export default function Services() {
  const root = useRef(null)
  const { lang } = useLang()
  useReveal(root)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.card').forEach((el, i) => {
        gsap.from(el, {
          clipPath: 'inset(100% 0% 0% 0%)',
          y: 70,
          duration: 1.25,
          delay: (i % 2) * 0.12,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
      gsap.fromTo('.wipe', { scaleX: 0 }, { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 30%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  // light follows the pointer inside each card
  const track = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="services" className="sec services" ref={root}>
      <div className="sec__bg services__bg"><i className="wipe" /></div>

      <i className="cp" data-cp="0.94" data-layer="back" style={{ top: '4%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.5" data-layer="back" style={{ top: '52%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.05" data-layer="back" style={{ top: '95%' }} aria-hidden="true" />

      <div className="sec__in">
        <h2 className="display h2"><Split text="WHAT I DO." /></h2>
        <div className="cards">
          {SERVICES.map((s) => (
            <article className="card" key={s.no} onPointerMove={track} data-cursor>
              <i className="rivet rivet--tl" /><i className="rivet rivet--tr" />
              <i className="rivet rivet--bl" /><i className="rivet rivet--br" />
              <span className="card__no" aria-hidden="true">{s.no}</span>
              <div className="card__body">
                <h3>{s.title}</h3>
                <p>{tr(s.desc, lang)}</p>
              </div>
              <span className="card__arrow" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
