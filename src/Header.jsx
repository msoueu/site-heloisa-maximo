import './Header.css'
import { Sol, Lua, Relogio, Escudo } from './Icons'

const LINKS = [
  { label: 'Sobre', pagina: 'sobre' },
  { label: 'Conteúdo', pagina: 'conteudo' },
  { label: 'Atuação', pagina: 'atuacao' },
  { label: 'Contato', pagina: 'contato' },
  { label: 'Perguntas', sufixo: ' frequentes', pagina: 'perguntas' }
]

export default function Header({ rota, endereco, irPara, abrir, tema, alternarTema }) {
  const naHome = rota === 'home'
  // Destaque só na página aberta; na home nenhum link fica marcado
  const ativo = (link) => !naHome && endereco.startsWith(`#/${link.pagina}`)
  return (
    <div className={`header-overlay ${naHome ? '' : 'header-page'}`}>
      <nav className="header-nav">
        <button className="header-logo" onClick={() => irPara(0)} aria-label="Início">
          <span className="header-logo-mark">HM</span>
          <span className="header-logo-text">Heloisa Máximo<small>Advocacia Criminal</small></span>
        </button>

        <div className="header-right">
          <div className="header-nav-links">
            {LINKS.map((link) => (
              <button
                key={link.label}
                className={ativo(link) ? 'is-active' : ''}
                onClick={() => abrir(link.pagina)}
              >
                {link.label}{link.sufixo && <span>{link.sufixo}</span>}
              </button>
            ))}
          </div>
          <button
            className="header-theme"
            onClick={alternarTema}
            aria-label={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={tema === 'claro' ? 'Modo escuro' : 'Modo claro'}
          >
            {tema === 'claro' ? <Lua /> : <Sol />}
          </button>
        </div>
      </nav>

      <div className="header-cta">
        <a href="#/diagnostico">
          <span className="header-cta-pulse" />
          Analisar meu caso
        </a>
        <div className="cta-selos">
          <span><Relogio width={18} height={18} /> Atendimento 24h</span>
          <span><Escudo width={18} height={18} /> Atendimento confidencial</span>
        </div>
      </div>
    </div>
  )
}
