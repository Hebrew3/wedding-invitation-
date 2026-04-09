import React from 'react'
import VideoPlayer from './VideoPlayer'
import Carousel from './Carousel'

export default function GalleryHighlights({ galleryAssets = [], openLightbox = () => {} }) {
  const CAROUSEL_COUNT = 5
  const HIGHLIGHTS_COUNT = 4
  const carouselImages = galleryAssets.slice(0, CAROUSEL_COUNT)
  const highlights = galleryAssets.slice(CAROUSEL_COUNT, CAROUSEL_COUNT + HIGHLIGHTS_COUNT)
  const remaining = galleryAssets.slice(CAROUSEL_COUNT + HIGHLIGHTS_COUNT)

  return (
    <section id="gallery" className="gallery fade-up">
      <h2>Gallery</h2>

      <div className="video-section" style={{ margin: '1.25rem 0' }}>
        <VideoPlayer fileId="1f-MXLy5gnTXunU7pKzmJtDG-bIYcHIcq" title="Wedding video - Eric & Diane" />
      </div>

      {carouselImages.length ? (
        <div style={{ marginBottom: 16 }}>
          <Carousel images={carouselImages} onClick={(i) => openLightbox(i)} autoplay delay={3500} />
        </div>
      ) : null}

      <div className="highlights-grid">
        {highlights.map((src, i) => (
          <button
            key={i + CAROUSEL_COUNT}
            className="highlight-item"
            onClick={() => openLightbox(i + CAROUSEL_COUNT)}
            aria-label={`Open highlight ${i + 1}`}
          >
            <img data-src={src} alt={`highlight-${i + CAROUSEL_COUNT}`} loading="lazy" />
          </button>
        ))}
      </div>

      <div className="photo-grid masonry">
        {remaining.length ? (
          remaining.map((src, i) => (
            // i is index within remaining; add offset to match original gallery index
            <button
              key={i + CAROUSEL_COUNT + HIGHLIGHTS_COUNT}
              className="gallery-item"
              onClick={() => openLightbox(i + CAROUSEL_COUNT + HIGHLIGHTS_COUNT)}
              aria-label={`Open image ${i + 1 + CAROUSEL_COUNT + HIGHLIGHTS_COUNT}`}
            >
              <img data-src={src} alt={`gallery-${i + CAROUSEL_COUNT + HIGHLIGHTS_COUNT}`} loading="lazy" />
            </button>
          ))
        ) : null}
      </div>
    </section>
  )
}
