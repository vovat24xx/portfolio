import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { reducedMotion } from '../lib/motion.js'
import { useReveal } from '../lib/useReveal.js'
import Split from './Split.jsx'

export default function About() {
  const root = useRef(null)
  useReveal(root)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      // the white sheet unfolds from a card to full bleed as it enters
      gsap.fromTo('.about__bg',
        { clipPath: 'inset(9% 5% 0% 5% round 56px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 92%', end: 'top 15%', scrub: true } })
      // red shapes drift at a different speed than the page
      gsap.to('.blob--a', { yPercent: -35, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.to('.blob--b', { yPercent: 28, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="sec about" ref={root}>
      <div className="sec__bg about__bg">
        <i className="blob blob--a" />
        <i className="blob blob--b" />
        <i className="ring ring--a" />
      </div>

      <i className="cp" data-cp="0.06" data-layer="front" style={{ top: '4%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.9" data-layer="front" style={{ top: '38%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.95" data-layer="back" style={{ top: '92%' }} aria-hidden="true" />

      <div className="sec__in about__in">
        <h2 className="display giant"><Split text="WHO AM I?" /></h2>
        <div className="about__text">
          <p className="about__lead" data-up>
            I am a digital creator focused on building modern websites, Telegram bots and digital solutions.
          </p>
          <p data-up>
            I combine design, functionality and technology to create experiences that help businesses grow online.
          </p>
        </div>
      </div>
    </section>
  )
}
