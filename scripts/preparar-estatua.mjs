// Gera public/justica.bin e public/marmore.bin a partir de scripts/justica-original.glb
// Uso: node scripts/preparar-estatua.mjs
import fs from 'fs'
import { fileURLToPath } from 'url'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MeshoptSimplifier } from 'meshoptimizer/simplifier'
import { MeshBVH } from 'three-mesh-bvh'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const ALVO_TRIANGULOS = 65000
const ALVO_SOMBRA = 14000
const ERRO_MAXIMO = 0.02
// Em fração da altura da peça: as faixas viram malhas separadas, para o close não desenhar a base
const FAIXAS = [0.33, 0.62]

await MeshoptDecoder.ready
await MeshoptSimplifier.ready

const buf = fs.readFileSync(raiz + 'scripts/justica-original.glb')
const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length), '')
let mesh
gltf.scene.traverse((o) => { if (o.isMesh) mesh = o })
gltf.scene.updateMatrixWorld(true)

// Une vértices repetidos e normaliza a peça para altura 1, com o eixo de giro em x = z = 0
const geo = mesh.geometry
const n = geo.attributes.position.count
const box = new THREE.Box3().setFromObject(mesh)
const tamanho = box.getSize(new THREE.Vector3())
const centro = box.getCenter(new THREE.Vector3())
const v = new THREE.Vector3()
const matrizNormal = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
const unico = new Int32Array(n)
const visto = new Map()
const posicoes = []
const normais = []
for (let i = 0; i < n; i++) {
  v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(mesh.matrixWorld)
  const [x, y, z] = [(v.x - centro.x) / tamanho.y, (v.y - box.min.y) / tamanho.y, (v.z - centro.z) / tamanho.y]
  const k = `${Math.round(x * 2e4)},${Math.round(y * 2e4)},${Math.round(z * 2e4)}`
  let id = visto.get(k)
  if (id === undefined) {
    id = posicoes.length / 3
    visto.set(k, id)
    posicoes.push(x, y, z)
    normais.push(0, 0, 0)
  }
  unico[i] = id
  v.fromBufferAttribute(geo.attributes.normal, i).applyMatrix3(matrizNormal).normalize()
  normais[id * 3] += v.x
  normais[id * 3 + 1] += v.y
  normais[id * 3 + 2] += v.z
}
const pos = new Float32Array(posicoes)
const nor = new Float32Array(normais)
const total = pos.length / 3
for (let i = 0; i < total; i++) {
  v.fromArray(nor, i * 3).normalize().toArray(nor, i * 3)
}
const original = new Uint32Array(geo.index.count)
let tamanhoOriginal = 0
for (let t = 0; t < geo.index.count; t += 3) {
  const [a, b, c] = [unico[geo.index.array[t]], unico[geo.index.array[t + 1]], unico[geo.index.array[t + 2]]]
  if (a === b || b === c || a === c) continue
  original.set([a, b, c], tamanhoOriginal)
  tamanhoOriginal += 3
}
const indices = original.subarray(0, tamanhoOriginal)
console.log(`original: ${tamanhoOriginal / 3} triângulos, ${total} vértices`)

const geoRaio = new THREE.BufferGeometry()
geoRaio.setAttribute('position', new THREE.BufferAttribute(pos, 3))
geoRaio.setIndex(new THREE.BufferAttribute(indices.slice(), 1))
const bvh = new MeshBVH(geoRaio)
const raio = new THREE.Ray()
const lancar = (origem, direcao, longe) => {
  raio.origin.copy(origem)
  raio.direction.copy(direcao)
  return bvh.raycastFirst(raio, THREE.DoubleSide, 0, longe)
}

