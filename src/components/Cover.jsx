import React from 'react'

export default function Cover({ onOpen }) {
  return (
    <div className="cover cover-fullscreen">
      <div className="closed-invitation">
        <div className="cover-inner">
          <div className="cover-frame-line cover-frame-line--top" aria-hidden />
          <div className="cover-crown" aria-hidden>✦ ❤ ✦</div>
          <h2 className="magazine-title">The Wedding Post – Special Edition</h2>
          <p className="cover-wedding-date">Tuesday, April 28, 2026 · Calatagan</p>
          <h1 className="couple-names">ERIC & DIANE</h1>
          <p className="cover-tagline">With love, we invite you to celebrate</p>

          <div className="cover-wedding-scene" aria-hidden>
            <div className="wedding-scene wedding-scene--inline">
              <div className="castle">
                <span className="tower left" />
                <span className="tower center" />
                <span className="tower right" />
                <span className="gate" />
              </div>
              <div className="house left-house" />
              <div className="house right-house" />
            </div>
          </div>

          <div className="envelope-wrap" aria-hidden>
            <div className="envelope" aria-hidden>
              <div className="envelope-body" />
              <div className="envelope-flap" aria-hidden />
            </div>

            <div className="cover-cta-ring" aria-hidden />
            <button
              className="ribbon"
              aria-label="Open invitation"
              title="Open invitation"
              onClick={(e) => { e.stopPropagation(); onOpen && onOpen() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen && onOpen() } }}
            >
              <span className="ribbon-text">Open</span>
            </button>
          </div>

          <div className="cover-frame-line cover-frame-line--bottom" aria-hidden />
        </div>
      </div>
    </div>
  )
}
