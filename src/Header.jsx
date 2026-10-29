import './Header.css'
import { useSite, linkWhatsApp } from './SiteData'
import { Sol, Lua } from './Icons'

const LINKS = [
  { label: 'Sobre', pagina: 'sobre', section: 1 },
  { label: 'Conteúdo', pagina: 'conteudo', section: 2 },
  { label: 'Atuação', pagina: 'sobre/atuacao', section: 3 },
  { label: 'Contato', section: 4 }
]

export default function Header({ rota, endereco, current, irPara, abrir, tema, alternarTema }) {
  const { contato } = useSite()
  const naHome = rota === 'home'
  const ativo = (link) => {
    if (naHome) return current === link.section
    return link.pagina !== undefined && endereco === `#/${link.pagina}`
  }
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
                onClick={() => (link.pagina ? abrir(link.pagina) : irPara(link.section))}
              >
                {link.label}
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
        <a href={linkWhatsApp(contato.whatsapp)} target="_blank" rel="noreferrer">
          <span className="header-cta-pulse" />
          Agendar consulta
        </a>
        <p>Atendimento 24h para urgências</p>
      </div>
    </div>
  )
}
