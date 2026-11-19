import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap.js'
import { reducedMotion, isSmall, goTo } from '../lib/motion.js'
import { VIDEO, SITE } from '../config.js'
import Split from './Split.jsx'

export default function Hero() {
  const root = useRef(null)
  const vid = useRef(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(!reducedMotion())
  const [src] = useState(() => (isSmall() ? VIDEO.srcSmall : VIDEO.src))

  /* one orchestrated entrance: video rises out of the dark → headline → details */
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.stage__media', { opacity: 0, scale: 1.1, duration: 2, ease: 'power2.out' }, 0)
        .from('.hero__title .split__i', { yPercent: 120, duration: 1.3, stagger: 0.07 }, 0.35)
        .from('.hero__fade', { opacity: 0, y: 22, duration: 1, stagger: 0.09 }, 1.1)
    }, root)
    return () => ctx.revert()
  }, [])

  /* autoplay, pause when scrolled away (saves battery), respect reduced motion */
  useEffect(() => {
    const v = vid.current
    if (!v) return
    v.muted = true
    const play = () => v.play().catch(() => {})
    if (reducedMotion()) v.pause()
    else play()
    const io = new IntersectionObserver(([e]) => {
      if (userPaused.current || reducedMotion()) return
      if (e.isIntersecting) play()
      else v.pause()
    }, { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const v = vid.current
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); setPlaying(true) }
    else { userPaused.current = true; v.pause(); setPlaying(false) }
  }

  return (
    <section id="top" className={`sec hero ${VIDEO.hasWatermark ? 'has-wm' : ''}`} ref={root}>
      <div className="sec__bg hero__bg" />
      <div className="sec__in hero__in">
        <div className="hero__meta">
          <span className="hero__fade">WEB DEVELOPER / DIGITAL CREATOR</span>
          <span className="hero__fade avail"><i aria-hidden="true" />AVAILABLE FOR PROJECTS</span>
        </div>

        <h1 className="hero__title display" aria-label="I BUILD DIGITAL EXPERIENCES.">
          <Split text={'I BUILD\nDIGITAL EXPERIENCES.'} data-no-reveal />
        </h1>

        <div className="stage">
          <div className="stage__media">
            <video
              ref={vid}
              src={src}
              poster={VIDEO.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <i className="stage__anchor" data-chain-start aria-hidden="true" />
          <button className="vctl" onClick={toggle} aria-label={playing ? 'Pause background video' : 'Play background video'}>
            {playing ? 'PAUSE' : 'PLAY'}
          </button>
        </div>

        <div className="hero__info">
          <div>
            <p className="hero__sub hero__fade">Websites. Telegram Bots. Digital Solutions.</p>
            <p className="hero__desc hero__fade">I create modern digital experiences for businesses and brands.</p>
          </div>
          <div className="hero__cta hero__fade">
            <a className="btn btn--red" href="#work" onClick={(e) => { e.preventDefault(); goTo('#work') }}>EXPLORE MY WORK</a>
            <a className="btn btn--line" href="#contact" onClick={(e) => { e.preventDefault(); goTo('#contact') }}>LET'S TALK</a>
          </div>
          <span className="hero__year hero__fade">{SITE.year} — PORTFOLIO</span>
        </div>
      </div>
      <i className="cp" data-cp="0.05" data-layer="front" style={{ bottom: '0' }} aria-hidden="true" />
    </section>
  )
}
