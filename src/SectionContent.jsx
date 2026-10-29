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
  const painel = (i) => `section-panel ${current === i ? 'panel-active' : 'panel-hidden'}`

  return (
    <div className="section-content">
      <section className={painel(0)}>
        <Tag>ADVOCACIA CRIMINAL</Tag>
        <div className="panel-intro">
          <h1 className="panel-name">{perfil.nome}</h1>
          <div className="panel-divider" />
          <p className="panel-desc">{perfil.slogan}</p>
          <p className="panel-sub">{perfil.especialidade} · Atuação Nacional</p>
        </div>
      </section>

      <section className={painel(1)}>
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

      <section className={`${painel(2)} panel-conteudo`}>
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

      <section className={painel(3)}>
        <Tag>ÁREAS DE ATUAÇÃO</Tag>
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
      </section>

      <section className={painel(4)}>
        <Tag>CONTATO</Tag>
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
      </section>
    </div>
  )
}
