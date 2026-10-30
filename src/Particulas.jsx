import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import Poeira, { LEVE } from './Poeira'

const CAMERA = { position: [0, 0.2, 6], fov: 30 }
const GL = { alpha: true, antialias: false, powerPreference: 'low-power' }
const LUZ = [0, 0.4, 0]

function Ritmo() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const t = setInterval(invalidate, 33)
    return () => clearInterval(t)
  }, [invalidate])
  return null
}

// Fundo das páginas internas: só as partículas da página inicial, sem a estátua
export default function Particulas() {
  return (
    <div className="app-canvas" aria-hidden="true">
      <Canvas dpr={1} camera={CAMERA} gl={GL} frameloop={LEVE ? 'demand' : 'always'}>
        {LEVE && <Ritmo />}
        <Poeira luz={LUZ} />
      </Canvas>
    </div>
  )
}
