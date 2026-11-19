import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { reducedMotion } from '../lib/motion.js'
import { useReveal } from '../lib/useReveal.js'
import { useLang, tr } from '../lib/lang.jsx'
import { PROCESS } from '../data/content.js'
import Split from './Split.jsx'

export default function Process() {
  const root = useRef(null)
  const { lang } = useLang()
  useReveal(root)

  useLayoutEffect(() => {
    const steps = gsap.utils.toArray('.step', root.current)
    if (reducedMotion()) { steps.forEach((s) => s.classList.add('is-on')); return }
    const ctx = gsap.context(() => {
      steps.forEach((s) => {
        gsap.from(s.querySelector('.step__no'), {
          xPercent: -30, opacity: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: s, start: 'top 85%', once: true },
        })
        // the red state turns on when a step reaches the middle of the screen
        gsap.timeline({ scrollTrigger: {
          trigger: s, start: 'top 60%', end: 'bottom 40%',
          onToggle: (self) => s.classList.toggle('is-on', self.isActive),
        } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="process" className="sec process" ref={root}>
      <div className="sec__bg process__bg" />

      <i className="cp" data-cp="0.06" data-layer="back" style={{ top: '4%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.93" data-layer="back" style={{ top: '52%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.5" data-layer="back" style={{ top: '96%' }} aria-hidden="true" />

      <div className="sec__in">
        <h2 className="display h2"><Split text={'FROM IDEA\nTO REALITY.'} /></h2>
        <ol className="steps">
          {PROCESS.map((s) => (
            <li className="step" key={s.no}>
              <span className="step__no" aria-hidden="true">{s.no}</span>
              <div className="step__body">
                <h3>{s.title}</h3>
                <p>{tr(s.desc, lang)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
