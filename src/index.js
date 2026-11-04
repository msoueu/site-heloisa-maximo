import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteProvider, buscarDados } from './SiteData'

const { inicial, banco } = buscarDados()

// Enquanto o painel não responde, fica a página estática que já veio no HTML
inicial.then((dados) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <SiteProvider inicial={dados} banco={banco}>
        <App />
      </SiteProvider>
    </React.StrictMode>
  )
})
