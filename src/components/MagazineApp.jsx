import React, { useState, useEffect, useRef } from 'react'
import Cover from './Cover'
import Sections from './Sections'
import '../styles/magazine.css'

export default function MagazineApp() {
  const [open, setOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
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

  useEffect(() => {
    if (audioRef.current) {
      if (musicOn) audioRef.current.play().catch(() => {})
      else audioRef.current.pause()
    }
  }, [musicOn])

  function handleOpenInvitation() {
    setOpen(true)
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
    } else {
      setMusicOn(true)
    }
  }

  useEffect(() => {
    const root = document.querySelector('.magazine-root')
    if (!root) return
    if (open) root.classList.add('opened')
    else root.classList.remove('opened')
  }, [open])

  return (
    <div className="magazine-root">
      <div className={`love-layer ${open ? 'is-open' : 'is-cover'}`} aria-hidden>
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

      <audio ref={audioRef} src="/music.mp3" onEnded={() => setMusicOn(false)} />

      <div className="music-toggle">
        <button
          onClick={() => {
            const audio = audioRef.current
            if (!audio) return
            if (musicOn) {
              audio.pause()
              setMusicOn(false)
              return
            }
            audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
          }}
          aria-pressed={musicOn}
        >
          {musicOn ? 'Pause Music' : 'Play Music'}
        </button>
      </div>

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
