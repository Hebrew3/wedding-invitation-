import React, { useState } from 'react'

export default function Cover({ onOpen }) {
  const [animating, setAnimating] = useState(false)

  function handleActivate(e) {
    e.stopPropagation()
    if (animating) return
    setAnimating(true)

    // play animation then call onOpen after ~850ms
    const DURATION = 850
    setTimeout(() => {
      setAnimating(false)
      onOpen && onOpen()
    }, DURATION)
  }

  return (
    <div className="cover cover-fullscreen">
      <div className={`closed-invitation ${animating ? 'preopen' : ''}`}>
        <div className="cover-inner">
          <h2 className="magazine-title">The Wedding Post - Special Edition</h2>
          <p className="cover-wedding-date">Tuesday, April 28, 2026 · Calatagan</p>
          <h1 className="couple-names">ERIC & DIANE</h1>
          <p className="cover-tagline">With love, we invite you to celebrate</p>

          <div className="letter-envelope" aria-hidden>
            <div className="letter-envelope__paper" />
            <div className="letter-envelope__fold letter-envelope__fold--left" />
            <div className="letter-envelope__fold letter-envelope__fold--right" />
            <div className="letter-envelope__flap" />

            {/* Make the seal the only interactive control */}
            <button
              className={`letter-envelope__seal ${animating ? 'is-animating' : ''}`}
              aria-label="Open invitation"
              title="Open invitation"
              onClick={handleActivate}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleActivate(e)
                }
              }}
            >
              <span className="letter-envelope__seal-core">Open</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
