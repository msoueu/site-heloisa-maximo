import { useSyncExternalStore } from 'react'

// Opções do painel ?lab. As de estilo viram atributos data-<id> no <html>
export const IDEIAS = [
  { id: 'mouse', nome: 'Segue o mouse', ligada: false },
  { id: 'respiracao', nome: 'Respiração lenta', ligada: false },
  { id: 'balanca', nome: 'Balança se equilibrando', ligada: true },
  { id: 'poeira', nome: 'Poeira dourada', ligada: true },
  { id: 'destaque', nome: 'Texto com mais destaque', ligada: true, estilo: true },
  { id: 'veu', nome: 'Véu escuro atrás do texto', ligada: true, estilo: true }
]

export const ideia = Object.fromEntries(IDEIAS.map((i) => [i.id, i.ligada]))

function aplicarEstilos() {
  for (const i of IDEIAS) {
    if (i.estilo) document.documentElement.toggleAttribute(`data-${i.id}`, ideia[i.id])
  }
}
aplicarEstilos()

const ouvintes = new Set()
let versao = 0

export function alternar(id) {
  ideia[id] = !ideia[id]
  aplicarEstilos()
  versao++
  ouvintes.forEach((f) => f())
}

export function useIdeias() {
  useSyncExternalStore(
    (f) => { ouvintes.add(f); return () => ouvintes.delete(f) },
    () => versao
  )
  return ideia
}

export function aoMudar(f) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}
