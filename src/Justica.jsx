import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { ideia, aoMudar } from './ideias'
import Poeira from './Poeira'

// Modelo de RaresXS (CC BY 4.0). Os .bin são gerados por scripts/preparar-estatua.mjs

const MODEL = '/justica.glb'
const OCLUSAO = '/justica-oclusao.bin'
const BALANCA = '/justica-balanca.bin'
const ALTURA = 3.6
const d = THREE.MathUtils.degToRad

// Ângulos em graus. foco e halo estão no espaço do glTF; tela vai de -1 a 1; anel 0 é o disco
// dourado, 1 é o anel de luz fino; ceu é a luz difusa de cima
const PLANO = {
  giro: [0, -20, 0], foco: [0, -0.02, 0], distancia: 6.6, fov: 38, altura: -5, tela: [0.3, 0],
  luz: [-35, 40, 2.6], contraluz: 3.2, preenchimento: 0.45, ambiente: 0.5, halo: [0.02, 0.7, 1.3, 1], anel: 0,
  ceu: 0.22
}

// Movimento cinematográfico: a estátua gira sobre o eixo enquanto a câmera se aproxima. Luz de fundo escuro: quase sem ambiente nem preenchimento, contraluz
// forte e a luz principal rasante, trocando de lado para o brilho correr pelo mármore no giro. Os
// closes evitam ângulos em que a balança passa na frente do rosto
const ESCURO = { preenchimento: 0.05, ambiente: 0.12, ceu: 0.05 }
// O anel fica sempre atrás da cabeça e do colo, centrado no eixo da estátua, e gira com ela; nos
// closes ele só parece maior porque a câmera está mais perto
const ANEL = [0.04, 0.95, 1.12, 1]
const PLANOS_CINEMA = [
  { // início: figura inteira com o anel atrás da cabeça
    ...PLANO, ...ESCURO, luz: [-58, 32, 3.4], contraluz: 6, halo: ANEL, anel: 1
  },
  { // sobre: busto em três quartos, virada para a direita
    giro: [0, 32, 0], foco: [0.02, 0.6, 0.02], distancia: 3.7, fov: 28, altura: 2, tela: [0.32, -0.04],
    luz: [62, 24, 3.6], contraluz: 6.5, ...ESCURO, halo: ANEL, anel: 1
  },
  { // conteúdo: busto em três quartos, virada para a esquerda
    giro: [0, -22, 0], foco: [0, 0.62, 0.02], distancia: 3.5, fov: 28, altura: -3, tela: [0.32, -0.04],
    luz: [-64, 26, 3.6], contraluz: 6.5, ...ESCURO, halo: ANEL, anel: 1
  },
  { // atuação: de novo para a direita, mais virada e vista um pouco de cima
    giro: [0, 46, 0], foco: [0.02, 0.58, 0.02], distancia: 3.3, fov: 28, altura: 9, tela: [0.32, -0.02],
    luz: [70, 30, 3.6], contraluz: 6.5, ...ESCURO, halo: ANEL, anel: 1
  },
  { // contato: meio corpo de frente, com a luz um pouco mais aberta
    giro: [0, -8, 0], foco: [0.02, 0.42, 0.02], distancia: 4.5, fov: 32, altura: -4, tela: [0.3, -0.12],
    luz: [-28, 50, 3], contraluz: 5.5, preenchimento: 0.1, ambiente: 0.18, ceu: 0.08, halo: ANEL, anel: 1
  }
]

function vetor(p) {
  return [
    ...p.giro.map(d), ...p.foco, p.distancia, p.fov, d(p.altura), ...p.tela,
    d(p.luz[0]), d(p.luz[1]), p.luz[2], p.contraluz, p.preenchimento, p.ambiente, ...p.halo, p.anel, p.ceu
  ]
}
const ALVO = vetor(PLANO)
const ALVOS_CINEMA = PLANOS_CINEMA.map(vetor)
const ENTRADA = vetor({
  ...PLANO, luz: [-35, 40, 0], contraluz: 0, preenchimento: 0, ambiente: 0.12, ceu: 0, halo: [0.02, 0.7, 1.1, 0],
  anel: ideia.cinema ? 1 : 0
})

