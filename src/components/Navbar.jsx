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
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <div className="site-nav__brand">The Wedding Post</div>
        <div className="site-nav__links">
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
      </div>
    </nav>
  )
}
