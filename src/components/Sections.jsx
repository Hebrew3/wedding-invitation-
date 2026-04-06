import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import photoCover from '../assets/DSC_7496.jpg'
import photoStory from '../assets/DSC_7091.jpg'
import photoFactsMain from '../assets/DSC_7517.jpg'
import photoThumbOne from '../assets/DSC_7456.jpg'
import photoThumbTwo from '../assets/DSC_7353.jpg'
import photoThumbThree from '../assets/DSC_7091.jpg'

function Countdown({ date }) {
  const [now, setNow] = useState(dayjs())
  useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = dayjs(date).diff(now)
  const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const h = Math.max(0, dayjs(date).diff(now, 'hour') % 24)
  const m = Math.max(0, dayjs(date).diff(now, 'minute') % 60)
  const s = Math.max(0, dayjs(date).diff(now, 'second') % 60)
  return (
    <div className="countdown">
      <span>{d}d</span>
      <span>{h}h</span>
      <span>{m}m</span>
      <span>{s}s</span>
    </div>
  )
}

// RSVP form removed per request; keep RSVP link in footer if needed

export default function Sections() {
  const weddingDate = '2026-09-12T09:00:00'
  const galleryAssets = window.__GALLERY_ASSETS__?.slice(0, 12) || []

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

  // RSVP reveal removed; no showRsvp state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [rotated, setRotated] = useState(false)

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
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
  }, [lightboxOpen, showNext, showPrev])

  // Lazy-load gallery images with IntersectionObserver
  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll('.gallery-item img[data-src]'))
    if (!imgs.length) return
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute('data-src')
        observer.unobserve(img)
      })
    }, { rootMargin: '200px' })
    imgs.forEach((i) => obs.observe(i))
    return () => obs.disconnect()
  }, [])

  return (
    <main className="magazine">
      <section className="cover-spread">
        <header className="masthead">
          <div className="masthead-left">Special Edition</div>
          <div className="masthead-title">The Wedding Post</div>
          <div className="masthead-right">Tuesday, April 28, 2026</div>
        </header>

        <h1 className="cover-head">ERIC & DIANE</h1>
        <h2 className="cover-sub">Are Getting Married on April 28, 2026</h2>

        <div className="cover-grid">
          <aside className="party-card program-sidebar">
            <div className="details-box">
              <div className="details-title">The Wedding Details</div>
              <div className="details-date"><strong>04.28.2026</strong><br/><span className="muted">Tuesday | Calatagan</span></div>

              <div className="venue venue-top-space">
                <div className="venue-icon">⛪</div>
                <div className="venue-text"><strong>Wedding Ceremony:</strong><br />Sto. Domingo de Silos Parish Church<br />Brgy. 2, Calatagan, Batangas</div>
              </div>

              <div className="venue venue-gap-sm">
                <div className="venue-icon">🏠</div>
                <div className="venue-text"><strong>Wedding Reception:</strong><br />Maullon Residence<br />Luya, Calatagan, Batangas</div>
              </div>
            </div>
            <div className="party-title">THE WEDDING PARTY</div>
            <div className="party-list">
              <div className="role">
                <div className="role-label">PARENTS OF THE BRIDE</div>
                <div className="role-name">Mr. Danilo &amp; Mrs. Maria Maullon</div>
              </div>

              <div className="role">
                <div className="role-label">PARENTS OF THE GROOM</div>
                <div className="role-name">Mr. Felix &amp; Mrs. Victoria Ungos</div>
              </div>

              <div className="role">
                <div className="role-label">MAID OF HONOR</div>
                <div className="role-name">Dawn Kathlyn D. Maullon</div>
              </div>

              <div className="role">
                <div className="role-label">BEST MAN</div>
                <div className="role-name">Jomari E. Ungos</div>
              </div>

              <div className="role sponsors">
                <div className="role-label">PRINCIPAL SPONSORS</div>
                <ul className="sponsor-list">
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
            </div>
          </aside>

          <div className="cover-photo">
            <div className={`photo-wrap ${rotated ? 'rotated' : ''}`}>
              <img src={photoCover} alt="Couple portrait on the invitation cover" />

              <div className="photo-controls">
                <button className="ctrl" onClick={() => setRotated((r) => !r)} aria-label="Rotate photo">⤾</button>
                <button className="ctrl" title="Drag to move" aria-label="Move photo">✥</button>
              </div>
            </div>

            {/* Party names spread under the cover photo (aligned to the image column) */}
            <div className="party-spread">
              <div className="party-col left">
                <h4>TO LIGHT OUR PATH</h4>
                <p className="name">Babelyn C. Catalan</p>
                <p className="name highlight">Michellen M. Dayrit</p>

                <h4>TO CLOTHE AS ONE</h4>
                <p className="name">Maria Ella D. Noche</p>
                <p className="name">Diana Jane E. Ungos</p>

                <h4>TO BIND US TOGETHER</h4>
                <p className="name">Austrel D. Balbanida</p>
                <p className="name">Tisha Nicole S. Mallari</p>

                <h4>BRIDE'S MAID</h4>
                <p className="name">Elleah Kate D. Tegio</p>

                <h5>BIBLE BEARER</h5>
                <p className="name">Kian Pulot</p>

                <h5>COIN BEARER</h5>
                <p className="name">Marcus Ethan C. Reyes</p>
              </div>

              <div className="party-col center">
                <h4>LITTLE GENTS</h4>
                <p className="name">Harrie D. Cruzado</p>
                <p className="name">Emerson D. Venzon</p>
                <p className="name">Jan Amenadiel C. Macalalald</p>
                <p className="name">Liam M. Legaspi</p>
                <p className="name">Austin Tyrone Delos Santos</p>

                <h4>GROOM'S MAN</h4>
                <p className="name">Rhenier A. De Jesus</p>

                <h4>RING BEARER</h4>
                <p className="name">Kyden Yuan Venzon</p>
              </div>

              <div className="party-col right">
                <h4>FLOWER GIRLS</h4>
                <p className="name">Hermione Geanna D. Daluz</p>
                <p className="name">Daphny S. Morillo</p>
                <p className="name">Jennel Zyreen U. Cruzado</p>
                <p className="name">Hannah Faith D. Cleofe</p>

                <h4>PETAL PRINCESSES</h4>
                <p className="name">Deen N. Sobrado</p>
                <p className="name">Zia Emily Venzon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="invite-band">You are invited !</div>

        {/* Event location quick links */}
        <div className="event-locations">
          <div className="location-card">
            <div className="location-icon">⛪</div>
            <div>
              <div className="location-title">Ceremony</div>
              <a className="location-link" href="https://www.google.com/maps/search/Sto.+Domingo+de+Silos+Parish+Church+Calatagan" target="_blank" rel="noopener noreferrer">Sto. Domingo de Silos Parish Church, Brgy. 2, Calatagan, Batangas</a>
            </div>
          </div>

          <div className="location-card">
            <div className="location-icon">🏠</div>
            <div>
              <div className="location-title">Reception</div>
              <a className="location-link" href="https://www.google.com/maps/search/Maullon+Residence+Luya+Calatagan" target="_blank" rel="noopener noreferrer">Maullon Residence, Luya, Calatagan, Batangas</a>
            </div>
          </div>
        </div>
      </section>

      <section className="details fade-up">
        <aside className="sidebar">
          <h3>The Wedding Details</h3>
          <p className="muted"><strong>04.28.2026</strong><br />Tuesday | Calatagan</p>
          <p className="sidebar-block"><strong>Wedding Ceremony:</strong><br />Sto. Domingo de Silos Parish Church<br />Brgy. 2, Calatagan, Batangas</p>
          <p className="sidebar-block sidebar-block-tight"><strong>Wedding Reception:</strong><br />Maullon Residence<br />Luya, Calatagan, Batangas</p>

          <h3 className="sidebar-section-title">The Wedding Timeline</h3>
          <ul className="sidebar-timeline-list">
            <li><strong>8:30 AM</strong> — Entourage line up at the church</li>
            <li><strong>9:00 AM</strong> — Wedding Ceremony</li>
            <li><strong>10:00 AM</strong> — Church Photo Session / Post Nuptial</li>
            <li><strong>11:00 AM</strong> — Reception's Activities</li>
          </ul>

          <h3 className="sidebar-section-title sidebar-section-title-sm">Wedding Color Palette</h3>
          <div className="swatches swatches-tight">
            <div style={{ background: '#f6f1e6' }}></div>
            <div style={{ background: '#fff' }}></div>
            <div style={{ background: '#b9a07b' }}></div>
            <div style={{ background: '#d9caa9' }}></div>
            <div style={{ background: '#8fa89a' }}></div>
          </div>
        </aside>

        <div className="timeline" aria-hidden>
          <div className="program-photo">
            <img src={photoStory} alt="Couple portrait for the program section" className="program-photo-image" />
          </div>

          <div className="story story-spaced">
            <article>
              <h3 className="story-title">Our Love Story</h3>
              <p className="dropcap">I</p>
              <p className="lead">n the hallways of high school, they were gray—mere shadows passing in the mist. They shared the same air and the same bells, yet their names remained unwritten, like white ink on a blank page. For years, they were two parallel lines traveling through the world, never realizing that fate was simply waiting for the ink to dry before drawing them together.</p>
              <p className="body-text">And then boom! the universe finally chose its stage: a gas station, a place defined by transition and fleeting stops. Ericson stood grounded in the brown grit of daily labor, while Mary Diana arrived like a flicker of yellow sunshine on a motor she was still learning to tame. In that moment, the world narrowed. As Ericson gazed at her face, the "crude oil"—precious and costly in the world of men—became secondary to the gold he found in her eyes. The fuel overflowed, spilling onto the metal of her bike. It was a figurative mess that cleared the way; a liquid bridge between two strangers. The gas was expensive, but the distraction was priceless!</p>
            </article>
          </div>

          {/* Couple facts block: large image left, facts and thumbnails right */}
          <div className="couple-facts">
            <div className="facts-grid">
              <div className="facts-left">
                <img src={photoFactsMain} alt="Couple portrait" />
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
                  <img src={photoThumbOne} alt="Couple moment one" />
                  <img src={photoThumbTwo} alt="Couple moment two" />
                  <img src={photoThumbThree} alt="Couple moment three" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="milestones fade-up">
        <div className="milestones-left">
          <h3>Long Story Short</h3>
          <ul className="milestone-list">
            <li>
              <span className="milestone-icon">💌</span>
              <div><strong>First Hello</strong><p>"Hello Ma'am" - April 18, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon">☕</span>
              <div><strong>First Date</strong><p>May 08, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon">💍</span>
              <div><strong>Yes As A Couple</strong><p>May 28, 2022</p></div>
            </li>
            <li>
              <span className="milestone-icon">🎉</span>
              <div><strong>Pamamanhikan/Bulungan</strong><p>January 08, 2026</p></div>
            </li>
            <li>
              <span className="milestone-icon">🤍</span>
              <div><strong>Tying The Knot</strong><p>April 28, 2026</p></div>
            </li>
          </ul>
        </div>
        <div className="milestones-right">
          <img src={photoThumbThree} alt="Couple by the windmill" />
        </div>
      </section>

      <section className="quiz fade-up">
        <div className="quiz-left">
          <h3>He Said, She Said</h3>
          <p className="quiz-note">Guess whether the bride or groom made each statement.</p>
          <table className="quiz-table">
            <thead>
              <tr><th>Statement</th><th>Bride</th><th>Groom</th></tr>
            </thead>
            <tbody>
              <tr><td>I made the first move.</td><td>□</td><td>□</td></tr>
              <tr><td>I wake up earlier.</td><td>□</td><td>□</td></tr>
              <tr><td>I said "I love you" first.</td><td>□</td><td>□</td></tr>
              <tr><td>I am the better cook.</td><td>□</td><td>□</td></tr>
              <tr><td>I am more organized.</td><td>□</td><td>□</td></tr>
              <tr><td>I planned the first date.</td><td>□</td><td>□</td></tr>
            </tbody>
          </table>
        </div>
        <div className="quiz-right">
          <img src={photoCover} alt="Couple portrait by the wall" />
        </div>
      </section>

      <section className="families fade-up">
        <h3>The families that made their relationship stronger.</h3>
        <div className="family-grid">
          <img src={photoThumbOne} alt="Family gathering one" />
          <img src={photoThumbTwo} alt="Family gathering two" />
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

      <section className="gallery fade-up">
        <h3>Gallery Highlights</h3>
        <div className="photo-grid masonry">
          {galleryAssets.length ? (
            galleryAssets.map((src, i) => (
              <button
                key={i}
                className="gallery-item"
                onClick={() => openLightbox(i)}
                aria-label={`Open image ${i + 1}`}
              >
                <img data-src={src} alt={`gallery-${i}`} loading="lazy" />
              </button>
            ))
          ) : null}
        </div>

        {lightboxOpen && (
          <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>
            <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); showPrev() }} aria-label="Previous">‹</button>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
              <img src={galleryAssets[lightboxIndex]} alt={`lightbox-${lightboxIndex}`} />
            </div>
            <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); showNext() }} aria-label="Next">›</button>
          </div>
        )}
      </section>

      <footer className="magazine-footer">
        <Countdown date={weddingDate} />
      </footer>
    </main>
  )
}
