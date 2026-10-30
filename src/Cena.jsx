import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Suspense, memo } from 'react'
import Justica from './Justica'
import { LEVE } from './Poeira'

// memo: o Environment refaz o cubemap a cada render
const Estudio = memo(function Estudio() {
  return (
    <Environment resolution={128} frames={1} environmentIntensity={0.38}>
      <color attach="background" args={['#150b0d']} />
      <Lightformer form="rect" intensity={2.2} color="#fff0dc" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[7, 4, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#f0d3ab" position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[2.5, 7, 1]} />
      <Lightformer form="rect" intensity={0.5} color="#b8505a" position={[6, 1, -1]} rotation-y={-Math.PI / 2} scale={[3, 6, 1]} />
    </Environment>
  )
})

const CAMERA = { position: [0, 0.2, 8], fov: 30 }
const GL = { alpha: true, antialias: true, powerPreference: LEVE ? 'default' : 'high-performance' }

export default function Cena({ current }) {
  return (
    <Canvas frameloop="demand" shadows="percentage" dpr={LEVE ? [1, 1.25] : [1, 1.5]} camera={CAMERA} gl={GL}>
      <Estudio />
      <Suspense fallback={null}>
        <Justica current={current} />
      </Suspense>
    </Canvas>
  )
}
