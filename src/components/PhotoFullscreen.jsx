import { useEffect } from 'react'

export function IconExpand({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
      />
    </svg>
  )
}

export function IconRotate({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.64-.8 3.09-2.03 4h2.92A6.98 6.98 0 0019 13c0-3.31-2.69-6-6-6zm-6 4c0-1.64.8-3.09 2.03-4H5.11A6.98 6.98 0 005 13c0 3.31 2.69 6 6 6v3l4-4-4-4v3c-2.76 0-5-2.24-5-5z"
      />
    </svg>
  )
}

export function IconChevronLeft({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  )
}

export function IconChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  )
}

export function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  )
}

/**
 * Full-viewport photo viewer (above page chrome, below nothing).
 */
export default function PhotoFullscreen({ open, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div
      className="photo-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Full screen photo"
    >
      <div className="photo-fullscreen__scrim" onClick={onClose} aria-hidden="true" />
      <button type="button" className="photo-fullscreen__close" onClick={onClose} aria-label="Close">
        <IconClose className="photo-fullscreen__close-icon" />
        <span className="photo-fullscreen__close-text">Close</span>
      </button>
      <div className="photo-fullscreen__stage">
        <img src={src} alt={alt || ''} className="photo-fullscreen__img" draggable={false} />
      </div>
    </div>
  )
}
