import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowUpRight, Github, GraduationCap, Linkedin, MapPin, Menu, Moon, Pause, Play, Sun, X } from 'lucide-react'
import { CERTS, JOURNEY, NAV, PROJECTS, SKILLS, SOCIALS, type Project } from './data'
 
type Theme = 'light' | 'dark'
const FILTERS = ['All', 'Software', 'Network & Tools'] as const
 
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute('data-theme') as Theme) || 'light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch { /* storage tidak tersedia */ }
  }
  return { theme, toggle }
}
 
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
 
function MotionToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const label = on ? 'Pause animations' : 'Play animations'
  return <button className="icon-btn" onClick={onToggle} aria-label={label} aria-pressed={on} title={label}>{on ? <Pause size={18} /> : <Play size={18} />}</button>
}
 
function Navbar({ theme, toggle, motion: on, onMotion }: { theme: Theme; toggle: () => void; motion: boolean; onMotion: () => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])
  return (
    <header className="nav glass">
      <div className="wrap nav-in">
        <a href="#home" className="brand" aria-label="Ardian Rahman, home">AR</a>
        <nav className="nav-links" aria-label="Main">
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <><MotionToggle on={on} onToggle={onMotion} /><ThemeToggle theme={theme} toggle={toggle} /></>
          <a className="btn btn-primary nav-cta" href="#contact">Contact</a>
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={18} /></button>
        </div>
      </div>
      {createPortal(<AnimatePresence>
        {open && (
          <motion.div className="overlay" role="dialog" aria-modal="true" aria-label="Menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="overlay-top">
              <span className="brand">AR</span>
              <div className="nav-actions">
                <><MotionToggle on={on} onToggle={onMotion} /><ThemeToggle theme={theme} toggle={toggle} /></>
                <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus><X size={18} /></button>
              </div>
            </div>
            <nav className="overlay-links" aria-label="Mobile">
              {NAV.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </header>
  )
}
 
function Hero() {
  const chips = ['React', 'TypeScript', 'Vite', 'Cisco', 'Python', 'TCP/IP']
  return (
    <section id="home" className="hero wrap">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="mono"><span className="dot" /> Open to learning and collaboration</p>
        <h1>Interfaces that look sharp. Networks that stay up.</h1>
        <p className="lead">I'm Ardian Rahman, an Information Technology student in Jakarta. I build web interfaces and study system administration, cyber security, AI and network operations.</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#projects">View projects</a>
          <a className="btn glass glass-i" href="#contact">Get in touch</a>
        </div>
        <p className="mono muted">Jakarta, Indonesia · Universitas BSI</p>
      </motion.div>
      <motion.div className="orbit" aria-hidden="true" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
        onPointerMove={(e: PointerEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`); e.currentTarget.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 14}deg`) }}
        onPointerLeave={(e: PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }}>
        <div className="orbit-in">
          <span className="halo" /><span className="sweep" /><span className="sweep s2" />
          <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
          <div className="wheel">
            <span className="spokes" />
            {chips.map((c, i) => <span key={c} className={`chip glass n${i}`}>{c}</span>)}
          </div>
          <div className="core glass"><span>AR</span></div>
        </div>
      </motion.div>
    </section>
  )
}
 
function useJakartaClock() {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => { const id = setInterval(() => setT(fmt()), 30000); return () => clearInterval(id) }, [])
  return t
}
 
function About() {
  const time = useJakartaClock()
  return (
    <section id="about" className="section wrap">
      <h2>About</h2>
      <div className="bento">
        <article className="card glass glass-i photo-card">
          <div className="photo-top"><span className="mono">PROFILE</span><span className="mono">AR-01</span></div>
          <div className="portrait">
            <img className="portrait-img" src="/profile.png" alt="Portrait of Ardian Rahman" width={640} height={800} loading="eager" decoding="async" />
          </div>
          <div className="photo-bottom"><span><span className="dot" /> Student, open to learn</span><span className="mono"><MapPin size={12} /> Jakarta</span></div>
        </article>
        <article className="card glass glass-i about-intro">
          <h3>Hello, I'm Ardian.</h3>
          <p>I like the point where a clear web interface meets dependable infrastructure. I enjoy building front-end work and understanding how the networks and systems under it are monitored and kept running.</p>
        </article>
        <article className="card glass glass-i approach-card">
          <h3>Learn. Build. Refine.</h3>
          <p>Study the fundamentals, make something real, then improve it.</p>
        </article>
        <article className="card glass glass-i education-card">
          <GraduationCap size={20} />
          <h3>Education</h3>
          <p><strong>Universitas BSI</strong><br />Information Technology</p>
          <p><strong>SMKN 1 Jakarta</strong><br />TKJ (Computer and Network Engineering)</p>
        </article>
        <article className="card glass glass-i location-card">
          <MapPin size={20} />
          <h3>Jakarta, Indonesia</h3>
          <p className="mono">{time} WIB (UTC+7)</p>
        </article>
      </div>
      <div className="skills">
        {SKILLS.map(([t, d]) => (
          <div key={t} className="card glass glass-i skill"><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
    </section>
  )
}
 
function Certification() {
  const glow = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <section id="certification" className="section wrap">
      <h2>Certification</h2>
      <p className="muted sub">Placeholder cards. Replace them in <code>src/data.ts</code> with real credentials and verification links.</p>
      <div className="certs">
        {CERTS.map((c, i) => (
          <article key={i} className={`card glass glass-i cert cert-${i}`} onPointerMove={glow}>
            <span className="glow" aria-hidden="true" />
            <p className="mono muted">{c.issuer}</p>
            <h3>{c.title}</h3>
            {c.url
              ? <a className="btn glass-btn" href={c.url} target="_blank" rel="noopener noreferrer">Verify credential <ArrowUpRight size={16} className="arrow" /></a>
              : <button className="btn glass-btn" disabled aria-disabled="true" title="No verification link yet">Verify credential <ArrowUpRight size={16} className="arrow" /></button>}
          </article>
        ))}
      </div>
    </section>
  )
}
 
function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose])
  return (
    <motion.div className="backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal glass" role="dialog" aria-modal="true" aria-labelledby="m-title" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.22 }}>
        <button ref={closeRef} className="icon-btn modal-close" onClick={onClose} aria-label="Close project details"><X size={18} /></button>
        <p className="mono muted">{p.cat}</p>
        <h3 id="m-title">{p.title}</h3>
        <h4>Purpose</h4><p>{p.purpose}</p>
        <h4>Features</h4><ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
        <h4>Technology</h4><div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        <h4>Contribution</h4><p>{p.contribution}</p>
        {p.url && <a className="btn btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">Open project <ArrowUpRight size={16} /></a>}
      </motion.div>
    </motion.div>
  )
}
 
