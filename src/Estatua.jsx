import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Estatua({ current, total }) {
  const { scene } = useGLTF('/estatua.glb')
  const { camera } = useThree()
  const ref = useRef()

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {

        obj.material.color = new THREE.Color('#f3f2e4')
        obj.material.emissive = new THREE.Color('#e6d6c2')
        obj.material.emissiveIntensity = 0
        obj.material.roughness = 0.95
        obj.material.metalness = 0.0
        obj.material.needsUpdate = true 
      }
    })
  }, [scene])

  useFrame(()=> {
    if (!ref.current) return

    // Estátua fica centralizada e levemente rotacionada
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x, 0, 0.04
    )

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y, 19.5, 0.3
    )

    // Câmera muda de foco a cada seção explorando partes da estátua
    let targetCamY, targetCamZ, targetCamX, lookAtY

    if (current === 0) {
      // Visão geral — estátua inteira centralizada
      targetCamX = 2; targetCamY = 2; targetCamZ = 20; lookAtY = 2
    } else if (current === 1) {
      // Rosto / cabeça
      targetCamX = 15; targetCamY = 5; targetCamZ = 6; lookAtY = 5
    } else if (current === 2) {
      // Asas e torso
      targetCamX = 10; targetCamY = 5; targetCamZ = -6; lookAtY = 4
    } else if (current === 3) {
      // Mãos / flores
      targetCamX = 5; targetCamY = 10; targetCamZ = 10; lookAtY = 2
    } else {
      // Base / pés
      targetCamX = 2; targetCamY = 2; targetCamZ = 20; lookAtY = 2
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.04)
    camera.lookAt(new THREE.Vector3(0, lookAtY, 0))
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1}
      position={[4, 0, 0]}
    />
  )
}