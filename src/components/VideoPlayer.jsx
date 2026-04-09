import React, { useState } from 'react'

export default function VideoPlayer({ fileId, title = 'Wedding video' }) {
  const [overlayVisible, setOverlayVisible] = useState(true)
  if (!fileId) return null
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`

  function handlePlayTrigger() {
    // notify the app to pause background music
    try {
      window.dispatchEvent(new CustomEvent('app:video-play'))
    } catch (err) {
      // best-effort event dispatch, logging failures helps debugging in dev
      // (don't throw — silent fail in production)
      // eslint-disable-next-line no-console
      console.debug('dispatch app:video-play failed', err)
    }
    // hide overlay so user can interact with iframe
    setOverlayVisible(false)
  }

  return (
    <div className="video-player-wrap" style={{ maxWidth: 980, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
        {overlayVisible && (
          <button
            type="button"
            className="video-play-overlay"
            onClick={handlePlayTrigger}
            aria-label="Play video"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.35))',
              color: '#fff',
              fontSize: 44,
              border: 0,
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            ►
          </button>
        )}

        <iframe
          title={title}
          src={previewUrl}
          allow="autoplay; encrypted-media; fullscreen"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
      <p style={{ fontSize: 13, color: '#444', marginTop: 8 }}>
        If the video doesn't play inline, <a href={viewUrl} target="_blank" rel="noopener noreferrer">open it on Google Drive</a>.
      </p>
    </div>
  )
}
