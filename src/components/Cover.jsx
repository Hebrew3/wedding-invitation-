import React from 'react'

export default function Cover({ onOpen }) {
  return (
    <div className="cover cover-fullscreen">
      <div className="closed-invitation">
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
            <div className="letter-envelope__seal">
              <span className="letter-envelope__seal-core">Open</span>
            </div>
          </div>

          <button
            className="ribbon"
            aria-label="Open invitation"
            title="Open invitation"
            onClick={(e) => {
              e.stopPropagation()
              onOpen && onOpen()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen && onOpen()
              }
            }}
          >
            <span className="ribbon-text">Open</span>
          </button>
        </div>
      </div>
    </div>
  )
}
