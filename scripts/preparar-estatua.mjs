// Gera public/justica-oclusao.bin (oclusão por vértice) e public/justica-balanca.bin (peças da
// balança) a partir do justica.glb. Uso: node scripts/preparar-estatua.mjs
import fs from 'fs'
import { fileURLToPath } from 'url'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const V = (x, y, z) => new THREE.Vector3(x, y, z)

const buf = fs.readFileSync(raiz + 'public/justica.glb')
await MeshoptDecoder.ready
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const gltf = await loader.parseAsync(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length), '')
let mesh
gltf.scene.traverse((o) => { if (o.isMesh) mesh = o })
gltf.scene.updateMatrixWorld(true)

const geo = mesh.geometry
const n = geo.attributes.position.count
const pos = new Float32Array(n * 3)
const v = new THREE.Vector3()
for (let i = 0; i < n; i++) {
  v.fromBufferAttribute(geo.attributes.position, i).applyMatrix4(mesh.matrixWorld)
  pos.set([v.x, v.y, v.z], i * 3)
}
const idx = geo.index.array

// Une vértices duplicados por normal
const unico = new Int32Array(n)
const visto = new Map()
for (let i = 0; i < n; i++) {
  const k = `${Math.round(pos[i * 3] * 1e5)},${Math.round(pos[i * 3 + 1] * 1e5)},${Math.round(pos[i * 3 + 2] * 1e5)}`
  if (!visto.has(k)) visto.set(k, i)
  unico[i] = visto.get(k)
}
const vizinhos = Array.from({ length: n }, () => [])
for (let t = 0; t < idx.length; t += 3) {
  const [a, b, c] = [unico[idx[t]], unico[idx[t + 1]], unico[idx[t + 2]]]
  vizinhos[a].push(b, c)
  vizinhos[b].push(a, c)
  vizinhos[c].push(a, b)
}

// Balança: o que está à frente do peito e abaixo do encaixe da haste
const ENCAIXE = 0.655 // corte no pino, logo acima da haste
const BASE_HASTE = 0.57 // abaixo disso começam as argolas e correntes
const ENTRE_PRATOS = 0.224 // os dois pratos se encostam aqui
const peca = new Uint8Array(n)
let zHaste = 0
let nHaste = 0
for (let i = 0; i < n; i++) {
  const [x, y, z] = pos.subarray(i * 3, i * 3 + 3)
  if (y >= ENCAIXE || y <= 0.2 || z <= 0.15 || x <= -0.02 || x >= 0.45) continue
  peca[i] = y > BASE_HASTE ? 1 : x < ENTRE_PRATOS ? 2 : 3
  if (peca[i] === 1) { zHaste += z; nHaste++ }
}
zHaste /= nHaste
const pinos = [[0.185, 0.64], [0.133, 0.585], [0.298, 0.585]].flatMap(([x, y]) => [x, y, zHaste])
// Triângulos que ligam os dois pratos, descartados no carregamento
const entrePratos = []
for (let t = 0; t < idx.length; t += 3) {
  const p = [peca[idx[t]], peca[idx[t + 1]], peca[idx[t + 2]]]
  if (p.includes(2) && p.includes(3)) entrePratos.push(t / 3)
}
// Formato: u32 [n, nSoltos], f32 x9 (pino, prato E, prato D), u32 soltos, u8 peça por vértice
const balanca = Buffer.concat([
  Buffer.from(new Uint32Array([n, entrePratos.length]).buffer),
  Buffer.from(new Float32Array(pinos).buffer),
  Buffer.from(new Uint32Array(entrePratos).buffer),
  Buffer.from(peca.buffer)
])
fs.writeFileSync(raiz + 'public/justica-balanca.bin', balanca)
console.log(`balança: ${nHaste} vértices na haste, ${entrePratos.length} triângulos entre os pratos, ${(balanca.length / 1024).toFixed(0)} KB`)

// Oclusão: concavidade local (laplaciano na direção da normal), suavizada em três escalas
const normal = new Float32Array(n * 3)
for (let t = 0; t < idx.length; t += 3) {
  const [a, b, c] = [unico[idx[t]], unico[idx[t + 1]], unico[idx[t + 2]]]
  if (a === b || b === c || a === c) continue
  const pa = V(...pos.subarray(a * 3, a * 3 + 3))
  const e1 = V(...pos.subarray(b * 3, b * 3 + 3)).sub(pa)
  const e2 = V(...pos.subarray(c * 3, c * 3 + 3)).sub(pa)
  const nf = e1.cross(e2)
  for (const k of [a, b, c]) {
    normal[k * 3] += nf.x
    normal[k * 3 + 1] += nf.y
    normal[k * 3 + 2] += nf.z
  }
}
const proprios = []
for (let i = 0; i < n; i++) if (unico[i] === i) proprios.push(i)
const unicos = vizinhos.map((l) => [...new Set(l)])
const concavo = new Float32Array(n)
for (const i of proprios) {
  const l = unicos[i]
  if (!l.length) continue
  const nn = V(...normal.subarray(i * 3, i * 3 + 3)).normalize()
  const media = V(0, 0, 0)
  let aresta = 0
  for (const j of l) {
    const pj = V(...pos.subarray(j * 3, j * 3 + 3))
    media.add(pj)
    aresta += pj.distanceTo(V(...pos.subarray(i * 3, i * 3 + 3)))
  }
  media.divideScalar(l.length).sub(V(...pos.subarray(i * 3, i * 3 + 3)))
  concavo[i] = media.dot(nn) / (aresta / l.length)
}
const espalhar = (origem, vezes) => {
  let atual = origem
  for (let r = 0; r < vezes; r++) {
    const prox = new Float32Array(n)
    for (const i of proprios) {
      let s = atual[i]
      for (const j of unicos[i]) s += atual[j]
      prox[i] = s / (unicos[i].length + 1)
    }
    atual = prox
  }
  return atual
}
const escalas = [[espalhar(concavo, 2), 1.2], [espalhar(concavo, 10), 3], [espalhar(concavo, 40), 6]]
const oclusao = new Uint8Array(n)
for (let i = 0; i < n; i++) {
  const k = unico[i]
  const o = escalas.reduce((s, [c, peso]) => s + peso * Math.max(0, c[k]), 0)
  oclusao[i] = Math.round(Math.max(0.3, Math.min(1, 1 - o)) * 255)
}
fs.writeFileSync(raiz + 'public/justica-oclusao.bin', oclusao)
console.log(`oclusão de ${n} vértices, ${(n / 1024).toFixed(0)} KB`)
