import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'  // or your global CSS including Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/BORSCHT">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
