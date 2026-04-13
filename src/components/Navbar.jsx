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
    // lock body scroll while menu is open (we'll show a sidebar on mobile)
    if (isOpen) {
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
    // Active link is now controlled solely via clicks so it persists until another click.
    // Previously an IntersectionObserver updated the active item when scrolling —
    // that behavior was removed to satisfy the "click to persist active" requirement.
    return undefined
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

        {/* On mobile, keep links out of the top bar and only render them when the burger menu is open */}
        {!isMobile ? (
          <div className={`site-nav__links ${isOpen ? 'is-open' : ''}`}>
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`site-nav__link ${active === l.id ? 'active' : ''}`}
                onClick={(e) => handleClick(e, l.id)}
                aria-current={active === l.id ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : (
          <div className={`site-nav__sidebar ${isOpen ? 'is-open' : ''}`}>
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`site-nav__link ${active === l.id ? 'active' : ''}`}
                onClick={(e) => handleClick(e, l.id)}
                aria-current={active === l.id ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
        {/* backdrop when menu overlays content (desktop or mobile sidebar) */}
        {isOpen && <div className="site-nav__backdrop" onClick={() => setIsOpen(false)} aria-hidden />}
      </div>
    </nav>
  )
}
