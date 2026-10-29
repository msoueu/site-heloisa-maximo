import './SectionContent.css'
import { useSite, linkWhatsApp } from './SiteData'
import { Seta, WhatsApp, Instagram, Local, Relogio } from './Icons'

function Tag({ children, onClick }) {
  if (!onClick) return <p className="panel-tag">{children}</p>
  return (
    <button className="panel-tag panel-tag-link" onClick={onClick}>
      {children} <Seta />
    </button>
  )
}

export default function SectionContent({ current, abrir }) {
  const { perfil, contato, destaques, areas, conteudos } = useSite()
  const destaque = conteudos[0]
  const painel = (i) => `section-panel panel-clicavel ${current === i ? 'panel-active' : 'panel-hidden'}`
  // Clicar em qualquer parte do texto abre a página; links e botões de dentro seguem o próprio destino
  const leva = (i, pagina) => ({
    onClick: (e) => { if (!e.target.closest('a, button')) abrir(pagina) },
    onKeyDown: (e) => { if (e.key === 'Enter' && e.target === e.currentTarget) abrir(pagina) },
    tabIndex: current === i ? 0 : -1
  })

  return (
    <div className="section-content">
      <section className={painel(0)} {...leva(0, 'sobre')}>
        <Tag onClick={() => abrir('sobre')}>ADVOCACIA CRIMINAL</Tag>
        <div className="panel-intro">
          <h1 className="panel-name">{perfil.nome}</h1>
          <div className="panel-divider" />
          <p className="panel-desc">{perfil.slogan}</p>
          <p className="panel-sub">{perfil.especialidade} · Atuação Nacional</p>
        </div>
        <button className="panel-link" onClick={() => abrir('sobre')}>
          Conheça a advogada <Seta />
        </button>
      </section>

      <section className={painel(1)} {...leva(1, 'sobre')}>
        <Tag onClick={() => abrir('sobre')}>SOBRE</Tag>
        <h2 className="panel-titulo">{perfil.titulo}</h2>
        <div className="panel-divider" />
        <div className="panel-sobre">
          <img src={perfil.foto} alt={perfil.nome} className="panel-foto" />
          <ul className="panel-facts">
            {destaques.map((d) => (
              <li key={d.titulo}>
                <strong>{d.titulo}</strong>
                <span>{d.texto}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="panel-link" onClick={() => abrir('sobre')}>
          Conheça a trajetória completa <Seta />
        </button>
      </section>

      <section className={`${painel(2)} panel-conteudo`} {...leva(2, 'conteudo')}>
        {destaque && (
          <>
            <Tag onClick={() => abrir('conteudo')}>CONTEÚDO JURÍDICO</Tag>
            <h2 className="panel-titulo">{destaque.titulo}</h2>
            <div className="panel-divider" />
            <p className="panel-desc">{destaque.texto[0]}</p>
            <p className="panel-desc">{destaque.resumo}</p>
            <button className="panel-link" onClick={() => abrir('conteudo')}>
              Ver mais conteúdo jurídico <Seta />
            </button>
          </>
        )}
      </section>

      <section className={painel(3)} {...leva(3, 'atuacao')}>
        <Tag onClick={() => abrir('atuacao')}>ÁREAS DE ATUAÇÃO</Tag>
        <h2 className="panel-titulo">Defesa em todas as fases do processo penal</h2>
        <div className="panel-divider" />
        <ol className="panel-areas">
          {areas.map((a, i) => (
            <li key={a.titulo}>
              <span className="area-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="area-nome">{a.titulo}</span>
            </li>
          ))}
        </ol>
        <button className="panel-link" onClick={() => abrir('atuacao')}>
          Ver todas as áreas <Seta />
        </button>
      </section>

      <section className={painel(4)} {...leva(4, 'contato')}>
        <Tag onClick={() => abrir('contato')}>CONTATO</Tag>
        <h2 className="panel-name">Cada hora conta.</h2>
        <div className="panel-divider" />
        <p className="panel-desc">
          Em uma situação criminal, a primeira orientação faz toda a diferença. Fale diretamente
          com a advogada, com sigilo absoluto. Atendimento com hora marcada e plantão 24h para
          urgências como prisões em flagrante.
        </p>
        <ul className="panel-contact">
          <li><Relogio /> Plantão 24h para urgências</li>
          <li><Local /> {perfil.local}</li>
          <li>
            <Instagram />
            <a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a>
          </li>
        </ul>
        <a href={linkWhatsApp(contato.whatsapp)} target="_blank" rel="noreferrer" className="panel-btn panel-btn-solid">
          <WhatsApp /> Falar no WhatsApp
        </a>
        <button className="panel-link panel-link-contato" onClick={() => abrir('contato')}>
          Todas as formas de contato <Seta />
        </button>
      </section>
    </div>
  )
}
