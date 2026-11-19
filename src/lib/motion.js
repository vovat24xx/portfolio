export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const isSmall = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches

/** Smooth-scroll to a #hash (uses Lenis when it is running). */
export function goTo(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}
