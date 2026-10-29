import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import Header from './Header'
import Home from './Home'
import { SobrePage, ConteudoPage, AtuacaoPage, ContatoPage } from './Pages'
import { veioDeRecuperacao } from './SiteData'
import useTheme from './useTheme'
import './App.css'

const Painel = lazy(() => import('./Painel'))

// Rotas por hash (#/sobre, #/conteudo) funcionam em hospedagem estática sem configuração
function lerRota() {
  const h = window.location.hash
  if (h.startsWith('#/sobre')) return 'sobre'
  if (h.startsWith('#/conteudo')) return 'conteudo'
  if (h.startsWith('#/atuacao')) return 'atuacao'
  if (h.startsWith('#/contato')) return 'contato'
  if (h.startsWith('#/painel') || veioDeRecuperacao) return 'painel'
  return 'home'
}

// #/sobre/atuacao desce até o id "atuacao" depois que a página renderiza
function rolarParaAncora() {
  const ancora = window.location.hash.split('/')[2]
  if (!ancora) {
    window.scrollTo(0, 0)
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById(ancora)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }))
}

export default function App() {
  const [rota, setRota] = useState(lerRota)
  const [endereco, setEndereco] = useState(window.location.hash)
  const [current, setCurrent] = useState(0)
  const [tema, alternarTema] = useTheme()

  useEffect(() => {
    const onHash = () => {
      setRota(lerRota())
      setEndereco(window.location.hash)
      rolarParaAncora()
    }
    rolarParaAncora()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const abrir = useCallback((pagina) => {
    if (window.location.hash === `#/${pagina}`) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = `/${pagina}`
  }, [])

  const irPara = useCallback((secao) => {
    setCurrent(secao)
    if (lerRota() !== 'home') {
      window.history.pushState(null, '', window.location.pathname)
      setRota('home')
    }
  }, [])

  return (
    <>
      <div className="app-bg" style={{ backgroundImage: 'url(/Prancheta1.jpg)' }} />
      <div className="app-vignette" />

      {rota !== 'painel' && <Header
        rota={rota}
        endereco={endereco}
        irPara={irPara}
        abrir={abrir}
        tema={tema}
        alternarTema={alternarTema}
      />}

      {rota === 'home' && <Home current={current} setCurrent={setCurrent} abrir={abrir} />}
      {rota === 'sobre' && <SobrePage abrir={abrir} />}
      {rota === 'conteudo' && <ConteudoPage abrir={abrir} />}
      {rota === 'atuacao' && <AtuacaoPage abrir={abrir} />}
      {rota === 'contato' && <ContatoPage abrir={abrir} />}
      {rota === 'painel' && <Suspense fallback={null}><Painel /></Suspense>}
    </>
  )
}
