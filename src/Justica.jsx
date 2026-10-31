import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import Poeira from './Poeira'
import { LEVE } from './ambiente'

// Modelo de RaresXS (CC BY 4.0). Os .bin são gerados por scripts/preparar-estatua.mjs

const MODELO = '/justica.bin'
const MARMORE = '/marmore.bin'
const LADO_MARMORE = 512
const ALTURA = 3.6
const TOPO_PEDESTAL = -1.72
const ALTURA_PEDESTAL = 1.1
const ALTURA_PRATO = 0.07
const d = THREE.MathUtils.degToRad

// foco é a altura olhada; tela desloca a peça (-1 a 1) para abrir espaço ao texto; luz em graus
const PLANOS = [
  { foco: 0.05, distancia: 8.4, fov: 30, altura: 3, tela: [0.27, 0], luz: [-52, 34], contraluz: 3.2 },
  { foco: 0.95, distancia: 4.9, fov: 28, altura: 7, tela: [0.44, 0], luz: [58, 26], contraluz: 3.6 },
  { foco: -0.1, distancia: 5.6, fov: 28, altura: -7, tela: [0.44, 0], luz: [-66, 18], contraluz: 3.8 },
  { foco: 1.15, distancia: 4.6, fov: 26, altura: 11, tela: [0.45, 0], luz: [72, 40], contraluz: 3.4 },
  { foco: 0.55, distancia: 6, fov: 30, altura: -2, tela: [0.38, 0], luz: [-30, 48], contraluz: 2.8 }
]
// A luz principal percorre a peça devagar, além do giro
const VARREDURA = { amplitude: d(11), periodo: 23 }

const GIRO_PARADO = d(5)
// Quem pede menos movimento mantém o giro lento, sem a aceleração nem o deslizar da câmera
const CALMO = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Cada seção percorrida soma esse tanto de giro: a base acelera enquanto a página rola
const GIRO_POR_SECAO = d(120)

// SmoothDamp (amortecimento crítico)
function amortecer(p, v, alvo, tempo, dt) {
  const omega = 2 / tempo
  const x = omega * dt
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  for (let i = 0; i < p.length; i++) {
    const dif = p[i] - alvo[i]
    const temp = (v[i] + omega * dif) * dt
    v[i] = (v[i] - omega * temp) * e
    p[i] = alvo[i] + (dif + temp) * e
  }
}

function interpolarPlano(s, saida) {
  const a = Math.min(Math.floor(s), PLANOS.length - 1)
  const b = Math.min(a + 1, PLANOS.length - 1)
  const t = THREE.MathUtils.smoothstep(s - a, 0.15, 0.85)
  const [pa, pb] = [PLANOS[a], PLANOS[b]]
  const mix = THREE.MathUtils.lerp
  saida[0] = mix(pa.foco, pb.foco, t)
  saida[1] = mix(pa.distancia, pb.distancia, t)
  saida[2] = mix(pa.fov, pb.fov, t)
  saida[3] = d(mix(pa.altura, pb.altura, t))
  saida[4] = mix(pa.tela[0], pb.tela[0], t)
  saida[5] = mix(pa.tela[1], pb.tela[1], t)
  saida[6] = d(mix(pa.luz[0], pb.luz[0], t))
  saida[7] = d(mix(pa.luz[1], pb.luz[1], t))
  saida[8] = mix(pa.contraluz, pb.contraluz, t)
}

