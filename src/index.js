import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteProvider } from './SiteData'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
  </React.StrictMode>
)

if (window.location.pathname === '/') {
  ['/justica.bin', '/marmore.bin'].forEach((href) => {
    const link = Object.assign(document.createElement('link'), { rel: 'preload', as: 'fetch', href, crossOrigin: 'anonymous' })
    document.head.append(link)
  })
}
