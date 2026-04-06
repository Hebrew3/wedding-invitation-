import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Collect gallery assets using Vite's glob imports
const modules = import.meta.glob('./assets/*.{png,jpg,jpeg,gif,webp}', { eager: true })
window.__GALLERY_ASSETS__ = Object.values(modules)
  .map((m) => (typeof m === 'string' ? m : m?.default))
  .filter(Boolean)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