const marmoreVertex = /* glsl */ `
  attribute float aOclusao;
  attribute float aEspessura;
  varying float vOclusao;
  varying float vEspessura;
  varying vec3 vRocha;
  varying vec3 vPesoRocha;
`
const marmoreVertexCorpo = /* glsl */ `
  vOclusao = aOclusao;
  vEspessura = aEspessura;
  vRocha = position;
  vPesoRocha = pow(abs(normal), vec3(4.0));
  vPesoRocha /= vPesoRocha.x + vPesoRocha.y + vPesoRocha.z;
`
const marmoreFragment = /* glsl */ `
  uniform sampler2D uMarmore;
  uniform vec3 uLuzVista;
  uniform vec3 uContraVista;
  uniform vec3 uVeio;
  varying float vOclusao;
  varying float vEspessura;
  varying vec3 vRocha;
  varying vec3 vPesoRocha;
  float pedra(vec3 p) {
    return texture2D(uMarmore, p.yz).r * vPesoRocha.x
      + texture2D(uMarmore, p.zx).r * vPesoRocha.y
      + texture2D(uMarmore, p.xy).r * vPesoRocha.z;
  }
`
const marmoreCor = /* glsl */ `
  float veio = pedra(vRocha * 0.8);
  float grao = pedra(vRocha * 9.0);
  diffuseColor.rgb *= mix(uVeio, vec3(1.0), veio) * (0.93 + 0.1 * grao);
`
const marmoreRugosidade = /* glsl */ `
  roughnessFactor = clamp(roughnessFactor + (0.55 - veio) * 0.3 + (0.6 - grao) * 0.12, 0.05, 1.0);
`
// Mármore deixa a luz entrar um pouco: a sombra nunca fecha no preto e as partes finas acendem no contraluz
const marmoreLuz = /* glsl */ `
  float oclusao = vOclusao;
  float dobras = pow(oclusao, 1.5);
  reflectedLight.indirectDiffuse *= dobras;
  reflectedLight.indirectSpecular *= oclusao;
  reflectedLight.directDiffuse *= mix(1.0, oclusao, 0.5);
  reflectedLight.directSpecular *= oclusao;
  float borda = dot(normal, uLuzVista) * 0.5 + 0.5;
  float entrada = borda * borda * (1.0 - borda) * 1.4;
  float atravessa = vEspessura * (0.3 + pow(saturate(dot(geometryViewDir, -uContraVista)), 2.0));
  reflectedLight.directDiffuse += diffuseColor.rgb * vec3(1.0, 0.86, 0.76) * (entrada + atravessa * 1.3) * dobras;
`

const ANEL = { centro: [0, 1.08, -1.4], raio: 1.12, lado: 3.8 }
const anelVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const anelFragment = /* glsl */ `
  uniform vec3 uCor;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 3.8;
    float faixa = exp(-pow((r - 0.93) / 0.022, 2.0));
    float brilho = exp(-abs(r - 0.93) * 7.0) * 0.55;
    gl_FragColor = vec4(uCor * (faixa * 1.4 + brilho), min(1.0, faixa + brilho * 0.8) * 0.5);
  }
`

// Sombra de contato sob a peça, que gira com ela; metal quase não mostra a sombra projetada
const contatoFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    gl_FragColor = vec4(0.03, 0.01, 0.01, smoothstep(1.0, 0.45, r) * 0.82);
  }
