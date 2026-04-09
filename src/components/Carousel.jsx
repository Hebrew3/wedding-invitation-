import React, { useEffect, useRef, useState } from 'react'

export default function Carousel({ images = [], onClick = () => {}, autoplay = true, delay = 4000 }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!autoplay || images.length <= 1) return
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), delay)
    return () => clearInterval(timerRef.current)
  }, [autoplay, images.length, delay])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }
  function next() {
    setIndex((i) => (i + 1) % images.length)
  }

  return (
    <div className="carousel">
      <div className="carousel-inner" role="region" aria-roledescription="carousel">
        {images.map((src, i) => (
          <button
            key={i}
            className={`carousel-slide ${i === index ? 'is-active' : ''}`}
            onClick={() => onClick(i)}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img data-src={src} alt={`carousel-${i + 1}`} loading="lazy" />
            <div className="carousel-caption">{/* optional caption placeholder */}</div>
          </button>
        ))}
      </div>

      <button className="carousel-prev" type="button" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="carousel-next" type="button" onClick={next} aria-label="Next slide">›</button>

      <div className="carousel-dots" aria-hidden>
        {images.map((_, i) => (
          <button key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
