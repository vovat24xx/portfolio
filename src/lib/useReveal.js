import { useLayoutEffect } from 'react'
import { gsap } from './gsap.js'
import { reducedMotion } from './motion.js'

/**
 * Scroll reveals for a section:
 *  .split   → words rise out of a mask, one by one
 *  [data-up]→ block rises and fades in
 * Everything is reverted on unmount (React StrictMode safe).
 */
export function useReveal(scope) {
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.split').forEach((el) => {
        if (el.closest('[data-no-reveal]')) return
        gsap.from(el.querySelectorAll('.split__i'), {
          yPercent: 118,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        })
      })
      gsap.utils.toArray('[data-up]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 48,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, scope)
    return () => ctx.revert()
  }, [scope])
}
