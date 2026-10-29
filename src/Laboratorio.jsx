import { IDEIAS, alternar, useIdeias } from './ideias'
import './Laboratorio.css'

export const LAB = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('lab')

export default function Laboratorio() {
  const ideia = useIdeias()
  return (
    <aside className="lab">
      <p className="lab-titulo">Testes</p>
      {IDEIAS.map((i) => (
        <label key={i.id} className="lab-item">
          <input type="checkbox" checked={ideia[i.id]} onChange={() => alternar(i.id)} />
          <span>{i.nome}</span>
        </label>
      ))}
    </aside>
  )
}