const SUAVIDADE = 0.34
// As passagens do cinematográfico são mais longas, para o giro e a aproximação se lerem
const SUAVIDADE_CINEMA = 0.5
const SUAVIDADE_ENTRADA = 0.6
const BALANCO = 0.05

const OLHAR = { giro: d(9), inclina: d(3.5), suavidade: 0.45 }
// Períodos diferentes entre si para o movimento não parecer um loop
const RESPIRA = { giro: d(2.6), periodoGiro: 17, inclina: d(0.6), periodoInclina: 11, sobe: 0.05, periodoSobe: 7 }

// Inclinação da haste por seção; negativo abaixa o prato da direita
const PESOS = [-13, -8, 5, -3, 0].map(d)
const MOLA = { rigidez: 26, amortecimento: 0.32 }
const QUADROS_CALMOS = 30
// A luz principal varre a estátua devagar, para o brilho deslizar sobre o mármore mesmo parada
const VARREDURA = { giro: d(14), periodoGiro: 14, sobe: d(6), periodoSobe: 19 }

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

const GLOW = 1.9 // tamanho do plano em raios do disco
const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const haloFragment = /* glsl */ `
  uniform vec3 uCore;
  uniform vec3 uEdge;
  uniform vec3 uGlow;
  uniform float uForca;
  uniform float uAnel;
  uniform vec3 uLinha;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0 * ${GLOW.toFixed(2)};
    float faixa = exp(-pow((r - 0.93) / 0.022, 2.0));
    float brilhoAnel = exp(-abs(r - 0.93) * 7.0) * 0.55;
    vec4 anel = vec4(uLinha * (faixa * 1.4 + brilhoAnel), min(1.0, faixa + brilhoAnel * 0.8));
    float disc = 1.0 - smoothstep(0.99, 1.0, r);
    vec3 col = mix(uCore, uEdge, pow(min(r, 1.0), 1.6));
    col += uCore * 0.25 * smoothstep(0.82, 1.0, r) * disc;
    float out_ = max(r - 1.0, 0.0);
    float glow = exp(-out_ * 4.2) * (1.0 - disc);
    vec3 color = col * disc + uGlow * glow;
    float alpha = disc * 0.96 + glow * 0.7;
    vec4 cor = mix(vec4(color, alpha), anel, uAnel);
    gl_FragColor = vec4(cor.rgb, cor.a * uForca);
  }
`
const srgb = (hex) => new THREE.Color(hex).convertLinearToSRGB()

const ruidoGlsl = /* glsl */ `
  float rochaHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1) * 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float rochaRuido(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(rochaHash(i), rochaHash(i + vec3(1, 0, 0)), f.x), mix(rochaHash(i + vec3(0, 1, 0)), rochaHash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(rochaHash(i + vec3(0, 0, 1)), rochaHash(i + vec3(1, 0, 1)), f.x), mix(rochaHash(i + vec3(0, 1, 1)), rochaHash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
`
const fbmGlsl = /* glsl */ `
  float rochaFbm(vec3 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      s += a * rochaRuido(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }
`
// Os veios são calculados por vértice (a malha é densa o bastante); por pixel fica só o grão fino
const marmoreVertexGlsl = /* glsl */ `
  attribute float aOclusao;
  varying float vOclusao;
  varying float vVeio;
  varying vec3 vRocha;
  ${ruidoGlsl}
  ${fbmGlsl}
`
const marmoreVeio = /* glsl */ `
  float torcao = rochaFbm(position * 2.6);
  float veio = 1.0 - smoothstep(0.0, 0.08, abs(sin((position.x * 0.7 + position.z * 1.1 + torcao * 2.4) * 5.0)));
  float fino = 1.0 - smoothstep(0.0, 0.05, abs(sin((position.y * 1.4 - position.x + torcao * 3.1) * 11.0)));
  vVeio = 1.0 - 0.18 * veio - 0.08 * fino * rochaRuido(position * 9.0);
`
const marmoreFragmentGlsl = /* glsl */ `
  varying float vOclusao;
  varying float vVeio;
  varying vec3 vRocha;
  ${ruidoGlsl}
`
const marmoreCor = /* glsl */ `
  diffuseColor.rgb *= vVeio * (0.965 + 0.07 * rochaRuido(vRocha * 38.0));
`
const marmoreOclusao = /* glsl */ `
  float oclusao = vOclusao;
  reflectedLight.indirectDiffuse *= oclusao;
  reflectedLight.indirectSpecular *= oclusao;
  reflectedLight.directDiffuse *= mix(1.0, oclusao, 0.6);
  reflectedLight.directSpecular *= mix(1.0, oclusao, 0.6);
`

