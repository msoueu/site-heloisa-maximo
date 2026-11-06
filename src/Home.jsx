import { useEffect, useState, Suspense, Component, lazy } from 'react'
import { DEV } from './data'
import { GitHub } from './Icons'
import Dots from './Dots'
import SectionContent from './SectionContent'
import { SobrePage, ConteudoPage, AtuacaoPage, ContatoPage, Rodape, Embutida } from './Pages'
import { useSite, Texto } from './SiteData'

const carregarCena = () => import('./Cena')
const Cena = lazy(carregarCena)
const PerguntasPage = lazy(() => import('./Perguntas'))

// Mesmo corte do Celular.css: aqui a página inicial rola em vez de trocar de seção
const CELULAR = '(max-width: 760px), (max-width: 1100px) and (orientation: portrait)'

function useCelular() {
  const [celular, setCelular] = useState(() => window.matchMedia(CELULAR).matches)
  useEffect(() => {
    const m = window.matchMedia(CELULAR)
    const mudar = () => setCelular(m.matches)
    m.addEventListener('change', mudar)
    return () => m.removeEventListener('change', mudar)
  }, [])
  return celular
}
// O texto vem primeiro: os arquivos do 3D baixam já, mas o Canvas só monta depois do primeiro desenho
const ATRASO_3D = 300

export class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export const TOTAL = 5

// Um passo por gesto: a inércia do touchpad não pode pular duas seções
const FIM_DO_GESTO = 160
const INTERVALO = 320
// O texto anda só um pouco com o dedo; o arraste completo troca a seção
const ARRASTE_MINIMO = 50
const FORCA_ARRASTE = 0.35

export default function Home({ current, setCurrent }) {
  const [cena, setCena] = useState(false)
  const celular = useCelular()

  useEffect(() => {
    carregarCena()
    const id = setTimeout(() => setCena(true), ATRASO_3D)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    document.body.classList.add('is-home')
    if (celular) {
      document.body.classList.add('home-celular')
      return () => document.body.classList.remove('is-home', 'home-celular')
    }
    let ultimoPasso = -Infinity
    let ultimoEvento = -Infinity
    let gestoUsado = false
    let toque = null

    const go = (dir) => {
      const agora = performance.now()
      if (agora - ultimoPasso < INTERVALO) return false
      ultimoPasso = agora
      setCurrent(prev => Math.min(Math.max(prev + dir, 0), TOTAL - 1))
      return true
    }

    const onWheel = (e) => {
      const agora = performance.now()
      if (agora - ultimoEvento > FIM_DO_GESTO) gestoUsado = false
      ultimoEvento = agora
      if (gestoUsado || Math.abs(e.deltaY) < 4) return
      gestoUsado = go(e.deltaY > 0 ? 1 : -1)
    }
    // Para cima ou para a esquerda avança; dois dedos ficam para o zoom do navegador
    const soltarTexto = () => {
      const texto = document.getElementById('conteudo')
      texto.style.transition = ''
      texto.style.translate = ''
    }
    const distancia = ({ clientX, clientY }) => {
      const dx = toque.x - clientX
      const dy = toque.y - clientY
      return Math.abs(dx) > Math.abs(dy) ? { dx, dy: 0 } : { dx: 0, dy }
    }
    // Dedo em qualquer tela; mouse só em janela estreita, para não atrapalhar a seleção de texto no computador
    const onPointerDown = (e) => {
      const menuAberto = document.querySelector('.header-nav-links.is-aberto')
      const mouseEmTelaGrande = e.pointerType === 'mouse' && window.innerWidth > 760
      toque = e.isPrimary && !menuAberto && !mouseEmTelaGrande ? { x: e.clientX, y: e.clientY } : null
      if (!toque) soltarTexto()
    }
    const onPointerMove = (e) => {
      if (!toque) return
      const { dx, dy } = distancia(e)
      const texto = document.getElementById('conteudo')
      texto.style.transition = 'none'
      texto.style.translate = `${-dx * FORCA_ARRASTE}px ${-dy * FORCA_ARRASTE}px`
    }
    const onPointerUp = (e) => {
      if (!toque) return
      const { dx, dy } = distancia(e)
      const arraste = dx + dy
      if (Math.abs(arraste) > ARRASTE_MINIMO) go(arraste > 0 ? 1 : -1)
      toque = null
      soltarTexto()
    }
    const onPointerCancel = () => {
      toque = null
      soltarTexto()
    }
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) go(1)
      if (['ArrowUp', 'PageUp'].includes(e.key)) go(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerCancel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-home')
    }
  }, [setCurrent, celular])

  const estatua = (
    <ModelBoundary>
      <Suspense fallback={null}>
        {/* Sempre o primeiro plano: a estátua fica parada no lugar, só girando, em todas as seções */}
        {cena && <Cena current={0} />}
      </Suspense>
    </ModelBoundary>
  )

  if (celular) return <HomeCelular estatua={estatua} />

  return (
    <>
      <div className="app-veu" data-secao={current} />

      <div className="app-canvas" aria-hidden="true">{estatua}</div>

      <div className="app-grain" />

      <Dots current={current} total={TOTAL} setCurrent={setCurrent} />

      <SectionContent current={current} />

      <a className="dev-credit" href={DEV.github} target="_blank" rel="noreferrer">
        <GitHub width={16} height={16} /> Site por {DEV.nome}
      </a>
    </>
  )
}

// Celular: estátua girando no topo e, rolando, o conteúdo de todas as páginas
function HomeCelular({ estatua }) {
  const { perfil, textos } = useSite()
  return (
    <main className="page" id="conteudo" tabIndex={-1}>
      <section className="home-hero">
        <div className="home-hero-cena" aria-hidden="true">{estatua}</div>
        <div className="home-hero-texto">
          <p className="home-hero-tag"><Texto de={textos} campo="inicio.tag" /></p>
          <h1><Texto de={perfil} campo="nome" /></h1>
          <p><Texto de={perfil} campo="especialidade" /> · <Texto de={textos} campo="inicio.alcance" /></p>
        </div>
      </section>
      <Embutida.Provider value>
        {/* O menu do topo rola até cada id destes */}
        <div id="secao-sobre"><SobrePage /></div>
        <div id="secao-conteudo"><ConteudoPage /></div>
        <div id="secao-atuacao"><AtuacaoPage /></div>
        <div id="secao-contato"><ContatoPage /></div>
        <div id="secao-perguntas"><Suspense fallback={null}><PerguntasPage /></Suspense></div>
      </Embutida.Provider>
      <Rodape />
    </main>
  )
}
