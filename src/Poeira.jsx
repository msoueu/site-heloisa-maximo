import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Celular e tablet: menos pixels, menos partículas e 30 quadros por segundo
export const LEVE = window.matchMedia('(pointer: coarse)').matches

// O movimento é todo calculado no shader a partir de uTempo
const QUANTIDADE = LEVE ? 110 : 260
const CAIXA = { x: [-2.6, 2.6], y: [-2, 2.4], z: [-1.8, 1] }

const vertex = /* glsl */ `
  attribute float aSemente;
  uniform float uTempo;
  uniform float uTamanho;
  uniform vec3 uLuz;
  varying float vBrilho;
  void main() {
    vec3 p = position;
    float altura = ${(CAIXA.y[1] - CAIXA.y[0]).toFixed(2)};
    p.y = mod(p.y - ${CAIXA.y[0].toFixed(2)} + uTempo * (0.04 + 0.05 * aSemente), altura) + ${CAIXA.y[0].toFixed(2)};
    p.x += sin(uTempo * (0.2 + 0.25 * aSemente) + aSemente * 40.0) * 0.18;
    p.z += cos(uTempo * (0.17 + 0.2 * aSemente) + aSemente * 23.0) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float perto = exp(-dot(p.xy - uLuz.xy, p.xy - uLuz.xy) * 0.35);
    float pisca = 0.65 + 0.35 * sin(uTempo * (1.2 + aSemente * 2.0) + aSemente * 90.0);
    float borda = smoothstep(0.0, 0.5, p.y - ${CAIXA.y[0].toFixed(2)}) * smoothstep(0.0, 0.5, ${CAIXA.y[1].toFixed(2)} - p.y);
    // grãos muito perto da câmera viram borrões
    float longe = smoothstep(0.6, 1.6, -mv.z);
    vBrilho = (0.25 + 0.75 * perto) * pisca * borda * longe;
    gl_PointSize = min(uTamanho * (0.6 + aSemente) / -mv.z, 14.0);
  }
`
const fragment = /* glsl */ `
  uniform vec3 uCor;
  uniform float uForca;
  varying float vBrilho;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(uCor, a * a * vBrilho * uForca);
  }
`

export default function Poeira({ luz }) {
  const { viewport } = useThree()
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(QUANTIDADE * 3)
    const semente = new Float32Array(QUANTIDADE)
    const sorteio = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < QUANTIDADE; i++) {
      pos.set([sorteio(...CAIXA.x), sorteio(...CAIXA.y), sorteio(...CAIXA.z)], i * 3)
      semente[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aSemente', new THREE.BufferAttribute(semente, 1))
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTempo: { value: 0 },
        uTamanho: { value: 1 },
        uLuz: { value: new THREE.Vector3(...luz) },
        uCor: { value: new THREE.Color('#f3d49a') },
        uForca: { value: 0.9 }
      }
    })
    return { geometry, material }
  }, [luz])

  useFrame((_, dt) => {
    const u = material.uniforms
    u.uTempo.value += Math.min(dt, 0.1)
    u.uTamanho.value = 26 * viewport.dpr
  })

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />
}
