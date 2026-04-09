import React, { useState, useEffect, useRef } from 'react'
import Cover from './Cover'
import Sections from './Sections'
import Navbar from './Navbar'
import '../styles/magazine.css'

export default function MagazineApp() {
  const [phase, setPhase] = useState('cover')
  const audioRef = useRef(null)
  const loadingTimerRef = useRef(null)
  const loveParticles = Array.from({ length: 42 }, (_, idx) => {
    const symbols = ['❤', '♡', '❣', '❥', '♥', '❤', '♡', '💗', '💕', '✦', '✧', '💖']
    return {
      id: idx,
      symbol: symbols[idx % symbols.length],
      tier: idx % 3 === 0 ? 'lg' : idx % 2 === 0 ? 'md' : 'sm',
      left: (idx * 7 + 3) % 100,
      delay: idx * 0.38,
      duration: 8.5 + (idx % 7) * 1.55,
    }
  })
  const loadingHearts = Array.from({ length: 18 }, (_, idx) => ({
    id: idx,
    left: (idx * 19 + 7) % 100,
    delay: idx * 0.22,
    duration: 3.2 + (idx % 5) * 0.35,
    size: idx % 3 === 0 ? 'lg' : idx % 2 === 0 ? 'md' : 'sm',
  }))

  function handleOpenInvitation() {
    setPhase('loading')
    loadingTimerRef.current = window.setTimeout(() => {
      setPhase('open')
    }, 5000)
  }

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'open') return
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [phase])

  useEffect(() => {
    const root = document.querySelector('.magazine-root')
    if (!root) return
    if (phase === 'open') root.classList.add('opened')
    else root.classList.remove('opened')
  }, [phase])

  return (
    <div className="magazine-root magazine-shell">
      {/* Floating hearts — full app (cover + invitation); pointer-events none, below modals */}
      <div className={`love-layer ${phase === 'open' ? 'is-open' : 'is-cover'}`} aria-hidden>
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

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music.mp3`}
        preload="auto"
        playsInline
      />

      {phase === 'cover' ? (
        <div key="cover" className="cover-wrapper fade-in">
          <Cover onOpen={handleOpenInvitation} />
        </div>
      ) : phase === 'loading' ? (
        <div className="cover-loading" role="status" aria-live="polite">
          <div className="loading-hearts" aria-hidden>
            {loadingHearts.map((heart) => (
              <span
                key={`loading-heart-${heart.id}`}
                className={`loading-heart ${heart.size}`}
                style={{
                  left: `${heart.left}%`,
                  animationDelay: `${heart.delay}s`,
                  animationDuration: `${heart.duration}s`,
                }}
              >
                ❤
              </span>
            ))}
          </div>
          <div className="cover-loading-card">
            <div className="cover-loading-rings" aria-hidden>💍 💍</div>
            <p className="cover-loading-text">
              With love special guest, we invite you to celebrate!
            </p>
            <div className="cover-loading-bar" aria-hidden>
              <span className="cover-loading-bar__fill" />
            </div>
          </div>
        </div>
      ) : (
        <div key="magazine" className="magazine-wrapper fade-in">
          {phase === 'open' ? <Navbar /> : null}
          <Sections />
        </div>
      )}
    </div>
  )
}
