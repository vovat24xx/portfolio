import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { isTouch, reducedMotion } from '../lib/motion.js'
import { useReveal } from '../lib/useReveal.js'
import { CONTACTS, SITE } from '../config.js'
import Split from './Split.jsx'

const LINKS = [
  { label: 'TELEGRAM', href: CONTACTS.telegram },
  { label: 'WHATSAPP', href: CONTACTS.whatsapp },
  { label: 'INSTAGRAM', href: CONTACTS.instagram },
  { label: 'EMAIL', href: CONTACTS.email },
]

export default function Contact() {
  const root = useRef(null)
  useReveal(root)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact__bg',
        { clipPath: 'inset(8% 4% 0% 4% round 56px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 20%', scrub: true } })

      // magnetic buttons (mouse only)
      if (!isTouch()) {
        gsap.utils.toArray('.cbtn').forEach((b) => {
          const x = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' })
          const y = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' })
          b.addEventListener('pointermove', (e) => {
            const r = b.getBoundingClientRect()
            x((e.clientX - (r.left + r.width / 2)) * 0.12)
            y((e.clientY - (r.top + r.height / 2)) * 0.2)
          })
          b.addEventListener('pointerleave', () => { x(0); y(0) })
        })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="sec contact" ref={root}>
      <div className="sec__bg contact__bg"><i className="blob blob--c" /></div>

      <i className="cp" data-cp="0.92" data-layer="back" style={{ top: '3%' }} aria-hidden="true" />
      <i className="cp" data-cp="0.05" data-layer="back" style={{ top: '46%' }} aria-hidden="true" />

      <div className="sec__in">
        <h2 className="display h2 contact__title">
          <Split text={'HAVE AN IDEA?\nLET\u2019S BUILD IT.'} />
        </h2>
        <p className="contact__desc" data-up>
          Have a project in mind? Let's create something extraordinary together.
        </p>

        <div className="cbtns">
          {LINKS.map((l) => (
            <a key={l.label} className="cbtn" href={l.href} target="_blank" rel="noopener noreferrer" data-cursor>
              <span>{l.label}</span>
              <span className="cbtn__arrow" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="contact__end">
          <i className="endpoint" data-chain-end="0.13" aria-hidden="true" />
          <p className="contact__endtext display">END OF THE CHAIN.</p>
        </div>

        <footer className="foot">
          <span>© {SITE.year} ALL RIGHTS RESERVED.</span>
          <span>DESIGNED &amp; DEVELOPED WITH PASSION.</span>
        </footer>
      </div>
    </section>
  )
}
