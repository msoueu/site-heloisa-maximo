import { Pagina } from './Pages'
import { useSite } from './SiteData'
import { PRIVACIDADE, TERMOS, preencher } from './textosLegais'

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

function Documento({ texto }) {
  const { perfil } = useSite()
  return (
    <Pagina chamada={false} plantao={false}>
      <div className="legal">
        {preencher(texto, perfil.oab).split('\n\n').map((b) => <Bloco key={b} bloco={b} />)}
      </div>
    </Pagina>
  )
}

export const PrivacidadePage = () => <Documento texto={PRIVACIDADE} />
export const TermosPage = () => <Documento texto={TERMOS} />
