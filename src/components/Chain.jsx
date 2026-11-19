import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { createChainRenderer } from '../lib/chainCore.js'
import { reducedMotion } from '../lib/motion.js'

/*
 * The continuous silver chain.
 *
 * Two fixed, full-viewport canvases:
 *   back  (z-index 1) → sits BEHIND section content
 *   front (z-index 3) → sits IN FRONT of section content
 *
 * The route is built from DOM markers:
 *   [data-chain-start]            start (bottom-left of the hero video)
 *   [data-cp="0.07"]              waypoint, value = x position (0 left … 1 right)
 *       data-layer="front|back"   which layer the chain uses from this point on
 *   [data-chain-end="0.12"]       final ring (Contact section)
 * Move a waypoint in the JSX (style top / data-cp) to re-route the chain.
 */
export default function Chain() {
  const front = useRef(null)
  const back = useRef(null)

  useEffect(() => {
    const reduce = reducedMotion()
    const r = createChainRenderer(front.current, back.current)
    const st = { y: window.scrollY, vel: 0, reveal: 0 }
    const t0 = performance.now()
    let dirty = true
    let timer

    const measure = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const small = w < 760
      r.resize(w, h, Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
      const sy = window.scrollY
      // on phones the chain hugs the screen edges so it never covers text
      const X = (f) => (small ? (f < 0.5 ? 0.03 : 0.97) : f) * w

      const pts = []
      const start = document.querySelector('[data-chain-start]')
      if (start) {
        const b = start.getBoundingClientRect()
        pts.push({ x: b.left + b.width / 2, y: b.top + sy, layer: 'front' })
      }
      document.querySelectorAll('[data-cp]').forEach((el) => {
        const b = el.getBoundingClientRect()
        pts.push({
          x: X(parseFloat(el.dataset.cp)),
          y: b.top + sy,
          layer: el.dataset.layer === 'back' ? 'back' : 'front',
        })
      })
      pts.sort((a, b) => a.y - b.y)
      const clean = pts.filter((p, i) => i === 0 || p.y - pts[i - 1].y > 24)

      const end = document.querySelector('[data-chain-end]')
      if (end) {
        const b = end.getBoundingClientRect()
        const ex = (small ? 0.22 : parseFloat(end.dataset.chainEnd) || 0.12) * w
        const ey = b.top + sy
        if (!clean.length || ey - clean[clean.length - 1].y > 24) clean.push({ x: ex, y: ey, layer: 'front' })
      }
      r.setPath(clean)
      if (reduce) st.reveal = r.total
      dirty = true
    }

    const tick = (time) => {
      if (document.hidden) return
      if (reduce && !dirty) return
      dirty = false
      const introDone = reduce || performance.now() - t0 > 1500
      const target = introDone ? r.sAtY(st.y + window.innerHeight * 0.92) : 0
      st.reveal = reduce ? r.total : st.reveal + (target - st.reveal) * 0.1
      st.vel *= 0.93
      r.render({
        scrollY: st.y,
        reveal: st.reveal,
        time,
        vel: st.vel,
        twist: reduce ? 0.7 : st.y * 0.0042 + time * 0.3,
        sway: reduce ? 0 : 1,
      })
    }

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        st.y = self.scroll()
        st.vel = Math.min(1, Math.abs(self.getVelocity()) / 2500)
        dirty = true
      },
      onRefresh: (self) => { st.y = self.scroll(); dirty = true },
    })

    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(() => { measure(); ScrollTrigger.refresh() }, 140)
    }
    // layout changes (language switch, filters, images, fonts) → rebuild the route
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    window.addEventListener('resize', schedule)

    measure()
    document.fonts?.ready.then(measure)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      trigger.kill()
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <canvas ref={back} className="chain chain--back" aria-hidden="true" />
      <canvas ref={front} className="chain chain--front" aria-hidden="true" />
    </>
  )
}
