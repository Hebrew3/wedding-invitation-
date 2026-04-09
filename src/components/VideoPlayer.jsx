import React from 'react'

export default function VideoPlayer({ fileId, title = 'Wedding video' }) {
  if (!fileId) return null
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`

  return (
    <div className="video-player-wrap" style={{ maxWidth: 980, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
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
