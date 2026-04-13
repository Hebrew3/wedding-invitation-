import React, { useEffect, useRef, useReducer } from 'react'

function reducer(state, action) {
  const len = action.length ?? state.length ?? 0
  if (len <= 0) return { ...state, length: len }

  switch (action.type) {
    case 'GOTO': {
      const idx = action.index % len
      const next = new Set(state.loaded)
      next.add(idx)
      next.add((idx + 1) % len)
      return { index: idx, loaded: next, length: len }
    }
    case 'NEXT': {
      const idx = (state.index + 1) % len
      const next = new Set(state.loaded)
      next.add(idx)
      next.add((idx + 1) % len)
      return { index: idx, loaded: next, length: len }
    }
    case 'PREV': {
      const idx = (state.index - 1 + len) % len
      const next = new Set(state.loaded)
      next.add(idx)
      next.add((idx + 1) % len)
      return { index: idx, loaded: next, length: len }
    }
    case 'RESET_LENGTH': {
      // Keep current index if possible, otherwise reset to 0
      const idx = state.index < len ? state.index : 0
      const next = new Set(state.loaded)
      next.add(idx)
      next.add((idx + 1) % Math.max(1, len))
      return { index: idx, loaded: next, length: len }
    }
    default:
      return state
  }
}

export default function Carousel({ images = [], onClick = () => {}, autoplay = true, delay = 4000 }) {
  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    loaded: new Set([0]),
    length: images.length,
  })
  const { index } = state
  const timerRef = useRef(null)

  useEffect(() => {
    // Debug: ensure images array passed correctly
    console.log('Carousel images:', images, 'length:', images.length)
    if (!images || !images.length) console.warn('Carousel: images array is empty')
  }, [images])

  function handleImageLoad(e) {
    try {
      const img = e.target
      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height
      img.classList.remove('landscape', 'portrait')
      if (w && h) {
        if (h > w) img.classList.add('portrait')
        else img.classList.add('landscape')
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!autoplay || images.length <= 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    // ensure no duplicate intervals
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      dispatch({ type: 'NEXT', length: images.length })
    }, delay)
    console.log('Carousel autoplay started, interval id:', timerRef.current)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        console.log('Carousel autoplay stopped')
        timerRef.current = null
      }
    }
  }, [autoplay, images.length, delay])

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  // If images length changes, ensure reducer knows about it and adjust loaded set
  useEffect(() => {
    dispatch({ type: 'RESET_LENGTH', length: images.length })
  }, [images.length])

  function prev() {
    dispatch({ type: 'PREV', length: images.length })
  }
  function next() {
    dispatch({ type: 'NEXT', length: images.length })
  }

  useEffect(() => {
    // Log index change for debugging
    console.log('Carousel active index:', index)
  }, [index])

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
            <div className="carousel-image-wrap">
              {/* background layer for portrait images - CSS will use inline background-image via data attribute */}
                <img
                  className="carousel-image"
                  src={src}
                  alt={typeof src === 'string' ? `carousel-${i + 1}` : 'carousel image'}
                  loading="lazy"
                  onLoad={(e) => handleImageLoad(e, i)}
                />
                <div
                  className="carousel-image-bg"
                  aria-hidden="true"
                  style={{ backgroundImage: `url(${src})` }}
                  data-bg={src}
                />
            </div>
            <div className="carousel-caption">{/* optional caption placeholder */}</div>
          </button>
        ))}
      </div>

      <button className="carousel-prev" type="button" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="carousel-next" type="button" onClick={next} aria-label="Next slide">›</button>

      <div className="carousel-dots" aria-hidden>
        {images.map((_, i) => (
          <button key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => dispatch({ type: 'GOTO', index: i, length: images.length })} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
