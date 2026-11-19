import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { isTouch, reducedMotion } from '../lib/motion.js'

/** Custom cursor: red dot + silver ring that grows over links and buttons. */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (isTouch() || reducedMotion()) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      root.classList.add('cursor-on')
      const hot = e.target.closest?.('a, button, [data-cursor]')
      ring.current.classList.toggle('is-hot', !!hot)
    }
    const leave = () => root.classList.remove('cursor-on')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      root.classList.remove('has-cursor', 'cursor-on')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor cursor--ring" aria-hidden="true" />
      <div ref={dot} className="cursor cursor--dot" aria-hidden="true" />
    </>
  )
}
