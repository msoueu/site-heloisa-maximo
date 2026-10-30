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

export default function Home({ current, setCurrent, abrir }) {
  useEffect(() => {
    let ultimoPasso = -Infinity
    let ultimoEvento = -Infinity
    let gestoUsado = false
    let touchY = null

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
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      if (touchY === null) return
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) > 50) go(dy > 0 ? 1 : -1)
      touchY = null
    }
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) go(1)
      if (['ArrowUp', 'PageUp'].includes(e.key)) go(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-home')
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-home')
    }
  }, [setCurrent])

  return (
    <>
      <div className="app-veu" />

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
