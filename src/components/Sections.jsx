import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import PhotoFullscreen, {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconExpand,
} from './PhotoFullscreen'
import {
  IconEnvelope,
  IconCoffee,
  IconRing,
  IconParty,
  IconHeart,
} from './Icons'
import Carousel from './Carousel'
import photoCover from '../assets/DSC_7940.jpg'
import photoStory from '../assets/DSC_7091.jpg'
import photoFactsMain from '../assets/DSC_7517.jpg'
import photoHeSaid from '../assets/DSC_7855.jpg'
import photoThumbOne from '../assets/DSC.jpg'
import photoThumbTwo from '../assets/DSC_7091.jpg'
import photoThumbThree from '../assets/DSC001.jpg'
import photoAltOne from '../assets/DSC_7353.jpg'
import photoAltTwo from '../assets/DSC_7365.jpg'
import photoMilestone from '../assets/DSC_7675.jpg'
import VideoPlayer from './VideoPlayer'

export default function Sections() {
  // Load all images from the assets folder into the gallery.
  // Using Vite's import.meta.globEager to statically include asset URLs.
  // This gathers every image in src/assets into the gallery.
  let galleryAssets = []
  try {
    const modules = import.meta.globEager('../assets/*.{jpg,jpeg,png,webp}')
    galleryAssets = Object.values(modules).map((m) => m.default || m)
  } catch {
    // Fallback to any server-provided list if glob isn't available
    galleryAssets = window.__GALLERY_ASSETS__ || []
  }
  // Exclude images that should remain dedicated to other sections (Families)
  const excludedFilenames = new Set(['DSC.jpg', 'DSC001.jpg', 'ringg.png', 'ring.png'])
  galleryAssets = galleryAssets.filter((src) => {
    try {
      const fname = String(src).split('/').pop()
      return !excludedFilenames.has(fname)
    } catch {
      return true
    }
  })
  const weddingDate = new Date('2026-04-28T00:00:00')
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const elts = Array.from(document.querySelectorAll('.fade-up'))
    elts.forEach((el, idx) => el.style.setProperty('--reveal-delay', `${idx * 80}ms`))
    const onScroll = () => {
      elts.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 80) el.classList.add('in-view')
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ticker = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(ticker)
  }, [])

  // RSVP reveal removed; no showRsvp state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  // rotated state removed since toolbar controls were removed
  const [fsPhoto, setFsPhoto] = useState(null)

  const openFullscreen = useCallback((src, alt) => {
    setFsPhoto({ src, alt: alt || 'Wedding photo' })
  }, [])
  const closeFullscreen = useCallback(() => setFsPhoto(null), [])

  // Open lightbox at index
  function openLightbox(index) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  function closeLightbox() {
    setLightboxOpen(false)
  }

  const showPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + (galleryAssets.length || 1)) % (galleryAssets.length || 1))
  }, [galleryAssets.length])

  const showNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % (galleryAssets.length || 1))
  }, [galleryAssets.length])

  // Keyboard navigation for lightbox (full-screen viewer handles its own Escape + scroll lock)
  useEffect(() => {
    if (!lightboxOpen || fsPhoto) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen, fsPhoto, showNext, showPrev])

  // Lazy-load gallery, highlight and carousel images with IntersectionObserver
  useEffect(() => {
    const imgs = Array.from(
      document.querySelectorAll(
        '.gallery-item img[data-src], .highlight-item img[data-src], .carousel-slide img[data-src]'
      )
    )
    if (!imgs.length) return

    // build a deterministic index map for stagger delays based on document order
    const galleryItems = Array.from(document.querySelectorAll('.photo-grid .gallery-item'))
    const itemIndex = new Map(galleryItems.map((el, idx) => [el, idx]))

    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const img = entry.target
        const item = img.closest('.gallery-item')
        const idx = itemIndex.get(item) ?? 0
        // set a CSS variable stagger on the item so CSS can apply delays
        if (item) item.style.setProperty('--stagger', `${idx * 80}ms`)
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        // mark loaded so CSS can transition from initial state
        img.addEventListener('load', () => item && item.classList.add('loaded'), { once: true })
        observer.unobserve(img)
      })
    }, { rootMargin: '200px' })
    imgs.forEach((i) => obs.observe(i))
    return () => obs.disconnect()
  }, [])

  const lightboxNode =
    lightboxOpen &&
    createPortal(
      <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
        <button
          type="button"
          className="lightbox-close lightbox-fab"
          onClick={closeLightbox}
          aria-label="Close gallery"
        >
          <IconClose className="lightbox-fab__icon" />
          <span className="lightbox-fab__text">Close</span>
        </button>
        <button
          type="button"
          className="lightbox-prev lightbox-fab lightbox-fab--round"
          onClick={(e) => {
            e.stopPropagation()
            showPrev()
          }}
          aria-label="Previous image"
        >
          <IconChevronLeft className="lightbox-fab__icon" />
        </button>
        <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
          <img src={galleryAssets[lightboxIndex]} alt={`Gallery ${lightboxIndex + 1}`} />
        </div>
        <button
          type="button"
          className="lightbox-next lightbox-fab lightbox-fab--round"
          onClick={(e) => {
            e.stopPropagation()
            showNext()
          }}
          aria-label="Next image"
        >
          <IconChevronRight className="lightbox-fab__icon" />
        </button>
      </div>,
      document.body
    )

  const photoFullscreenPortal = createPortal(
    <PhotoFullscreen
      open={Boolean(fsPhoto)}
      src={fsPhoto?.src}
      alt={fsPhoto?.alt}
      onClose={closeFullscreen}
    />,
    document.body
  )

  const currentDateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now)

  const totalMs = Math.max(0, weddingDate.getTime() - now.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const countdownText =
    totalMs > 0
      ? `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(
          seconds
        ).padStart(2, '0')}s`
      : 'Wedding day is here!'

  return (
    <>
    <main className="magazine">
  <section id="cover" className="story-page story-page--one fade-up">
      <div className="story-page__content">
      <section className="cover-spread">
        <header className="masthead">
          <div className="masthead-left">Special Edition</div>
          <div className="masthead-title">The Wedding Post</div>
          <div className="masthead-right">
            <strong className="masthead-right-target">Tuesday, April 28, 2026</strong>
            <span className="masthead-right-date">{currentDateLabel}</span>
          </div>
        </header>
        <div className="masthead-countdown" aria-live="polite">
          <span className="masthead-countdown-label">Countdown to April 28, 2026</span>
          <strong className="masthead-countdown-time">{countdownText}</strong>
        </div>

        <h2 className="cover-head" style={{whiteSpace: 'nowrap', fontSize: '1.8rem'}}>ERIC & DIANE</h2>
        <h2 className="cover-sub" style={{whiteSpace: 'nowrap', fontSize: '1rem'}}>Are Getting Married on April 28, 2026</h2>

        <div className="cover-grid">
          <aside className="party-card program-sidebar">
            {/* Left column: kept details box only; wedding party moved to its own section below */}
          </aside>

          <div className="cover-photo">
            <div className="photo-wrap">
              <img src={photoCover} alt="Couple portrait on the invitation cover" />

              {/* photo-toolbar removed */}
            </div>

            {/* Party names spread under the cover photo (aligned to the image column) */}


          {/* Reorganized Wedding Party section placed after the cover image */}
          <section className="wedding-party" aria-labelledby="wedding-party-title">
            <h3 id="wedding-party-title" className="party-title">THE WEDDING PARTY</h3>

            <div className="party-block">
              <div className="party-group">
                <h4>PARENTS OF THE BRIDE</h4>
                <p className="role-name">Mr. Danilo &amp; Mrs. Maria Maullon</p>
              </div>

              <div className="party-group">
                <h4>PARENTS OF THE GROOM</h4>
                <p className="role-name">Mr. Felix &amp; Mrs. Victoria Ungos</p>
              </div>

              <div className="party-group">
                <h4>MAID OF HONOR</h4>
                <p className="role-name">Dawn Kathlyn D. Maullon</p>
              </div>

              <div className="party-group">
                <h4>BEST MAN</h4>
                <p className="role-name">Jomari E. Ungos</p>
              </div>

              <div className="party-group">
                <h4>PRINCIPAL SPONSORS</h4>
                <ul className="sponsor-list" style={{listStyle: 'none', paddingLeft: 0, marginTop: '8px'}}>
                  <li>Ms. Mary Jane L. Digno</li>
                  <li>Mr. Greg &amp; Mrs. Ellen De Roxas</li>
                  <li>Mr. Rolando &amp; Mrs. Marilyn Macalindong</li>
                  <li>Mr. Romano &amp; Mrs. Arlene Gomez</li>
                  <li>Mr. Christopher &amp; Mrs. Peñafrancia Tegio</li>
                  <li>Mr. Efren &amp; Mrs. Marissa Bautista</li>
                  <li>Mr. Silverio &amp; Mrs. Aileen Venzon</li>
                  <li>Mr. Danielle Monro &amp; Ms. Rosalia D. Eleponga</li>
                </ul>
              </div>

              <div className="party-group party-ceremonial">
                <h2>CEREMONIAL ROLES</h2>
                <div className="ceremonial-grid">
                  <div>
                    <h3>TO LIGHT OUR PATH</h3>
                    <p className="paired">Babelyn C. Catalan &amp; Harrie D. Cruzado</p>
                    <p className="paired">Michellen M. Dayrit &amp; Emerson D. Venzon</p>
                  </div>

                  <div>
                    <h3>TO CLOTHE AS ONE</h3>
                    <p className="paired">Maria Ella D. Noche &amp; John Michael B. Digno</p>
                    <p className="paired">Diana Jane E. Ungos &amp; Xander James U. Cruzado</p>
                  </div>

                  <div>
                    <h3>TO BIND US TOGETHER</h3>
                    <p className="paired">Austrel D. Balbanida &amp; Ken Wilton S. Venzon</p>
                    <p className="paired">Tisha Nicole S. Mallari &amp; Greco M. Umali</p>
                  </div>
                </div>
              </div>

              <div className="party-group">
                <div className="entourage-grid">
                  <div className="entourage-item">
                    <h3>BRIDE'S MAID</h3>
                    <p className="role-name">Elleah Kate D. Tegio</p>
                  </div>
                  <div className="entourage-item">
                    <h3>GROOM'S MAN</h3>
                    <p className="role-name">Rhenier A. De Jesus</p>
                  </div>
                </div>
              </div>
              <div className="party-group party-kids">
                <h2>KIDS</h2>
                <div className="entourage-grid">
                  <div className="entourage-item">
                     <div className="entourage-item">
                    <h3>BIBLE BEARER</h3>
                    <p className="role-name">Kian Pulot</p>
                  </div>
                  <div className="entourage-item">
                    <h3>RING BEARER</h3>
                    <p className="role-name">Kyden Yuan Venzon</p>
                  </div>
                  <div className="entourage-item">
                    <h3>COIN BEARER</h3>
                    <p className="role-name">Marcus Ethan C. Reyes</p>
                  </div>
                    <h3>LITTLE GENTS</h3>
                    <p className="role-name">Jan Amenadiel C. Macalalald</p>
                    <p className="role-name">Liam  M. Legaspi</p>
                    <p className="role-name">Austin Tyrone Delos Santos </p>
                  </div>
                  <div className="entourage-item">
                    <h3>FLOWER GIRLS</h3>
                    <p className="role-name">Hermione Geanna D. Daluz</p>
                    <p className="role-name">Daphny S. Morillo</p>
                    <p className="role-name">Jennel Zyreen U. Cruzado</p>
                    <p className="role-name">Hannah Faith D. Cleofe</p>
                  </div>
                  <div className="entourage-item">
                    <h3>PETAL PRINCESSES</h3>
                    <p className="role-name">Deen N. Sobrado</p>
                    <p className="role-name">Zia Emily Venzon</p>
                  </div>
                </div>
              </div>
        </div>
          </section>
          </div>
        </div>

        <div className="invite-band">You are invited !</div>

        <div className="cover-details-block" style={{margin: '1.25rem 0', padding: '1rem 1.25rem', border: '1px solid #e7dfd0', borderRadius: '4px', background: '#fff'}}>
          <div style={{maxWidth: 980, margin: '0 auto'}}>
            <div className="details-title" style={{textAlign: 'center', fontSize: '1.5rem', paddingBottom: '0.25rem'}}>The Wedding Details</div>
            <div style={{textAlign: 'center', marginBottom: '0.75rem'}}>
              <div style={{fontSize: '0.95rem', whiteSpace: 'nowrap'}}><strong>04.28.2026</strong></div>
              <div className="muted" style={{whiteSpace: 'nowrap', fontSize: '0.9rem'}}>Tuesday | Calatagan</div>
            </div>
          </div>
        </div>

        {/* Event location quick links */}
        <div className="event-locations">
          <div className="location-card">
            <div className="location-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C6.5 2 2 6.5 2 12c0 7 10 12 10 12s10-5 10-12c0-5.5-4.5-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="location-title">Wedding Ceremony</div>
              <a className="location-link" href="https://maps.app.goo.gl/2eAbBfHvJ9j7neDD9" target="_blank" rel="noopener noreferrer">Sto. Domingo de Silos Parish Church, Brgy. 2, Calatagan, Batangas</a>
            </div>
          </div>

          <div className="location-card">
            <div className="location-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C6.5 2 2 6.5 2 12c0 7 10 12 10 12s10-5 10-12c0-5.5-4.5-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div className="location-title">Wedding Reception</div>
              <a className="location-link" href="https://maps.app.goo.gl/22cLX8z8KZRqUYjo8?g_st=ic" target="_blank" rel="noopener noreferrer">Maullon Residence, Luya, Calatagan, Batangas</a>
            </div>
          </div>
        </div>

        <div className="cover-details-block" style={{margin: '1.25rem 0', padding: '1rem 1.25rem', border: '1px solid #e7dfd0', borderRadius: '4px', background: '#fff'}}>
          <div style={{maxWidth: 980, margin: '0 auto'}}>
            <div className="details-title" style={{textAlign: 'center', fontSize: '1.5rem', paddingBottom: '0.25rem'}}>The Wedding Timeline</div>
            <div style={{textAlign: 'center', marginBottom: '0.75rem'}}>
              <div className="timeline-diagram">
                <div className="timeline-item timeline-item--left">
                  <div className="bubble color-1">
                    <div className="time">8:30 AM</div>
                    <div className="desc">Entourage line up at the church</div>
                  </div>
                  <div className="node" aria-hidden="true"></div>
                </div>

                <div className="timeline-item timeline-item--right">
                  <div className="bubble color-2">
                    <div className="time">9:00 AM</div>
                    <div className="desc">Wedding Ceremony</div>
                  </div>
                  <div className="node" aria-hidden="true"></div>
                </div>

                <div className="timeline-item timeline-item--left">
                  <div className="bubble color-3">
                    <div className="time">10:00 AM</div>
                    <div className="desc">Church Photo Session / Post Nuptial</div>
                  </div>
                  <div className="node" aria-hidden="true"></div>
                </div>

                <div className="timeline-item timeline-item--right">
                  <div className="bubble color-4">
                    <div className="time">11:00 AM</div>
                    <div className="desc">Reception's Activities</div>
                  </div>
                  <div className="node" aria-hidden="true"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      </div>
      </section>

  <section id="details" className="story-page story-page--two fade-up">
      <div className="story-page__content">
      <section className="details fade-up">
        <aside className="sidebar">

          <h3 className="sidebar-section-title sidebar-section-title-sm">Wedding Color Palette</h3>
          <div className="swatches swatches-tight">
            <div style={{ background: 'var(--sw-1)' }}></div>
            <div style={{ background: 'var(--sw-2)' }}></div>
            <div style={{ background: 'var(--sw-3)' }}></div>
            <div style={{ background: 'var(--sw-4)' }}></div>
            <div style={{ background: 'var(--sw-5)' }}></div>
            <div style={{ background: 'var(--sw-6)' }}></div>
            <div style={{ background: 'var(--sw-7)' }}></div>
            <div style={{ background: 'var(--sw-8)' }}></div>
            <div style={{ background: 'var(--sw-9)' }}></div>
            <div style={{ background: 'var(--sw-10)' }}></div>
          </div>
        </aside>

        <div className="timeline" aria-hidden>
          <div className="program-photo photo-expandable">
            <img src={photoStory} alt="Couple portrait for the program section" className="program-photo-image" />
            <button
              type="button"
              className="photo-expand-btn"
              onClick={() =>
                openFullscreen(photoStory, 'Couple portrait for the program section')
              }
              aria-label="View program photo full screen"
            >
              <IconExpand className="photo-expand-btn__icon" />
            </button>
          </div>

          <div className="story story-spaced">
            <article className="story-article">
              <h3 className="story-title">Our Love Story</h3>
              <p className="lead story-opening">
                <span className="dropcap">I</span>n the hallways of high school, they were gray—mere shadows passing in the mist. They shared the same air and the same bells, yet their names remained unwritten, like white ink on a blank page. For years, they were two parallel lines traveling through the world, never realizing that fate was simply waiting for the ink to dry before drawing them together.
              </p>
              <p className="body-text">
                And then boom! the universe finally chose its stage: a gas station, a place defined by transition and fleeting stops. Ericson stood grounded in the brown grit of daily labor, while Mary Diana arrived like a flicker of yellow sunshine on a motor she was still learning to tame. In that moment, the world narrowed. As Ericson gazed at her face, the &quot;crude oil&quot;—precious and costly in the world of men—became secondary to the gold he found in her eyes. The fuel overflowed, spilling onto the metal of her bike. It was a figurative mess that cleared the way; a liquid bridge between two strangers. The gas was expensive, but the distraction was priceless!
              </p>
            </article>
          </div>

          {/* Couple facts block: large image left, facts and thumbnails right */}
          <div className="couple-facts">
            <div className="facts-grid">
              <div className="facts-left photo-expandable">
                <img src={photoFactsMain} alt="Couple portrait" />
                <button
                  type="button"
                  className="photo-expand-btn"
                  onClick={() => openFullscreen(photoFactsMain, 'Couple portrait')}
                  aria-label="View portrait full screen"
                >
                  <IconExpand className="photo-expand-btn__icon" />
                </button>
              </div>

              <div className="facts-right">
                <h3>Some Facts About The Couple</h3>
                <ul className="facts-list">
                  <li>They met again by chance at a gasoline station.</li>
                  <li>The groom loves Starbucks strawberry frappe while the bride loves Mangrane plain fruit shake but they never say no to Avocadoria.</li>
                  <li>They had their first date in Pan Dy Shadd Cafe.</li>
                  <li>Their favorite trip together was in Baguio City.</li>
                  <li>The proposal happened in Mt. Gulugod Baboy, Cuenca, Batangas, June 07, 2025.</li>
                </ul>

                <div className="thumb-row">
                  <button
                    type="button"
                    className="thumb-expand"
                    onClick={() => openFullscreen(photoAltOne, 'Couple moment one')}
                    aria-label="View couple moment one full screen"
                  >
                    <img src={photoAltOne} alt="" />
                  </button>
                  <button
                    type="button"
                    className="thumb-expand"
                    onClick={() => openFullscreen(photoThumbTwo, 'Couple moment two')}
                    aria-label="View couple moment two full screen"
                  >
                    <img src={photoThumbTwo} alt="" />
                  </button>
                  
                  <button
                    type="button"
                    className="thumb-expand"
                    onClick={() => openFullscreen(photoAltTwo, 'Couple moment three')}
                    aria-label="View couple moment three full screen"
                  >
                    <img src={photoAltTwo} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      </section>

  <section id="milestones" className="story-page story-page--three fade-up">
      <div className="story-page__content">
      <section className="milestones fade-up">
        <div className="milestones-left">
          <h3>Long Story Short</h3>
          <ul className="milestone-list">
            <li>
              <span className="milestone-icon"><IconEnvelope /></span>
              <div><strong>First Hello</strong><p>"Hello Ma'am" - April 18, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon"><IconCoffee /></span>
              <div><strong>First Date</strong><p>May 08, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon"><IconRing /></span>
              <div><strong>Yes As A Couple</strong><p>May 28, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon"><IconParty /></span>
              <div><strong>Pamamanhikan/Bulungan</strong><p>January 18, 2026</p></div>
            </li>
            <li>
              <span className="milestone-icon"><IconHeart /></span>
              <div><strong>Tying The Knot</strong><p>April 28, 2026</p></div>
            </li>
          </ul>
        </div>
        <div className="milestones-right photo-expandable">
          <img src={photoMilestone} alt="Couple by the windmill" />
          <button
            type="button"
            className="photo-expand-btn"
            onClick={() => openFullscreen(photoMilestone, 'Couple by the windmill')}
            aria-label="View photo full screen"
          >
            <IconExpand className="photo-expand-btn__icon" />
          </button>
        </div>
      </section>

      <section className="quiz fade-up">
        <div className="quiz-left">
          <h3>He Said, She Said</h3>
          <p className="quiz-note">Guess whether the bride or groom made each statement.</p>
          <div className="quiz-table-wrap">
            <table className="quiz-table">
              <thead>
                <tr><th>Statement</th><th>Bride</th><th>Groom</th></tr>
              </thead>
              <tbody>
                <tr><td>I made the first move.</td><td>□</td><td>□</td></tr>
                <tr><td>I wake up earlier.</td><td>□</td><td>□</td></tr>
                <tr><td>I said &quot;I love you&quot; first.</td><td>□</td><td>□</td></tr>
                <tr><td>I am the better cook.</td><td>□</td><td>□</td></tr>
                <tr><td>I am more organized.</td><td>□</td><td>□</td></tr>
                <tr><td>I planned the first date.</td><td>□</td><td>□</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="quiz-right photo-expandable">
          <img src={photoHeSaid} alt="Couple portrait by the wall" />
          <button
            type="button"
            className="photo-expand-btn"
            onClick={() => openFullscreen(photoHeSaid, 'Couple portrait by the wall')}
            aria-label="View photo full screen"
          >
            <IconExpand className="photo-expand-btn__icon" />
          </button>
        </div>
      </section>
      </div>
      </section>

  <section id="families" className="story-page story-page--four fade-up">
      <div className="story-page__content">
      <section className="families fade-up">
        <h3>The families that made their relationship stronger.</h3>
        <div className="family-grid">
          <button
            type="button"
            className="family-photo-tile"
            onClick={() => openFullscreen(photoThumbOne, 'Family gathering one')}
            aria-label="View family photo one full screen"
          >
            <img src={photoThumbOne} alt="" />
            <span className="family-photo-tile__shine" aria-hidden />
            <span className="family-photo-tile__hint">
              <IconExpand className="family-photo-tile__hint-icon" />
            </span>
          </button>
          <button
            type="button"
            className="family-photo-tile"
            onClick={() => openFullscreen(photoThumbThree, 'Family gathering two')}
            aria-label="View family photo two full screen"
          >
            <img src={photoThumbThree} alt="" />
            <span className="family-photo-tile__shine" aria-hidden />
            <span className="family-photo-tile__hint">
              <IconExpand className="family-photo-tile__hint-icon" />
            </span>
          </button>
        </div>
      </section>

      <section className="appreciation fade-up">
        <article>
          <h3>Share The Love</h3>
          <p>Capture your best moments, snap a great photo, and share it with the hashtag</p>
          <strong>#ERICfoundhistaDIANA</strong>
        </article>
        <article>
          <h3>Gift & Gratitude</h3>
          <p>Your presence means everything to us, and we're grateful to have you with us on our special day.</p>
          <p>Your presence is a gift in itself.</p>
        </article>
        
      </section>

  <section id="gallery" className="gallery fade-up">
        {/* Featured video - placed before gallery highlights */}
        <div className="video-feature">
          <div className="invite-band">Eric &amp; Diane — Engagement Session</div>
          <div className="video-section" style={{ margin: '1.25rem 0' }}>
            <VideoPlayer fileId="1f-MXLy5gnTXunU7pKzmJtDG-bIYcHIcq" title="Prenup Video" />
          </div>
        </div>
        <h3>Gallery</h3>
        {galleryAssets.length ? (
          <Carousel images={galleryAssets} onClick={(i) => openLightbox(i)} autoplay delay={4000} />
        ) : null}

      </section>
      </div>
      </section>
    </main>
    {lightboxNode}
    {photoFullscreenPortal}
    </>
  )
}
