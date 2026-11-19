import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap.js'
import { reducedMotion } from './lib/motion.js'
import { LangProvider } from './lib/lang.jsx'
import Chain from './components/Chain.jsx'
import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Projects from './components/Projects.jsx'
import Process from './components/Process.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  useEffect(() => {
    // Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
    let lenis
    let tick
    if (!reducedMotion()) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      window.__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    // Fonts change text metrics → recalculate every trigger once they are ready.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      if (tick) gsap.ticker.remove(tick)
      if (lenis) lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  return (
    <LangProvider>
      <Chain />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
    </LangProvider>
  )
}
