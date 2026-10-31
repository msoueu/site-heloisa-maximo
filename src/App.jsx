import { useState, useEffect, useLayoutEffect, useCallback, lazy, Suspense } from 'react'
import Header from './Header'
import Home, { ModelBoundary } from './Home'
import { SobrePage, ConteudoPage, AtuacaoPage, ContatoPage, ParceriasPage } from './Pages'
import { lerRota, navegar, migrarEnderecoAntigo, interceptarLink } from './rotas'
import { aplicarMetadados } from './metadados'
import useTheme from './useTheme'
import './App.css'

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

  useEffect(() => aplicarMetadados(rota), [rota, endereco])

  // Depois de a página nova entrar: antes disso, a rolagem ainda é medida na página que está saindo
  useLayoutEffect(rolarParaAncora, [endereco])

  const abrir = useCallback((pagina) => {
    if (window.location.pathname === `/${pagina}`) window.scrollTo({ top: 0, behavior: 'smooth' })
    else navegar(`/${pagina}`)
  }, [])

  const irPara = useCallback((secao) => {
    setCurrent(secao)
    if (lerRota() !== 'home') navegar('/')
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
      {rota === 'parcerias' && <ParceriasPage abrir={abrir} />}
      {rota === 'diagnostico' && <Suspense fallback={null}><DiagnosticoPage abrir={abrir} /></Suspense>}
      {rota === 'perguntas' && <Suspense fallback={null}><PerguntasPage abrir={abrir} /></Suspense>}
      {rota === 'privacidade' && <Suspense fallback={null}><PrivacidadePage abrir={abrir} /></Suspense>}
      {rota === 'termos' && <Suspense fallback={null}><TermosPage abrir={abrir} /></Suspense>}
      {rota === 'painel' && <Suspense fallback={null}><Painel /></Suspense>}
    </>
  )
}
