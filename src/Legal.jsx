import { Pagina, useSite } from './Pages'
import { PRIVACIDADE, TERMOS } from './textosLegais'

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g

function Inline({ texto }) {
  return texto.split(INLINE).map((t, i) => {
    if (t.startsWith('**')) return <strong key={i}>{t.slice(2, -2)}</strong>
    if (t.startsWith('*')) return <em key={i}>{t.slice(1, -1)}</em>
    const link = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>
    return t
  })
}

function preencher(texto, oab) {
  const partes = oab.match(/OAB\s*\/?\s*([A-Za-z]{2})\s*(?:n[º°o]\s*)?([\dx.]+)/i)
  const inscricao = partes
    ? `, inscrita na Ordem dos Advogados do Brasil, Seccional ${partes[1].toUpperCase()}, sob o nº ${partes[2]}`
    : oab && `, inscrita na Ordem dos Advogados do Brasil (${oab})`
  const numero = partes ? `OAB/${partes[1].toUpperCase()} nº ${partes[2]}` : oab
  return texto
    .replace('{{INSCRICAO}}', inscricao)
    .replace('{{OAB_LINHA}}', numero && ` — ${numero}`)
    .replace(/\{\{OAB\}\}\r?\n/, numero ? `${numero}\n` : '')
}

// Blocos separados por linha em branco; só o que os dois textos usam
function Bloco({ bloco }) {
  const linhas = bloco.split('\n')
  if (bloco.startsWith('# ')) return <h1>{bloco.slice(2)}</h1>
  if (bloco.startsWith('## ')) return <h2>{bloco.slice(3)}</h2>
  if (bloco.startsWith('### ')) return <h3>{bloco.slice(4)}</h3>
  if (bloco.startsWith('- ')) {
    return <ul>{linhas.map((l) => <li key={l}><Inline texto={l.slice(2)} /></li>)}</ul>
  }
  if (/^1\. /.test(bloco)) {
    return <ol>{linhas.map((l) => <li key={l}><Inline texto={l.replace(/^\d+\. /, '')} /></li>)}</ol>
  }
  return <p>{linhas.map((l, i) => <span key={l}>{i > 0 && <br />}<Inline texto={l.trim()} /></span>)}</p>
}

function Documento({ abrir, texto }) {
  const { perfil } = useSite()
  return (
    <Pagina abrir={abrir} chamada={false} plantao={false}>
      <div className="legal">
        {preencher(texto, perfil.oab).split('\n\n').map((b) => <Bloco key={b} bloco={b} />)}
      </div>
    </Pagina>
  )
}

export const PrivacidadePage = ({ abrir }) => <Documento abrir={abrir} texto={PRIVACIDADE} />
export const TermosPage = ({ abrir }) => <Documento abrir={abrir} texto={TERMOS} />