// Corte do que nunca aparece: um triângulo só fica se for visto de ao menos um ponto do anel por
// onde a câmera anda. Como a peça gira 360°, o anel cobre todas as voltas
const CAMERAS = []
for (const raioAnel of [0.9, 1.9]) {
  for (const altura of [0.1, 0.5, 0.9, 1.25]) {
    for (let a = 0; a < 48; a++) {
      const ang = (a / 48) * Math.PI * 2
      CAMERAS.push(new THREE.Vector3(Math.sin(ang) * raioAnel, altura, Math.cos(ang) * raioAnel))
    }
  }
}
const [pa, pb, pc, nf, ponto, dir] = Array.from({ length: 6 }, () => new THREE.Vector3())
const visivel = (p, normal) => {
  for (const cam of CAMERAS) {
    dir.subVectors(cam, p)
    const longe = dir.length()
    dir.divideScalar(longe)
    if (dir.dot(normal) <= 0) continue
    if (!lancar(p, dir, longe)) return true
  }
  return false
}
const manterVertice = new Uint8Array(total)
for (let t = 0; t < indices.length; t += 3) {
  const [a, b, c] = indices.subarray(t, t + 3)
  pa.fromArray(pos, a * 3)
  pb.fromArray(pos, b * 3)
  pc.fromArray(pos, c * 3)
  nf.subVectors(pb, pa).cross(ponto.subVectors(pc, pa)).normalize()
  const pontos = [[1 / 3, 1 / 3, 1 / 3], [0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.1, 0.1, 0.8]]
  const ve = pontos.some(([u, w, s]) => {
    const p = new THREE.Vector3().addScaledVector(pa, u).addScaledVector(pb, w).addScaledVector(pc, s).addScaledVector(nf, 2e-4)
    return visivel(p, nf)
  })
  if (ve) manterVertice[a] = manterVertice[b] = manterVertice[c] = 1
}
// Margem de um anel de vizinhos, para o corte não abrir frestas
const visiveis = []
for (let t = 0; t < indices.length; t += 3) {
  const [a, b, c] = indices.subarray(t, t + 3)
  if (manterVertice[a] || manterVertice[b] || manterVertice[c]) visiveis.push(a, b, c)
}
const indicesVisiveis = new Uint32Array(visiveis)
console.log(`invisíveis cortados: ${(indices.length - indicesVisiveis.length) / 3} triângulos`)

// Simplificação: o peso na normal protege o detalhe do tronco para cima, onde a câmera chega perto
const suave = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const pesos = new Float32Array(total * 3)
for (let i = 0; i < total; i++) {
  const peso = 0.15 + 1.4 * suave(0.5, 0.72, pos[i * 3 + 1])
  for (let k = 0; k < 3; k++) pesos[i * 3 + k] = nor[i * 3 + k] * peso
}
const [simplificado, erro] = MeshoptSimplifier.simplifyWithAttributes(
  indicesVisiveis, pos, 3, pesos, 3, [1, 1, 1], null, ALVO_TRIANGULOS * 3, ERRO_MAXIMO, ['LockBorder', 'Prune']
)
const [sombra] = MeshoptSimplifier.simplify(indicesVisiveis, pos, 3, ALVO_SOMBRA * 3, 0.06, ['Prune'])
console.log(`simplificado: ${simplificado.length / 3} triângulos (erro ${erro.toFixed(4)}), sombra: ${sombra.length / 3}`)

// Só os vértices usados, com as faixas de altura em sequência
const faixas = FAIXAS.map(() => []).concat([[]])
for (let t = 0; t < simplificado.length; t += 3) {
  const [a, b, c] = simplificado.subarray(t, t + 3)
  const y = (pos[a * 3 + 1] + pos[b * 3 + 1] + pos[c * 3 + 1]) / 3
  const f = FAIXAS.findIndex((limite) => y < limite)
  faixas[f < 0 ? FAIXAS.length : f].push(a, b, c)
}
const novo = new Map()
const mapear = (i) => {
  if (!novo.has(i)) novo.set(i, novo.size)
  return novo.get(i)
}
const indicesFaixas = faixas.map((f) => f.map(mapear))
const indicesSombra = Array.from(sombra, mapear)
const nFinal = novo.size

// Oclusão e espessura medidas com raios contra a malha completa, então o detalhe cortado continua na luz
const DIRECOES = Array.from({ length: 64 }, (_, i) => {
  const y = (i + 0.5) / 64
  const r = Math.sqrt(1 - y)
  const ang = i * 2.399963
  return new THREE.Vector3(Math.cos(ang) * r, Math.sqrt(y), Math.sin(ang) * r)
})
const ALCANCE = 0.22
const LARGURA_LUZ = 0.05
const oclusao = new Uint8Array(nFinal)
const espessura = new Uint8Array(nFinal)
const [p, nv, tu, tv, d] = Array.from({ length: 5 }, () => new THREE.Vector3())
for (const [antigo, id] of novo) {
  nv.fromArray(nor, antigo * 3)
  p.fromArray(pos, antigo * 3).addScaledVector(nv, 3e-4)
  tu.set(Math.abs(nv.y) > 0.9 ? 1 : 0, Math.abs(nv.y) > 0.9 ? 0 : 1, 0).cross(nv).normalize()
  tv.crossVectors(nv, tu)
  let livre = 0
  for (const a of DIRECOES) {
    d.set(0, 0, 0).addScaledVector(tu, a.x).addScaledVector(nv, a.y).addScaledVector(tv, a.z)
    const hit = lancar(p, d, ALCANCE)
    const distancia = hit ? hit.distance : ALCANCE
    // O chão da base conta como bloqueio
    const chao = d.y < 0 ? p.y / -d.y : Infinity
    livre += Math.min(distancia, chao, ALCANCE) / ALCANCE
  }
  oclusao[id] = Math.round((livre / DIRECOES.length) * 255)

  p.fromArray(pos, antigo * 3).addScaledVector(nv, -3e-4)
  let fino = 0
  for (let i = 0; i < 6; i++) {
    const a = DIRECOES[i * 10]
    d.set(0, 0, 0).addScaledVector(tu, a.x).addScaledVector(nv, -a.y).addScaledVector(tv, a.z)
    const hit = lancar(p, d, 0.3)
    fino += Math.exp(-(hit ? hit.distance : 0.3) / LARGURA_LUZ)
  }
  espessura[id] = Math.round((fino / 6) * 255)
}

