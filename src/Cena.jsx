import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Suspense, memo } from 'react'
import Justica from './Justica'

// memo: o Environment refaz o cubemap a cada render
const Estudio = memo(function Estudio() {
  return (
    <>
      <Environment resolution={256} frames={1} environmentIntensity={0.5}>
        <color attach="background" args={['#120c0d']} />
        <Lightformer form="rect" intensity={2.4} color="#fff4e2" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#f3d9a4" position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[2.5, 7, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#e2bd84" position={[6, 1, -1]} rotation-y={-Math.PI / 2} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#ffffff" position={[0, 1, 7]} scale={[4, 3, 1]} />
      </Environment>
      <hemisphereLight intensity={0.22} color="#f5e6c8" groundColor="#3d2729" />
    </>
  )
})

const CAMERA = { position: [0, 0.2, 6.2], fov: 40 }
const GL = { alpha: true, antialias: true, powerPreference: 'high-performance' }

export default function Cena({ current }) {
  return (
    <Canvas frameloop="demand" shadows="percentage" dpr={[1, 1.25]} camera={CAMERA} gl={GL}>
      <Estudio />
      <Suspense fallback={null}>
        <Justica current={current} />
      </Suspense>
    </Canvas>
  )
}
