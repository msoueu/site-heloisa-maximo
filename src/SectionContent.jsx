import './SectionContent.css'
import { useSite, Texto } from './SiteData'
import { Seta, Instagram, Local, Relogio } from './Icons'

function Tag({ children, href }) {
  return (
    <a className="panel-tag panel-tag-link" href={href}>
      {children} <Seta />
    </a>
  )
}

export default function SectionContent({ current }) {
  const { perfil, contato, destaques, areas, conteudos } = useSite()
  const destaque = conteudos[0]
  const painel = (i) => `section-panel ${current === i ? 'panel-active' : 'panel-hidden'}`

  return (
    <main className="section-content" id="conteudo" tabIndex={-1}>
      <section className={painel(0)}>
        <Tag href="/sobre">ADVOCACIA CRIMINAL</Tag>
        <div className="panel-intro">
          <h1 className="panel-name"><Texto de={perfil} campo="nome" /></h1>
          <p className="panel-desc"><Texto de={perfil} campo="slogan" /></p>
          <p className="panel-sub"><Texto de={perfil} campo="especialidade" /> · Atuação Nacional</p>
        </div>
        <a className="panel-link" href="/sobre">
          Conheça a advogada <Seta />
        </a>
      </section>

      <section className={painel(1)}>
        <Tag href="/sobre">SOBRE</Tag>
        <h2 className="panel-titulo"><Texto de={perfil} campo="titulo" /></h2>
        <div className="panel-sobre">
          <img src={perfil.foto} alt={perfil.nome} className="panel-foto" loading="lazy" decoding="async" />
          <ul className="panel-facts">
            {destaques.map((d, i) => (
              <li key={i}>
                <strong><Texto de={d} campo="titulo" /></strong>
                <span><Texto de={d} campo="texto" /></span>
              </li>
            ))}
          </ul>
        </div>
        <a className="panel-link" href="/sobre">
          Conheça a trajetória completa <Seta />
        </a>
      </section>

      <section className={`${painel(2)} panel-conteudo`}>
        {destaque && (
          <>
            <Tag href="/conteudo">CONTEÚDO JURÍDICO</Tag>
            <h2 className="panel-titulo"><Texto de={destaque} campo="titulo" /></h2>
            <p className="panel-desc"><Texto de={destaque} campo="texto">{destaque.texto[0]}</Texto></p>
            <p className="panel-desc"><Texto de={destaque} campo="resumo" /></p>
            <a className="panel-link" href="/conteudo">
              Ver mais conteúdo jurídico <Seta />
            </a>
          </>
        )}
      </section>

      <section className={painel(3)}>
        <Tag href="/atuacao">ÁREAS DE ATUAÇÃO</Tag>
        <h2 className="panel-titulo">Defesa em todas as fases do processo penal</h2>
        <ol className="panel-areas">
          {areas.map((a, i) => (
            <li key={i}>
              <span className="area-nome"><Texto de={a} campo="titulo" /></span>
            </li>
          ))}
        </ol>
        <a className="panel-link" href="/atuacao">
          Ver todas as áreas <Seta />
        </a>
      </section>

      <section className={painel(4)}>
        <Tag href="/contato">CONTATO</Tag>
        <h2 className="panel-name">Contato</h2>
        <p className="panel-desc">
          Fale com a advogada pelo WhatsApp ou conte sua situação em quatro perguntas rápidas. Sua
          conversa é protegida pelo sigilo profissional, nos termos da lei.
        </p>
        <ul className="panel-contact">
          <li><Relogio /> Plantão 24h para urgências</li>
          <li><Local /> <Texto de={perfil} campo="local" /></li>
          <li>
            <Instagram />
            <a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a>
          </li>
        </ul>
        <a href="/diagnostico" className="panel-btn panel-btn-solid">
          Contar minha situação <Seta />
        </a>
        <a className="panel-link panel-link-contato" href="/contato">
          Todas as formas de contato <Seta />
        </a>
      </section>
    </main>
  )
}