// aPeca: 1 = haste, 2 e 3 = pratos. Os pratos só se deslocam junto com a ponta da haste, sem girar
const balancaGlsl = /* glsl */ `
  attribute float aPeca;
  uniform vec3 uPino;
  uniform vec3 uPratoE;
  uniform vec3 uPratoD;
  uniform vec3 uEixo;
  uniform float uHaste;
  vec3 girar(vec3 v, vec3 k, float a) {
    float c = cos(a);
    return v * c + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - c);
  }
`
const balancaVertex = /* glsl */ `
  if (aPeca > 0.5 && aPeca < 1.5) {
    transformed = uPino + girar(transformed - uPino, uEixo, uHaste);
  } else if (aPeca > 1.5) {
    vec3 ponta = aPeca < 2.5 ? uPratoE : uPratoD;
    transformed += uPino + girar(ponta - uPino, uEixo, uHaste) - ponta;
  }
`

function lerBalanca(buf) {
  const [total, nSoltos] = new Uint32Array(buf, 0, 2)
  const f = new Float32Array(buf, 8, 9)
  const ponto = (i) => new THREE.Vector3(f[i * 3], f[i * 3 + 1], f[i * 3 + 2])
  return {
    total,
    pontos: [0, 1, 2].map(ponto),
    soltos: new Uint32Array(buf, 44, nSoltos),
    pecas: new Uint8Array(buf, 44 + nSoltos * 4, total)
  }
}

