import { useEffect, useRef } from 'react'
import { LEVE } from './ambiente'

const COR = '243, 212, 154'
const QUANTIDADE = LEVE ? 45 : 110
const INTERVALO = 1000 / 30

function nova(largura, altura) {
  return {
    x: Math.random() * largura,
    y: Math.random() * altura,
    raio: 0.6 + Math.random() * 1.1,
    subida: 3 + Math.random() * 7,
    balanco: Math.random() * 40,
    pulso: 0.8 + Math.random() * 1.6
  }
}

// Fundo das páginas internas: a mesma poeira dourada da página inicial, sem baixar o 3D
export default function Particulas() {
  const tela = useRef()

  useEffect(() => {
    const canvas = tela.current
    const ctx = canvas.getContext('2d')
    let graos = []
    let quadro
    let anterior = 0

    const medir = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      graos = Array.from({ length: QUANTIDADE }, () => nova(canvas.width, canvas.height))
    }

    const desenhar = (agora) => {
      quadro = requestAnimationFrame(desenhar)
      if (agora - anterior < INTERVALO) return
      const dt = Math.min(agora - anterior, 100) / 1000
      anterior = agora
      const t = agora / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      for (const g of graos) {
        g.y -= g.subida * dt
        if (g.y < -4) g.y = canvas.height + 4
        const x = g.x + Math.sin(t * 0.2 + g.balanco) * 12
        const brilho = 0.32 + 0.3 * Math.sin(t * g.pulso + g.balanco)
        ctx.beginPath()
        ctx.arc(x, g.y, g.raio, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COR}, ${brilho})`
        ctx.fill()
      }
    }

    medir()
    quadro = requestAnimationFrame(desenhar)
    window.addEventListener('resize', medir)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('resize', medir)
    }
  }, [])

  return <canvas ref={tela} className="app-canvas" aria-hidden="true" />
}
