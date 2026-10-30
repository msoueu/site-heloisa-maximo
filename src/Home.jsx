import { useEffect, Suspense, Component, lazy } from 'react'
import { DEV } from './data'
import { GitHub } from './Icons'
import Dots from './Dots'
import SectionContent from './SectionContent'

const Cena = lazy(() => import('./Cena'))

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

export default function Home({ current, setCurrent, abrir }) {
  useEffect(() => {
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
    document.body.classList.add('is-home')
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-home')
    }
  }, [setCurrent])

  return (
    <>
      <div className="app-veu" data-secao={current} />

      <div className="app-canvas" aria-hidden="true">
        <ModelBoundary>
          <Suspense fallback={null}>
            <Cena current={current} />
          </Suspense>
        </ModelBoundary>
      </div>

      <div className="app-grain" />

      <Dots current={current} total={TOTAL} setCurrent={setCurrent} />

      <SectionContent current={current} abrir={abrir} />

      <a className="dev-credit" href={DEV.github} target="_blank" rel="noreferrer">
        <GitHub width={16} height={16} /> Site por {DEV.nome}
      </a>
    </>
  )
}
