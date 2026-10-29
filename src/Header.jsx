import './Header.css'
import { useSite, linkWhatsApp } from './SiteData'
import { Sol, Lua } from './Icons'

const LINKS = [
  { label: 'Sobre', pagina: 'sobre' },
  { label: 'Conteúdo', pagina: 'conteudo' },
  { label: 'Atuação', pagina: 'atuacao' },
  { label: 'Contato', pagina: 'contato' }
]

export default function Header({ rota, endereco, irPara, abrir, tema, alternarTema }) {
  const { contato } = useSite()
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
