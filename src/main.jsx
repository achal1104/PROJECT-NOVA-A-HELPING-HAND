import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import {LangProvider} from './i18n'
import './styles.css'
createRoot(document.getElementById('root')).render(<BrowserRouter><LangProvider><App/></LangProvider></BrowserRouter>)
// PWA: offline-friendly app shell (production builds only)
if('serviceWorker' in navigator&&import.meta.env&&import.meta.env.PROD){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}