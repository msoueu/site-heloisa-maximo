import { useState, useEffect, useLayoutEffect, useCallback, lazy, Suspense } from 'react'
import Header from './Header'
import Home, { ModelBoundary } from './Home'
import { SobrePage, ConteudoPage, AtuacaoPage, ContatoPage } from './Pages'
import { veioDeRecuperacao } from './SiteData'
import useTheme from './useTheme'
import './App.css'

const Painel = lazy(() => import('./Painel'))
const DiagnosticoPage = lazy(() => import('./Diagnostico'))
const PerguntasPage = lazy(() => import('./Perguntas'))
const PrivacidadePage = lazy(() => import('./Legal').then((m) => ({ default: m.PrivacidadePage })))
const TermosPage = lazy(() => import('./Legal').then((m) => ({ default: m.TermosPage })))
const Particulas = lazy(() => import('./Particulas'))

// Rotas por hash (#/sobre, #/conteudo) funcionam em hospedagem estática sem configuração
function lerRota() {
  const h = window.location.hash
  if (h.startsWith('#/sobre')) return 'sobre'
  if (h.startsWith('#/conteudo')) return 'conteudo'
  if (h.startsWith('#/atuacao')) return 'atuacao'
  if (h.startsWith('#/contato')) return 'contato'
  if (h.startsWith('#/diagnostico')) return 'diagnostico'
  if (h.startsWith('#/perguntas')) return 'perguntas'
  if (h.startsWith('#/privacidade')) return 'privacidade'
  if (h.startsWith('#/termos')) return 'termos'
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
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Depois de a página nova entrar: antes disso, a rolagem ainda é medida na página que está saindo
  useLayoutEffect(rolarParaAncora, [endereco])

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

      <button className="pular" onClick={() => document.getElementById('conteudo')?.focus()}>
        Pular para o conteúdo
      </button>

      {rota !== 'painel' && <Header
        rota={rota}
        endereco={endereco}
        irPara={irPara}
        abrir={abrir}
        tema={tema}
        alternarTema={alternarTema}
      />}

      {rota !== 'home' && rota !== 'painel' && (
        <ModelBoundary><Suspense fallback={null}><Particulas /></Suspense></ModelBoundary>
      )}

      {rota === 'home' && <Home current={current} setCurrent={setCurrent} abrir={abrir} />}
      {rota === 'sobre' && <SobrePage abrir={abrir} />}
      {rota === 'conteudo' && <ConteudoPage abrir={abrir} />}
      {rota === 'atuacao' && <AtuacaoPage abrir={abrir} />}
      {rota === 'contato' && <ContatoPage abrir={abrir} />}
      {rota === 'diagnostico' && <Suspense fallback={null}><DiagnosticoPage abrir={abrir} /></Suspense>}
      {rota === 'perguntas' && <Suspense fallback={null}><PerguntasPage abrir={abrir} /></Suspense>}
      {rota === 'privacidade' && <Suspense fallback={null}><PrivacidadePage abrir={abrir} /></Suspense>}
      {rota === 'termos' && <Suspense fallback={null}><TermosPage abrir={abrir} /></Suspense>}
      {rota === 'painel' && <Suspense fallback={null}><Painel /></Suspense>}
    </>
  )
}
