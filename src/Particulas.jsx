import { Canvas } from '@react-three/fiber'
import Poeira from './Poeira'

const CAMERA = { position: [0, 0.2, 6], fov: 30 }
const GL = { alpha: true, antialias: false, powerPreference: 'low-power' }
const LUZ = [0, 0.4, 0]

// Fundo das páginas internas: só as partículas da página inicial, sem a estátua
export default function Particulas() {
  return (
    <div className="app-canvas" aria-hidden="true">
      <Canvas dpr={1} camera={CAMERA} gl={GL}>
        <Poeira luz={LUZ} />
      </Canvas>
    </div>
  )
}
