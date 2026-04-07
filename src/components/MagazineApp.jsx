import React, { useState, useEffect, useRef } from 'react'
import Cover from './Cover'
import Sections from './Sections'
import '../styles/magazine.css'

export default function MagazineApp() {
  const [open, setOpen] = useState(false)
  const audioRef = useRef(null)
  const loveParticles = Array.from({ length: 28 }, (_, idx) => {
    const symbols = ['❤', '♡', '❣', '❥', '✦', '✧']
    return {
      id: idx,
      symbol: symbols[idx % symbols.length],
      tier: idx % 3 === 0 ? 'lg' : idx % 2 === 0 ? 'md' : 'sm',
      left: (idx * 11 + 5) % 100,
      delay: idx * 0.45,
      duration: 9 + (idx % 6) * 1.7,
    }
  })

  function handleOpenInvitation() {
    setOpen(true)
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  useEffect(() => {
    const root = document.querySelector('.magazine-root')
    if (!root) return
    if (open) root.classList.add('opened')
    else root.classList.remove('opened')
  }, [open])

  return (
    <div className="magazine-root magazine-shell">
      {/* Floating hearts/sparkles only on the closed cover */}
      {!open && (
        <div className="love-layer is-cover" aria-hidden>
          {loveParticles.map((particle) => (
            <span
              key={`love-${particle.id}`}
              className={`love-particle ${particle.tier}`}
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.symbol}
            </span>
          ))}
        </div>
      )}

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music.mp3`}
        preload="auto"
        playsInline
      />

      {!open ? (
        <div key="cover" className="cover-wrapper fade-in">
          <Cover onOpen={handleOpenInvitation} />
        </div>
      ) : (
        <div key="magazine" className="magazine-wrapper fade-in">
          <Sections />
        </div>
      )}
    </div>
  )
}
