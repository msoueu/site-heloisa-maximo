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
  const { perfil, contato, destaques, areas, conteudos, textos } = useSite()
  const destaque = conteudos[0]
  const painel = (i) => `section-panel ${current === i ? 'panel-active' : 'panel-hidden'}`

  return (
    <main className="section-content" id="conteudo" tabIndex={-1}>
      <section className={painel(0)}>
        <Tag href="/sobre"><Texto de={textos} campo="inicio.tag" /></Tag>
        <div className="panel-intro">
          <h1 className="panel-name"><Texto de={perfil} campo="nome" /></h1>
          <p className="panel-desc"><Texto de={perfil} campo="slogan" /></p>
          <p className="panel-sub"><Texto de={perfil} campo="especialidade" /> · <Texto de={textos} campo="inicio.alcance" /></p>
        </div>
        <a className="panel-link" href="/sobre">
          <Texto de={textos} campo="inicio.linkSobre" /> <Seta />
        </a>
      </section>

      <section className={painel(1)}>
        <Tag href="/sobre"><Texto de={textos} campo="inicio.tagSobre" /></Tag>
        <h2 className="panel-titulo"><Texto de={perfil} campo="titulo" /></h2>
        <div className="panel-sobre">
          <img src={perfil.foto} alt={perfil.nome} className="panel-foto" loading="lazy" decoding="async" />
          <ul className="panel-facts">
            {destaques.map((d, i) => (
              <li key={i}>
                <strong><Texto de={d} campo="titulo" /></strong>
                <span><Texto de={d} campo="texto" /></span>
                <a className="panel-ler-mais" href="/sobre">Ler mais</a>
              </li>
            ))}
          </ul>
        </div>
        <a className="panel-link" href="/sobre">
          <Texto de={textos} campo="inicio.linkTrajetoria" /> <Seta />
        </a>
      </section>

      <section className={`${painel(2)} panel-conteudo`}>
        {destaque && (
          <>
            <Tag href="/conteudo"><Texto de={textos} campo="inicio.tagConteudo" /></Tag>
            <h2 className="panel-titulo"><Texto de={destaque} campo="titulo" /></h2>
            <p className="panel-desc"><Texto de={destaque} campo="texto">{destaque.texto[0]}</Texto></p>
            <p className="panel-desc"><Texto de={destaque} campo="resumo" /></p>
            <a className="panel-link" href="/conteudo">
              <Texto de={textos} campo="inicio.linkConteudo" /> <Seta />
            </a>
          </>
        )}
      </section>

      <section className={painel(3)}>
        <Tag href="/atuacao"><Texto de={textos} campo="inicio.tagAtuacao" /></Tag>
        <h2 className="panel-titulo"><Texto de={textos} campo="inicio.tituloAtuacao" /></h2>
        <ol className="panel-areas">
          {areas.map((a, i) => (
            <li key={i}>
              <span className="area-nome"><Texto de={a} campo="titulo" /></span>
            </li>
          ))}
        </ol>
        <a className="panel-link" href="/atuacao">
          <Texto de={textos} campo="inicio.linkAtuacao" /> <Seta />
        </a>
      </section>

      <section className={painel(4)}>
        <Tag href="/contato"><Texto de={textos} campo="inicio.tagContato" /></Tag>
        <h2 className="panel-name"><Texto de={textos} campo="inicio.tituloContato" /></h2>
        <p className="panel-desc"><Texto de={textos} campo="inicio.textoContato" /></p>
        <ul className="panel-contact">
          <li><Relogio /> <Texto de={textos} campo="geral.selo1" /></li>
          <li><Local /> <Texto de={perfil} campo="local" /></li>
          <li>
            <Instagram />
            <a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a>
          </li>
        </ul>
        <a href="/diagnostico" className="panel-btn panel-btn-solid">
          <Texto de={textos} campo="inicio.botaoSituacao" /> <Seta />
        </a>
        <a className="panel-link panel-link-contato" href="/contato">
          <Texto de={textos} campo="inicio.linkContato" /> <Seta />
        </a>
      </section>
    </main>
  )
}