// Formato: u32 [nVértices, nFaixa1, nFaixa2, nFaixa3, nSombra], u16 x3 posição (0 a 1 na caixa),
// i16 x3 normal, u8 oclusão, u8 espessura, u16 índices
if (nFinal > 65535) throw new Error('vértices demais para índices de 16 bits')
const caixa = new THREE.Box3()
for (const antigo of novo.keys()) caixa.expandByPoint(v.fromArray(pos, antigo * 3))
const quantPos = new Uint16Array(nFinal * 3)
const quantNor = new Int16Array(nFinal * 3)
const faixaCaixa = caixa.getSize(new THREE.Vector3())
for (const [antigo, id] of novo) {
  for (let k = 0; k < 3; k++) {
    quantPos[id * 3 + k] = Math.round(((pos[antigo * 3 + k] - caixa.min.getComponent(k)) / faixaCaixa.getComponent(k)) * 65535)
    quantNor[id * 3 + k] = Math.round(nor[antigo * 3 + k] * 32767)
  }
}
const preenche = (bytes) => Buffer.alloc((4 - (bytes % 4)) % 4)
const corpo = Buffer.concat([
  Buffer.from(quantPos.buffer), Buffer.from(quantNor.buffer), Buffer.from(oclusao.buffer), Buffer.from(espessura.buffer)
])
const saida = Buffer.concat([
  Buffer.from(new Uint32Array([nFinal, ...indicesFaixas.map((f) => f.length), indicesSombra.length]).buffer),
  Buffer.from(new Float32Array([...caixa.min.toArray(), ...caixa.max.toArray()]).buffer),
  corpo,
  preenche(corpo.length),
  Buffer.from(new Uint16Array(indicesFaixas.flat()).buffer),
  Buffer.from(new Uint16Array(indicesSombra).buffer)
])
fs.writeFileSync(raiz + 'public/justica.bin', saida)
console.log(`justica.bin: ${nFinal} vértices, ${(saida.length / 1024).toFixed(0)} KB`)

// Mármore: textura repetível de 512 x 512. Claro é a pedra, escuro é o veio
const LADO = 512
const grade = (periodo, semente) => {
  const g = new Float32Array(periodo * periodo)
  let s = semente
  for (let i = 0; i < g.length; i++) {
    s = (s * 16807) % 2147483647
    g[i] = s / 2147483647
  }
  return g
}
const ruido = (g, periodo, x, y) => {
  const [xi, yi] = [Math.floor(x), Math.floor(y)]
  const [fx, fy] = [x - xi, y - yi]
  const [u, w] = [fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)]
  const em = (a, b) => g[((b % periodo) + periodo) % periodo * periodo + ((a % periodo) + periodo) % periodo]
  return (em(xi, yi) * (1 - u) + em(xi + 1, yi) * u) * (1 - w) + (em(xi, yi + 1) * (1 - u) + em(xi + 1, yi + 1) * u) * w
}
const OITAVAS = [4, 8, 16, 32, 64].map((periodo, i) => ({ periodo, peso: 0.5 ** (i + 1), g: grade(periodo, 4813 + i * 97) }))
const fbm = (x, y) => OITAVAS.reduce((s, o) => s + o.peso * ruido(o.g, o.periodo, x * o.periodo, y * o.periodo), 0)
const textura = new Uint8Array(LADO * LADO)
for (let j = 0; j < LADO; j++) {
  for (let i = 0; i < LADO; i++) {
    const [x, y] = [i / LADO, j / LADO]
    const torcao = fbm(x, y)
    const veio = Math.abs(Math.sin(Math.PI * (2 * x + 3 * y + 3.2 * torcao)))
    const fino = Math.abs(Math.sin(Math.PI * (7 * x - 4 * y + 5.5 * fbm(y, x))))
    const nuvem = 0.5 + (torcao - 0.5) * 0.5
    const pedra = 0.84 + 0.16 * nuvem - 0.42 * (1 - suave(0, 0.05, veio)) * suave(0.42, 0.6, torcao) - 0.16 * (1 - suave(0, 0.03, fino))
    textura[j * LADO + i] = Math.round(Math.min(1, Math.max(0, pedra)) * 255)
  }
}
fs.writeFileSync(raiz + 'public/marmore.bin', textura)
console.log('marmore.bin: 512 x 512')
