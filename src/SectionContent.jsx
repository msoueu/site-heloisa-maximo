import './SectionContent.css'
import { useSite } from './SiteData'
import { Seta, Instagram, Local, Relogio } from './Icons'

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
    <main className="section-content" id="conteudo" tabIndex={-1}>
      <section className={painel(0)}>
        <Tag onClick={() => abrir('sobre')}>ADVOCACIA CRIMINAL</Tag>
        <div className="panel-intro">
          <h1 className="panel-name">{perfil.nome}</h1>
          <p className="panel-desc">{perfil.slogan}</p>
          <p className="panel-sub">{perfil.especialidade} · Atuação Nacional</p>
        </div>
        <button className="panel-link" onClick={() => abrir('sobre')}>
          Conheça a advogada <Seta />
        </button>
      </section>

      <section className={painel(1)}>
        <Tag onClick={() => abrir('sobre')}>SOBRE</Tag>
        <h2 className="panel-titulo">{perfil.titulo}</h2>
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
            <p className="panel-desc">{destaque.texto[0]}</p>
            <p className="panel-desc">{destaque.resumo}</p>
            <button className="panel-link" onClick={() => abrir('conteudo')}>
              Ver mais conteúdo jurídico <Seta />
            </button>
          </>
        )}
      </section>

      <section className={painel(3)}>
        <Tag onClick={() => abrir('atuacao')}>ÁREAS DE ATUAÇÃO</Tag>
        <h2 className="panel-titulo">Defesa em todas as fases do processo penal</h2>
        <ol className="panel-areas">
          {areas.map((a) => (
            <li key={a.titulo}>
              <span className="area-nome">{a.titulo}</span>
            </li>
          ))}
        </ol>
        <button className="panel-link" onClick={() => abrir('atuacao')}>
          Ver todas as áreas <Seta />
        </button>
      </section>

      <section className={painel(4)}>
        <Tag onClick={() => abrir('contato')}>CONTATO</Tag>
        <h2 className="panel-name">Cada hora conta.</h2>
        <p className="panel-desc">
          Em uma situação criminal, a primeira orientação faz toda a diferença. Faça o diagnóstico
          rápido do seu caso em menos de 5 minutos e fale diretamente com a advogada, com sigilo
          absoluto.
        </p>
        <ul className="panel-contact">
          <li><Relogio /> Plantão 24h para urgências</li>
          <li><Local /> {perfil.local}</li>
          <li>
            <Instagram />
            <a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a>
          </li>
        </ul>
        <a href="#/diagnostico" className="panel-btn panel-btn-solid">
          Analisar meu caso <Seta />
        </a>
        <button className="panel-link panel-link-contato" onClick={() => abrir('contato')}>
          Todas as formas de contato <Seta />
        </button>
      </section>
    </main>
  )
}
