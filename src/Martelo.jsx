import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Martelo({ current }) {
  const { scene: sceneMartelo } = useGLTF('/Martelo.glb')
  const { scene: sceneMesa } = useGLTF('/Mesinha.glb')
  
  const marteloRef = useRef()
  const prevCurrent = useRef(current)
  const batendoRef = useRef(false)
  const progressRef = useRef(0) // 0 = cima, 1 = baixo

  // Ângulos do martelo
  const ANGULO_CIMA = -0.6      // repouso levantado
  const ANGULO_BAIXO = 0.4      // impacto na mesa

  useEffect(() => {
    if (current !== prevCurrent.current) {
      batendoRef.current = true
      progressRef.current = 0
      prevCurrent.current = current
    }
  }, [current])

  useFrame((_, delta) => {
    if (!marteloRef.current) return

    if (batendoRef.current) {
      progressRef.current += delta * 6 // velocidade da batida

      if (progressRef.current < 1) {
        // Descida rápida
        const t = THREE.MathUtils.smoothstep(progressRef.current, 0, 1)
        marteloRef.current.rotation.z = THREE.MathUtils.lerp(ANGULO_CIMA, ANGULO_BAIXO, t)
      } else if (progressRef.current < 2) {
        // Subida suave
        const t = THREE.MathUtils.smoothstep(progressRef.current - 1, 0, 1)
        marteloRef.current.rotation.z = THREE.MathUtils.lerp(ANGULO_BAIXO, ANGULO_CIMA, t)
      } else {
        // Animação terminou
        marteloRef.current.rotation.z = ANGULO_CIMA
        batendoRef.current = false
        progressRef.current = 0
      }
    }
  })

  return (
    <>
      {/* Mesa — estática */}
      <primitive
        object={sceneMesa}
        scale={1}
        position={[0, 0, 0]}
      />

      {/* Martelo — animado */}
      <primitive
        ref={marteloRef}
        object={sceneMartelo}
        scale={1}
        position={[0, 1, 0]} // ajuste conforme o modelo
        rotation={[0, 0, ANGULO_CIMA]}
      />
    </>
  )
}