`

function lerModelo(buf) {
  const [nV, nA, nB, nC, nS] = new Uint32Array(buf, 0, 5)
  const caixa = new Float32Array(buf, 20, 6)
  let at = 44
  const pedir = (Tipo, n) => {
    const a = new Tipo(buf, at, n)
    at += a.byteLength
    return a
  }
  const posicao = pedir(Uint16Array, nV * 3)
  const normal = pedir(Int16Array, nV * 3)
  const oclusao = pedir(Uint8Array, nV)
  const espessura = pedir(Uint8Array, nV)
  at = Math.ceil(at / 4) * 4
  const faixas = [nA, nB, nC].map((n) => pedir(Uint16Array, n))
  const sombra = pedir(Uint16Array, nS)
  return { posicao, normal, oclusao, espessura, faixas, sombra, caixa }
}

export default function Justica({ current }) {
  const { invalidate, viewport, camera, size, gl } = useThree()
  const [modeloBuf, marmoreBuf] = useLoader(THREE.FileLoader, [MODELO, MARMORE], (l) => l.setResponseType('arraybuffer'))

  const { geometrias, geoSombra, escala, uniforms } = useMemo(() => {
    const m = lerModelo(modeloBuf)
    const [x0, y0, z0, x1, y1, z1] = m.caixa
    const escala = new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0)
    const posicao = new THREE.BufferAttribute(m.posicao, 3, true)
    const montar = (indice) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', posicao)
      g.setAttribute('normal', new THREE.BufferAttribute(m.normal, 3, true))
      g.setAttribute('aOclusao', new THREE.BufferAttribute(m.oclusao, 1, true))
      g.setAttribute('aEspessura', new THREE.BufferAttribute(m.espessura, 1, true))
      g.setIndex(new THREE.BufferAttribute(indice, 1))
      g.computeBoundingSphere()
      return g
    }
    const textura = new THREE.DataTexture(new Uint8Array(marmoreBuf), LADO_MARMORE, LADO_MARMORE, THREE.RedFormat)
    textura.wrapS = textura.wrapT = THREE.RepeatWrapping
    textura.minFilter = THREE.LinearMipmapLinearFilter
    textura.magFilter = THREE.LinearFilter
    textura.generateMipmaps = true
    textura.needsUpdate = true
    return {
      geometrias: m.faixas.map(montar),
      geoSombra: montar(m.sombra),
      escala: { tamanho: escala, origem: [x0, y0, z0] },
      uniforms: {
        uMarmore: { value: textura },
        uLuzVista: { value: new THREE.Vector3() },
        uContraVista: { value: new THREE.Vector3() },
        uVeio: { value: new THREE.Color('#6d6456') }
      }
    }
  }, [modeloBuf, marmoreBuf])

  const marmore = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#e7dfd1', roughness: 0.3, metalness: 0, envMapIntensity: 0.8 })
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${marmoreVertex}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${marmoreVertexCorpo}`)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${marmoreFragment}`)
        .replace('#include <color_fragment>', `#include <color_fragment>\n${marmoreCor}`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n${marmoreRugosidade}`)
        .replace('#include <aomap_fragment>', `#include <aomap_fragment>\n${marmoreLuz}`)
    }
    return m
  }, [uniforms])
  const anel = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: anelVertex,
    fragmentShader: anelFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uCor: { value: new THREE.Color('#fff3dc').convertLinearToSRGB() } }
  }), [])
  const contato = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: anelVertex,
    fragmentShader: contatoFragment,
    transparent: true,
    depthWrite: false
  }), [])
  const soSombra = useMemo(() => new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }), [])

  const prato = useRef()
  const chave = useRef()
  const contra = useRef()
  const plano = useRef(new Array(9).fill(0))
  const alvo = useRef(new Array(9).fill(0))
  const velocidade = useRef(new Array(9).fill(0))
  const suave = useRef({ p: [0], v: [0], a: [0] })
  const giro = useRef(0)
  const relogio = useRef(0)
  const primeiro = useRef(true)
  const quadro = useRef(0)
  const tmp = useMemo(() => ({ alvo: new THREE.Vector3(), dir: new THREE.Vector3() }), [])
  // Fora de foco o giro para, para não ocupar a placa de vídeo
  const emFoco = useRef(document.visibilityState === 'visible')

  useEffect(() => { invalidate() }, [size, current, invalidate])
  useEffect(() => {
    const atualizar = () => {
      emFoco.current = document.visibilityState === 'visible'
      if (emFoco.current) invalidate()
    }
    document.addEventListener('visibilitychange', atualizar)
    return () => document.removeEventListener('visibilitychange', atualizar)
  }, [invalidate])
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    return () => { gl.shadowMap.autoUpdate = true }
  }, [gl])

  useFrame((_, rawDelta) => {
    // Com frameloop="demand", o primeiro quadro depois de parado traz o intervalo inteiro
    const dt = rawDelta > 0.25 ? 1 / 60 : Math.min(rawDelta, 0.1)
    relogio.current += dt

    const s = suave.current
    s.a[0] = current
    if (primeiro.current) s.p[0] = s.a[0]
    const antes = s.p[0]
    amortecer(s.p, s.v, s.a, CALMO ? 0.001 : 0.5, dt)
    const percorrido = Math.abs(s.p[0] - antes)

    interpolarPlano(s.p[0], alvo.current)
    if (primeiro.current) plano.current = alvo.current.slice()
    primeiro.current = false
    amortecer(plano.current, velocidade.current, alvo.current, CALMO ? 0.001 : 0.12, dt)
    const [foco, dist, fov, alt, telaX, telaY, az, el, forcaContra] = plano.current

    giro.current += GIRO_PARADO * dt + (CALMO ? 0 : GIRO_POR_SECAO * percorrido)
    prato.current.rotation.y = giro.current

    // Em retrato o texto fica embaixo, então a peça sobe e a câmera recua
    const retrato = viewport.aspect < 0.8
    const D = dist * (retrato ? 2.1 : 1)
    const meiaAltura = Math.tan(d(fov) / 2) * D
    const sx = retrato ? 0 : telaX
    const sy = retrato ? 0.42 : telaY
    const a = tmp.alvo.set(-sx * meiaAltura * viewport.aspect, foco - sy * meiaAltura, 0)
    camera.position.set(a.x, a.y + Math.sin(alt) * D, a.z + Math.cos(alt) * D)
    camera.lookAt(a)
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    camera.updateMatrixWorld()

    const varrer = CALMO ? 0 : VARREDURA.amplitude * Math.sin((relogio.current / VARREDURA.periodo) * Math.PI * 2)
    const azV = az + varrer
    chave.current.position.set(Math.sin(azV) * Math.cos(el) * 8, Math.sin(el) * 8, Math.cos(azV) * Math.cos(el) * 8)
    contra.current.intensity = forcaContra
    uniforms.uLuzVista.value.copy(chave.current.position).normalize().transformDirection(camera.matrixWorldInverse)
    uniforms.uContraVista.value.copy(contra.current.position).normalize().transformDirection(camera.matrixWorldInverse)

    // A sombra em quadros alternados não aparece e custa metade
    quadro.current++
    gl.shadowMap.needsUpdate = quadro.current < 4 || quadro.current % (LEVE ? 4 : 2) === 0
    if (emFoco.current) {
      if (LEVE) setTimeout(invalidate, 30)
      else invalidate()
    }
  })

  const { tamanho, origem } = escala
  const fator = ALTURA / tamanho.y
  return (
    <>
      <directionalLight
        ref={chave}
        color="#fff1dd"
        intensity={3.4}
        castShadow
        shadow-mapSize={LEVE ? [512, 512] : [1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.05}
        shadow-radius={5}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3.2}
        shadow-camera-bottom={-3.2}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />
      <directionalLight ref={contra} position={[1.5, 3.5, -5]} color="#f2c9a0" />
      <directionalLight position={[3, 0.5, 4]} intensity={0.16} color="#cfd6e4" />

      <Poeira luz={ANEL.centro} />
      <mesh position={ANEL.centro} scale={ANEL.raio} material={anel} renderOrder={-1}>
        <planeGeometry args={[ANEL.lado, ANEL.lado]} />
      </mesh>
      <mesh position={[0, TOPO_PEDESTAL - ALTURA_PEDESTAL / 2, 0]} receiveShadow>
        <cylinderGeometry args={[1.02, 1.08, ALTURA_PEDESTAL, 64]} />
        <meshStandardMaterial color="#2a1a1c" roughness={0.62} />
      </mesh>
      <group ref={prato} position={[0, TOPO_PEDESTAL, 0]}>
        <mesh position={[0, ALTURA_PRATO / 2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.93, 0.93, ALTURA_PRATO, 64]} />
          <meshStandardMaterial color="#8a6c3f" roughness={0.5} metalness={0.45} />
        </mesh>
        <mesh position={[0, ALTURA_PRATO + 0.004, 0]} rotation-x={-Math.PI / 2} material={contato}>
          <planeGeometry args={[1.8, 1.8]} />
        </mesh>
        <group
          position={[fator * origem[0], ALTURA_PRATO + fator * origem[1], fator * origem[2]]}
          scale={[fator * tamanho.x, fator * tamanho.y, fator * tamanho.z]}
        >
          {geometrias.map((g, i) => (
            <mesh key={i} geometry={g} material={marmore} receiveShadow />
          ))}
          <mesh geometry={geoSombra} material={soSombra} castShadow frustumCulled={false} />
        </group>
      </group>
    </>
  )
}
