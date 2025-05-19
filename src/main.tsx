import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/LandingPage.css'
import { InterestProvider } from './contexts/InterestContext'

// Import Outfit font
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/700.css'

// Import Tajawal Arabic font
import '@fontsource/tajawal/300.css'
import '@fontsource/tajawal/400.css'
import '@fontsource/tajawal/500.css'
import '@fontsource/tajawal/700.css'

// Set document direction to RTL for Arabic
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'ar';

// Add preconnect for better performance with fonts
const preconnect = document.createElement('link');
preconnect.rel = 'preconnect';
preconnect.href = 'https://fonts.gstatic.com';
preconnect.crossOrigin = 'anonymous';
document.head.appendChild(preconnect);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <InterestProvider>
        <App />
      </InterestProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
