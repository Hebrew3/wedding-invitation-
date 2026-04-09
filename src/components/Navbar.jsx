import React, { useEffect, useState, useMemo } from 'react'

export default function Navbar() {
  const links = useMemo(
    () => [
      { id: 'cover', label: 'Home' },
      { id: 'details', label: 'Details' },
      { id: 'milestones', label: 'Milestones' },
      { id: 'families', label: 'Families' },
      { id: 'gallery', label: 'Gallery' },
    ],
    []
  )

  const [active, setActive] = useState('cover')
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(max-width:720px)').matches
      : false
  )

  // track small screen state so behavior differs between desktop and mobile
  useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia('(max-width:720px)')
    const handler = (e) => setIsMobile(e.matches)
    // modern API
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [])

  // close on Escape and lock body scroll when desktop menu is open
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    // only lock body scroll on non-mobile so mobile menu can push content
    if (isOpen && !isMobile) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '-60px 0px -40% 0px',
        threshold: 0,
      }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [links])

  function handleClick(e, id) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // update active immediately for snappy feedback
    setActive(id)
    setIsOpen(false)
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <div className="site-nav__brand">The Wedding Post</div>

        <button
          className={`site-nav__burger ${isOpen ? 'is-open' : ''}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((s) => !s)}
        >
          <span className="burger-box">
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </span>
        </button>

        <div className={`site-nav__links ${isOpen ? 'is-open' : ''}`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`site-nav__link ${active === l.id ? 'active' : ''}`}
              onClick={(e) => handleClick(e, l.id)}
            >
              {l.label}
            </a>
          ))}
        </div>
        {/* backdrop only on non-mobile where menu overlays content */}
        {isOpen && !isMobile && (
          <div className="site-nav__backdrop" onClick={() => setIsOpen(false)} aria-hidden />
        )}
      </div>
    </nav>
  )
}
