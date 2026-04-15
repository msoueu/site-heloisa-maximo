import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Martelo from './Martelo'
import Header from './Header'
import Dots from './Dots'
import SectionContent from './SectionContent'
import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [current, setCurrent] = useState(0)
  const total = 5

  useEffect(() => {
    let isScrolling = false

    const handleWheel = (e) => {
      if (isScrolling) return
      isScrolling = true

      if (e.deltaY > 0) {
        setCurrent(prev => Math.min(prev + 1, total - 1))
      } else {
        setCurrent(prev => Math.max(prev - 1, 0))
      }

      setTimeout(() => { isScrolling = false }, 800)
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <>
      {/* Fundo fixo */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100vh',
        backgroundImage: 'url(/Prancheta1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
      }} />

      {/* Canvas 3D fixo */}
      <div className="app-canvas">
        <Canvas camera={{ position: [0, 1, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>

          {/* Luz ambiente quente — base de preenchimento */}
          <ambientLight intensity={0.08} color="#3a2a1a" />

          {/* Luz principal frontal quente — ilumina o corpo com tom marfim */}
          <directionalLight position={[1, 1, 1]} intensity={4.5} color="#f5e6c8" />

          {/* Luz lateral dourada — cria volume e sombra dramática */}
          <spotLight
            position={[-3, 4, 2]}
            intensity={2.0}
            angle={0.25}
            penumbra={0.3}
            color="#c9a96e"
          />

          {/* Luz de cima — destaque no topo (cabeça/asas) */}
          <spotLight
            position={[0, 10, 3]}
            intensity={3.0}
            angle={0.25}
            penumbra={0.3}
            color="#615744"
          />

          {/* Luz quente de baixo — reflexo dourado vindo do chão */}
          <spotLight
            position={[1, -3, 2]}
            intensity={0.8}
            color="#8c6a3a"
          />

          {/* Luz traseira — contorno suave para separar do fundo escuro */}
          <spotLight
            position={[0, 3, -5]}
            intensity={1.0}
            color="#7a5c3a"
          />

          <Martelo current={current} /> 

          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.8}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Header fixo */}
      <Header />

      {/* Pontinhos laterais */}
      <Dots current={current} total={total} setCurrent={setCurrent} />

      {/* Conteúdo das seções */}
      <SectionContent current={current} />
    </>
  )
}
