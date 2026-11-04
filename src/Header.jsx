import { useEffect, useState } from 'react'
import './Header.css'
import { useSite, useParte, linkWhatsApp, nomesDoMenu } from './SiteData'
import { Sol, Lua, Relogio, Escudo, Menu, Fechar, WhatsApp } from './Icons'

export default function Header({ rota, endereco, irPara, tema, alternarTema }) {
  const { contato, menu: nomes } = useSite()
  const parteMenu = useParte('menu')
  const naHome = rota === 'home'
  const [menu, setMenu] = useState(false)

  // O voltar do celular também troca de página
  useEffect(() => setMenu(false), [endereco])

  useEffect(() => {
    if (!menu) return
    const fechar = (e) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', fechar)
    return () => window.removeEventListener('keydown', fechar)
  }, [menu])

  // Destaque só na página aberta; na home nenhum link fica marcado
  const ativo = (link) => !naHome && endereco.startsWith(`/${link.pagina}`)
  return (
    <div className={`header-overlay ${naHome ? '' : 'header-page'}`}>
      <nav className="header-nav">
        <a className="header-logo" href="/" onClick={() => { setMenu(false); irPara(0) }} aria-label="Início">
          <span className="header-logo-mark" />
          <span className="header-logo-text">Heloisa Maximo<small>Advocacia Criminal</small></span>
        </a>

        <div className="header-right">
          <div id="menu-site" className={`header-nav-links ${menu ? 'is-aberto' : ''}`} {...parteMenu}>
            {nomesDoMenu(nomes).map((link) => (
              <a
                key={link.pagina}
                href={`/${link.pagina}`}
                className={ativo(link) ? 'is-active' : ''}
                onClick={() => setMenu(false)}
              >
                {link.label}
              </a>
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
          <button
            className="header-theme header-menu"
            aria-expanded={menu}
            aria-controls="menu-site"
            aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <Fechar /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className="header-cta">
        <a href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer">
          <WhatsApp />
          Falar no WhatsApp
        </a>
        <div className="cta-selos">
          <span><Relogio width={18} height={18} /> Plantão 24h para urgências</span>
          <span><Escudo width={18} height={18} /> Atendimento confidencial</span>
        </div>
      </div>
    </div>
  )
}