export default function Justica({ current }) {
  const { invalidate, viewport, camera, scene: cena, size, gl } = useThree()
  const { scene } = useGLTF(MODEL)
  const [oclusaoBuf, balancaBuf] = useLoader(THREE.FileLoader, [OCLUSAO, BALANCA], (l) => l.setResponseType('arraybuffer'))

  const { model, escala, origem, uniforms } = useMemo(() => {
    const root = scene.clone(true)
    const uniforms = {
      uPino: { value: new THREE.Vector3() },
      uPratoE: { value: new THREE.Vector3() },
      uPratoD: { value: new THREE.Vector3() },
      uEixo: { value: new THREE.Vector3(0, 0, 1) },
      uHaste: { value: 0 }
    }
    const marble = new THREE.MeshStandardMaterial({
      color: '#d2c7b6',
      roughness: 0.34,
      metalness: 0,
      envMapIntensity: 1.1
    })
    marble.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${marmoreVertexGlsl}\n${balancaGlsl}`)
        .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
          if (aPeca > 0.5 && aPeca < 1.5) objectNormal = girar(objectNormal, uEixo, uHaste);`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vRocha = position;
          vOclusao = aOclusao;
          ${marmoreVeio}
          ${balancaVertex}`)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${marmoreFragmentGlsl}`)
        .replace('#include <color_fragment>', `#include <color_fragment>\n${marmoreCor}`)
        .replace('#include <aomap_fragment>', `#include <aomap_fragment>\n${marmoreOclusao}`)
    }
    // A sombra precisa do mesmo deslocamento da balança
    const sombra = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
    sombra.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${balancaGlsl}`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${balancaVertex}`)
    }

    root.updateMatrixWorld(true)
    const balanca = lerBalanca(balancaBuf)
    root.traverse((o) => {
      if (!o.isMesh) return
      if (!o.material.map) o.material = marble
      o.customDepthMaterial = sombra
      o.castShadow = true
      o.receiveShadow = true
      o.frustumCulled = false
      // .bin de outra versão do .glb: ignora oclusão e balança
      const total = o.geometry.attributes.position.count
      const confere = balanca.total === total && oclusaoBuf.byteLength === total
      const geo = o.geometry.clone()
      geo.setAttribute('aOclusao', new THREE.BufferAttribute(confere ? new Uint8Array(oclusaoBuf) : new Uint8Array(total).fill(255), 1, true))
      geo.setAttribute('aPeca', new THREE.BufferAttribute(confere ? balanca.pecas : new Uint8Array(total), 1))
      if (confere) {
        const ix = geo.index.array
        for (const t of balanca.soltos) ix[t * 3 + 1] = ix[t * 3 + 2] = ix[t * 3]
      }
      o.geometry = geo
      // Pontos medidos na cena do glTF; o shader usa o espaço da malha
      const inv = o.matrixWorld.clone().invert()
      const [pino, pratoE, pratoD] = balanca.pontos
      uniforms.uPino.value.copy(pino).applyMatrix4(inv)
      uniforms.uPratoE.value.copy(pratoE).applyMatrix4(inv)
      uniforms.uPratoD.value.copy(pratoD).applyMatrix4(inv)
      uniforms.uEixo.value.set(0, 0, 1).transformDirection(inv)
    })

    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = ALTURA / size.y
    root.scale.setScalar(s)
    root.position.set(-center.x * s, -box.min.y * s - ALTURA / 2, -center.z * s)
    const wrap = new THREE.Group()
    wrap.add(root)
    return { model: wrap, escala: s, origem: root.position.clone(), uniforms }
  }, [scene, oclusaoBuf, balancaBuf])

  const haloMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: haloVertex,
    fragmentShader: haloFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uCore: { value: srgb('#f6e2b4') },
      uEdge: { value: srgb('#b08c58') },
      uGlow: { value: srgb('#d8b777') },
      uForca: { value: 0 },
      uAnel: { value: 0 },
      uLinha: { value: srgb('#fff3dc') }
    }
  }), [])

  const statue = useRef()
  const halo = useRef()
  const chave = useRef()
  const preenche = useRef()
  const ceuRef = useRef()
  const contra1 = useRef()
  const contra2 = useRef()
  const x = useRef(ENTRADA.slice())
  const v = useRef(ENTRADA.map(() => 0))
  const entrada = useRef(true)
  const warmup = useRef(20)
  const tmp = useMemo(() => ({ foco: new THREE.Vector3(), halo: new THREE.Vector3(), alvo: new THREE.Vector3(), olhar: [0, 0] }), [])
  const cursor = useRef([0, 0])
  const olhar = useRef({ p: [0, 0], v: [0, 0] })
  const haste = useRef({ a: PESOS[0], v: 0 })
  const relogio = useRef(0)
  const luzHalo = useRef(new THREE.Vector3())
  const espera = useRef(null)
  const calmos = useRef(0)
  // Fora de foco as animações contínuas param, para não ocupar a GPU
  const emFoco = useRef(document.visibilityState === 'visible' && document.hasFocus())

  useEffect(() => { invalidate() }, [current, size, invalidate])
  useEffect(() => aoMudar(() => invalidate()), [invalidate])
  useEffect(() => () => clearTimeout(espera.current), [])
  useEffect(() => {
    const atualizar = () => {
      emFoco.current = document.visibilityState === 'visible' && document.hasFocus()
      if (emFoco.current) invalidate()
    }
    window.addEventListener('focus', atualizar)
    window.addEventListener('blur', atualizar)
    document.addEventListener('visibilitychange', atualizar)
    return () => {
      window.removeEventListener('focus', atualizar)
      window.removeEventListener('blur', atualizar)
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [invalidate])
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    return () => { gl.shadowMap.autoUpdate = true }
  }, [gl])
  useEffect(() => {
    const mover = (e) => {
      cursor.current[0] = (e.clientX / window.innerWidth) * 2 - 1
      cursor.current[1] = (e.clientY / window.innerHeight) * 2 - 1
      if (ideia.mouse) invalidate()
    }
    const sair = () => { cursor.current[0] = cursor.current[1] = 0; invalidate() }
    window.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    return () => {
      window.removeEventListener('pointermove', mover)
      document.documentElement.removeEventListener('pointerleave', sair)
    }
  }, [invalidate])

  useFrame((_, rawDelta) => {
    // Com frameloop="demand", o primeiro quadro depois de parado traz o intervalo inteiro
    const dt = rawDelta > 0.25 ? 1 / 60 : Math.min(rawDelta, 0.1)
    relogio.current += dt
    const t = relogio.current
    const secao = Math.min(current, PESOS.length - 1)
    const target = ideia.cinema ? ALVOS_CINEMA[secao] : ALVO
    if (current !== 0) entrada.current = false
    const p = x.current
    const vel = v.current

    amortecer(p, vel, target, entrada.current ? SUAVIDADE_ENTRADA : ideia.cinema ? SUAVIDADE_CINEMA : SUAVIDADE, dt)
    let moving = false
    for (let i = 0; i < p.length; i++) {
      if (Math.abs(target[i] - p[i]) > 0.0004 || Math.abs(vel[i]) > 0.0004) moving = true
    }
    if (!moving) {
      for (let i = 0; i < p.length; i++) p[i] = target[i]
      vel.fill(0)
      entrada.current = false
    }
    const [rx, ry, rz, fx, fy, fz, dist, fov, alt, telaX, telaY, az, el, forca, contra, preench, amb, hx, hy, hr, hf, anel, ceu] = p

    const g = statue.current
    const balanco = THREE.MathUtils.clamp(-vel[1] * BALANCO, -0.06, 0.06)
    g.rotation.set(rx, ry, rz + balanco)
    g.position.set(0, Math.abs(balanco) * 0.6, 0)
    g.updateMatrixWorld()

    // Foco calculado antes do olhar e da respiração, para a câmera não acompanhar esses movimentos
    const foco = tmp.foco.set(fx, fy, fz).multiplyScalar(escala).add(origem).applyMatrix4(g.matrixWorld)
    tmp.halo.set(hx, hy, 0).multiplyScalar(escala).add(origem).applyMatrix4(g.matrixWorld)

    const o = olhar.current
    const alvoOlhar = tmp.olhar
    alvoOlhar[0] = ideia.mouse ? cursor.current[0] * OLHAR.giro : 0
    alvoOlhar[1] = ideia.mouse ? cursor.current[1] * OLHAR.inclina : 0
    amortecer(o.p, o.v, alvoOlhar, OLHAR.suavidade, dt)
    const olhando = Math.abs(o.p[0] - alvoOlhar[0]) + Math.abs(o.p[1] - alvoOlhar[1]) + Math.abs(o.v[0]) + Math.abs(o.v[1]) > 0.0002

    const r = ideia.respiracao ? 1 : 0
    const onda = (periodo) => Math.sin((t / periodo) * Math.PI * 2)
    g.rotation.set(
      rx + o.p[1],
      ry + o.p[0] + r * RESPIRA.giro * onda(RESPIRA.periodoGiro),
      rz + balanco + r * RESPIRA.inclina * onda(RESPIRA.periodoInclina)
    )
    g.position.y += r * RESPIRA.sobe * onda(RESPIRA.periodoSobe)
    g.updateMatrixWorld()

    // Mola pouco amortecida, com um vaivém leve mesmo parada
    const h = haste.current
    const vaivem = ideia.balanca ? 1 : 0
    const base = vaivem * PESOS[secao]
    const peso = base + vaivem * d(0.7) * onda(5.3)
    const k = MOLA.rigidez
    const passos = Math.ceil(dt / (1 / 120))
    for (let i = 0; i < passos; i++) {
      const hdt = dt / passos
      h.v += (k * (peso - h.a) - 2 * MOLA.amortecimento * Math.sqrt(k) * h.v) * hdt
      h.a += h.v * hdt
    }
    // O vaivém cabe nos quadros calmos; só a oscilação após trocar de seção pede 60 fps
    const balancando = vaivem
      ? Math.abs(base - h.a) > 0.02 || Math.abs(h.v) > 0.03
      : Math.abs(peso - h.a) > 0.0002 || Math.abs(h.v) > 0.0002
    uniforms.uHaste.value = h.a

    // Em retrato o texto fica embaixo, então a estátua sobe e a câmera recua
    const retrato = viewport.aspect < 0.8
    const D = dist * (retrato ? 1.35 / Math.max(viewport.aspect / 0.56, 0.75) : 1)
    const meiaAltura = Math.tan(d(fov) / 2) * D
    const sx = retrato ? 0 : telaX
    const sy = retrato ? 0.3 : telaY
    const alvo = tmp.alvo.set(foco.x - sx * meiaAltura * viewport.aspect, foco.y - sy * meiaAltura, foco.z)
    camera.position.set(alvo.x, alvo.y + Math.sin(alt) * D, alvo.z + Math.cos(alt) * D)
    camera.lookAt(alvo)
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    const azV = az + VARREDURA.giro * onda(VARREDURA.periodoGiro)
    const elV = el + VARREDURA.sobe * onda(VARREDURA.periodoSobe)
    chave.current.position.set(Math.sin(azV) * Math.cos(elV) * 7, Math.sin(elV) * 7, Math.cos(azV) * Math.cos(elV) * 7)
    chave.current.intensity = forca
    preenche.current.intensity = preench
    contra1.current.intensity = contra
    contra2.current.intensity = contra * 0.44
    cena.environmentIntensity = amb
    ceuRef.current.intensity = ceu

    halo.current.position.set(tmp.halo.x, tmp.halo.y, tmp.halo.z - 1.4)
    halo.current.scale.setScalar(hr)
    haloMat.uniforms.uForca.value = hf
    haloMat.uniforms.uAnel.value = anel
    luzHalo.current.copy(halo.current.position)

    // Movimentos lentos rodam a QUADROS_CALMOS fps; a sombra é atualizada em quadros alternados
    const agitado = moving || olhando || balancando || warmup.current-- > 0
    gl.shadowMap.needsUpdate = agitado || calmos.current++ % 2 === 0
    if (agitado) invalidate()
    else if ((ideia.respiracao || ideia.poeira || ideia.balanca) && emFoco.current && !espera.current) {
      espera.current = setTimeout(() => { espera.current = null; invalidate() }, 1000 / QUADROS_CALMOS)
    }
  })

  return (
    <>
      <directionalLight
        ref={chave}
        color="#fbeedb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={3}
        shadow-camera-left={-3.4}
        shadow-camera-right={3.4}
        shadow-camera-top={3.4}
        shadow-camera-bottom={-3.6}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />
      <directionalLight ref={preenche} position={[4, 1, 3]} color="#d9dde6" />
      <hemisphereLight ref={ceuRef} color="#f5e6c8" groundColor="#3d2729" />
      <directionalLight ref={contra1} position={[0, 2.5, -4]} color="#f3d9a4" />
      <directionalLight ref={contra2} position={[-3, 1, -3]} color="#c9a96e" />

      <mesh ref={halo} material={haloMat} renderOrder={-1}>
        <planeGeometry args={[GLOW * 2, GLOW * 2]} />
      </mesh>
      <group ref={statue}>
        <primitive object={model} />
      </group>
      <Poeira luz={luzHalo} />
    </>
  )
}