function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [active, setActive] = useState<Project | null>(null)
  const list = PROJECTS.filter((p) => filter === 'All' || p.cat === filter)
  return (
    <section id="projects" className="section wrap">
      <h2>Projects</h2>
      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => <button key={f} className={`filter glass-i glass${f === filter ? ' on' : ''}`} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div className="projects">
        {list.map((p) => (
          <motion.article layout key={p.id} className="card glass glass-i project" onClick={() => setActive(p)}>
            <div className="preview" aria-hidden="true"><span className="mono">{p.cat}</span></div>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            <button className="link-btn" onClick={(e) => { e.stopPropagation(); setActive(p) }} aria-label={`View details: ${p.title}`}>View details <ArrowUpRight size={14} /></button>
          </motion.article>
        ))}
      </div>
      <AnimatePresence>{active && <ProjectModal p={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  )
}
 
function Journey() {
  return (
    <section id="journey" className="section wrap">
      <h2>Journey and education</h2>
      <ol className="timeline">
        {JOURNEY.map((j, i) => (
          <li key={i} className="card glass glass-i">
            <p className="mono muted">{j.place}{j.when ? ` · ${j.when}` : ''}</p>
            <h3>{j.title}</h3><p>{j.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
 
function Contact() {
  const [err, setErr] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const name = String(d.get('name') ?? '').trim(), email = String(d.get('email') ?? '').trim(), msg = String(d.get('message') ?? '').trim()
    const next: Record<string, string> = {}
    if (name.length < 2) next.name = 'Enter your name (at least 2 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (msg.length < 10) next.message = 'Write a message of at least 10 characters.'
    setErr(next)
    // Backend/layanan email belum terhubung: jangan klaim terkirim.
    setNotice(Object.keys(next).length ? '' : 'Your details are valid, but sending is not set up yet, so nothing was sent.')
  }
  return (
    <section id="contact" className="section wrap contact">
      <div>
        <h2>Contact</h2>
        <p className="lead">Have a question or want to collaborate? Fill in the form once sending is connected.</p>
        <Socials />
      </div>
      <form className="card glass glass-i form" onSubmit={submit} noValidate>
        {[['name', 'Name', 'text'], ['email', 'Email', 'email']].map(([k, l, t]) => (
          <div key={k} className="field">
            <label htmlFor={k}>{l}</label>
            <input id={k} name={k} type={t} autoComplete={k} aria-invalid={!!err[k]} aria-describedby={err[k] ? `${k}-e` : undefined} />
            {err[k] && <p id={`${k}-e`} className="error" role="alert">{err[k]}</p>}
          </div>
        ))}
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} aria-invalid={!!err.message} aria-describedby={err.message ? 'message-e' : undefined} />
          {err.message && <p id="message-e" className="error" role="alert">{err.message}</p>}
        </div>
        <button className="btn btn-primary" type="submit">Check message</button>
        {notice && <p className="notice" role="status">{notice}</p>}
      </form>
    </section>
  )
}
 
function Socials() {
  return (
    <div className="socials">
      {SOCIALS.map((x) => {
        const Icon = x.name === 'GitHub' ? Github : Linkedin
        const inner = <><Icon size={18} /><span>{x.name}</span></>
        return x.url
          ? <a key={x.name} className="social glass glass-i" href={x.url} target="_blank" rel="noopener noreferrer" aria-label={`${x.name} profile`}>{inner}</a>
          : <span key={x.name} className="social is-off" title="Add your URL in src/data.ts">{inner}</span>
      })}
    </div>
  )
}
 
export default function App() {
  const { theme, toggle } = useTheme()
  // Default mengikuti pengaturan sistem (reduce motion). Tombol Play memaksa animasi menyala.
  const [motionOn, setMotionOn] = useState(() => document.documentElement.dataset.motion === 'on')
  const toggleMotion = () => {
    const next = !motionOn
    setMotionOn(next)
    if (next) document.documentElement.dataset.motion = 'on'
    else delete document.documentElement.dataset.motion
    try { localStorage.setItem('motion', next ? 'on' : 'off') } catch { /* storage tidak tersedia */ }
  }
  useEffect(() => {
    const root = document.documentElement
    const els = document.querySelectorAll<HTMLElement>('.section h2, .section .sub, .filters, .card, .contact .lead, .footer')
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((el) => {
      const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0
      el.style.setProperty('--d', `${Math.min(idx, 5) * 90}ms`)
      const side = idx % 3
      el.style.setProperty('--dx', side === 0 ? '-36px' : side === 2 ? '36px' : '0px')
      el.style.setProperty('--dy', side === 1 ? '40px' : '18px')
      el.classList.add('rv')
      io.observe(el)
    })
    const onScroll = () => root.style.setProperty('--p', String(root.scrollTop / ((root.scrollHeight - root.clientHeight) || 1)))
    const onMove = (e: globalThis.PointerEvent) => {
      const c = (e.target as HTMLElement).closest?.('.card') as HTMLElement | null
      if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`) }
    }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const stop = () => cancelAnimationFrame(raf)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const t = id ? document.getElementById(id) : null
      if (id && !t) return
      e.preventDefault()
      const y = t ? Math.max(0, t.getBoundingClientRect().top + window.scrollY - 76) : 0
      if (reduce && root.dataset.motion !== 'on') { window.scrollTo(0, y); return }
      const y0 = window.scrollY, dist = y - y0, dur = Math.min(1200, Math.max(700, Math.abs(dist) * 0.55))
      let st = 0
      stop()
      const step = (now: number) => {
        if (!st) st = now
        const p = Math.min((now - st) / dur, 1)
        window.scrollTo(0, y0 + dist * (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    document.addEventListener('click', onClick)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { io.disconnect(); stop(); document.removeEventListener('click', onClick); window.removeEventListener('wheel', stop); window.removeEventListener('touchstart', stop); window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove) }
  }, [])
  return (
    <MotionConfig reducedMotion={motionOn ? 'never' : 'user'}>
      <div className="page">
      <div className="progress" aria-hidden="true" />
      <Navbar theme={theme} toggle={toggle} motion={motionOn} onMotion={toggleMotion} />
      <main>
        <Hero /><About /><Certification /><Projects /><Journey /><Contact />
      </main>
      <footer className="footer wrap">
        <span><strong>Ardian Rahman</strong> · Information Technology</span>
        <nav aria-label="Footer">{NAV.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
        <Socials />
        <span className="muted">© {new Date().getFullYear()} Ardian Rahman</span>
      </footer>
      </div>
    </MotionConfig>
  )
}