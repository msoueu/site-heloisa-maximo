import { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react'
import Header from './Header'
import Home, { ModelBoundary } from './Home'
import { SobrePage, ConteudoPage, AtuacaoPage, ContatoPage, NaoEncontradaPage } from './Pages'
import { lerRota, migrarEnderecoAntigo, interceptarLink } from './rotas'
import { aplicarMetadados } from './metadados'
import { useSite } from './SiteData'
import useTheme from './useTheme'
import './App.css'
import './Celular.css'

const Painel = lazy(() => import('./Painel'))
const DiagnosticoPage = lazy(() => import('./Diagnostico'))
const PerguntasPage = lazy(() => import('./Perguntas'))
const PrivacidadePage = lazy(() => import('./Legal').then((m) => ({ default: m.PrivacidadePage })))
const TermosPage = lazy(() => import('./Legal').then((m) => ({ default: m.TermosPage })))
const Particulas = lazy(() => import('./Particulas'))

migrarEnderecoAntigo()

// /sobre/atuacao desce até o id "atuacao" depois que a página renderiza
function rolarParaAncora() {
  const ancora = window.location.pathname.split('/')[2]
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
  const [endereco, setEndereco] = useState(window.location.pathname)
  const [current, setCurrent] = useState(0)
  const [tema, alternarTema] = useTheme()
  const { conteudos } = useSite()

  useEffect(() => {
    const onEndereco = () => {
      setRota(lerRota())
      setEndereco(window.location.pathname)
    }
    window.addEventListener('popstate', onEndereco)
    document.addEventListener('click', interceptarLink)
    return () => {
      window.removeEventListener('popstate', onEndereco)
      document.removeEventListener('click', interceptarLink)
    }
  }, [])

  useEffect(() => aplicarMetadados(rota, conteudos), [rota, endereco, conteudos])

  // Depois de a página nova entrar: antes disso, a rolagem ainda é medida na página que está saindo
  useLayoutEffect(rolarParaAncora, [endereco])

  return (
    <>
      <div className="app-bg" />
      <div className="app-vignette" />

      <button className="pular" onClick={() => document.getElementById('conteudo')?.focus()}>
        Pular para o conteúdo
      </button>

      {rota !== 'painel' && <Header
        rota={rota}
        endereco={endereco}
        irPara={setCurrent}
        tema={tema}
        alternarTema={alternarTema}
      />}

      {rota !== 'home' && rota !== 'painel' && (
        <ModelBoundary><Suspense fallback={null}><Particulas /></Suspense></ModelBoundary>
      )}

      {rota === 'home' && <Home current={current} setCurrent={setCurrent} />}
      {rota === 'sobre' && <SobrePage />}
      {rota === 'conteudo' && <ConteudoPage />}
      {rota === 'atuacao' && <AtuacaoPage />}
      {rota === 'contato' && <ContatoPage />}
      {rota === 'diagnostico' && <Suspense fallback={null}><DiagnosticoPage /></Suspense>}
      {rota === 'perguntas' && <Suspense fallback={null}><PerguntasPage /></Suspense>}
      {rota === 'privacidade' && <Suspense fallback={null}><PrivacidadePage /></Suspense>}
      {rota === 'termos' && <Suspense fallback={null}><TermosPage /></Suspense>}
      {rota === 'painel' && <Suspense fallback={null}><Painel /></Suspense>}
      {rota === 'naoEncontrada' && <NaoEncontradaPage />}
    </>
  )
}
