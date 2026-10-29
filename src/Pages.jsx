import { useEffect, useState } from 'react'
import { DEV } from './data'
import { useSite, linkWhatsApp } from './SiteData'
import { Seta, Voltar, WhatsApp, Instagram, Local, Relogio, GitHub } from './Icons'
import './Pages.css'

function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}

function Rodape({ abrir }) {
  const { perfil, contato } = useSite()
  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div>
          <p className="page-footer-name">{perfil.nome}</p>
          <p className="page-footer-muted">{perfil.titulo}{perfil.oab && ` · ${perfil.oab}`}</p>
        </div>
        <ul>
          <li><Relogio /> Plantão 24h para urgências</li>
          <li><Local /> {perfil.local}</li>
          <li><Instagram /><a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a></li>
        </ul>
        <div className="page-footer-links">
          <button onClick={() => abrir('sobre')}>Sobre</button>
          <button onClick={() => abrir('conteudo')}>Conteúdo jurídico</button>
          <a href={linkWhatsApp(contato.whatsapp)} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <p className="page-footer-legal">
        Conteúdo de caráter exclusivamente informativo, em conformidade com o Código de Ética e
        Disciplina da OAB e o Provimento nº 205/2021. © {new Date().getFullYear()} {perfil.nome}.
        <a className="page-footer-dev" href={DEV.github} target="_blank" rel="noreferrer">
          <GitHub width={14} height={14} /> Site por {DEV.nome}
        </a>
        {/* crédito exigido pela licença CC BY 4.0 do modelo */}
        <a
          className="page-footer-modelo"
          href="https://sketchfab.com/3d-models/lady-justice-statue-holding-scales-held-by-chai-0a201e1e2cbc499e8e18cfec34402dc9"
          target="_blank"
          rel="noreferrer"
        >
          Estátua 3D: RaresXS · CC BY 4.0
        </a>
      </p>
    </footer>
  )
}

function LinkVoltar({ children = 'Voltar ao início' }) {
  return (
    <a className="page-back" href="#/">
      <Voltar /> {children}
    </a>
  )
}

function ChamadaContato() {
  const { contato } = useSite()
  return (
    <section className="page-cta reveal">
      <p className="panel-tag">ATENDIMENTO</p>
      <h2>Precisa de orientação agora?</h2>
      <p>Fale diretamente com a advogada, com sigilo absoluto. Plantão 24h para urgências.</p>
      <a href={linkWhatsApp(contato.whatsapp)} target="_blank" rel="noreferrer" className="panel-btn panel-btn-solid">
        <WhatsApp /> Falar no WhatsApp
      </a>
    </section>
  )
}

export function SobrePage({ abrir }) {
  const { perfil, destaques, areas, etapas } = useSite()
  useReveal('sobre')

  return (
    <main className="page">
      <div className="page-inner">
        <LinkVoltar />

        <section className="sobre-hero">
          <div className="sobre-hero-text reveal">
            <p className="panel-tag">SOBRE</p>
            <h1 className="page-title">{perfil.nome}</h1>
            <p className="page-lead">{perfil.titulo} · {perfil.especialidade}</p>
            <div className="panel-divider" />
            <p className="page-quote">“{perfil.slogan}”</p>
            {(perfil.oab || perfil.formacao) && (
              <p className="page-meta">{[perfil.oab, perfil.formacao].filter(Boolean).join(' · ')}</p>
            )}
          </div>
          <figure className="sobre-hero-foto reveal">
            <img src={perfil.foto} alt={perfil.nome} />
          </figure>
        </section>

        <section className="page-section reveal">
          <div className="page-grid-4">
            {destaques.map((d) => (
              <div className="page-card" key={d.titulo}>
                <h3>{d.titulo}</h3>
                <p>{d.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section page-two-col">
          <div className="reveal">
            <p className="panel-tag">TRAJETÓRIA</p>
            <h2 className="page-h2">Uma advocacia que vai além dos autos</h2>
          </div>
          <div className="page-prose reveal">
            <p>
              Heloisa Máximo é advogada criminalista, com atuação dedicada ao Direito Penal e ao
              Direito Processual Penal. Seu trabalho se apoia em três pilares: a técnica jurídica
              rigorosa, o atendimento humanizado e a postura combativa na defesa de cada cliente.
            </p>
            <p>
              Representando a Jovem Advocacia, foi palestrante do projeto “Advocacia por Elas”, da
              OAB/SE, debatendo o enfrentamento à violência doméstica no interior do estado.
            </p>
            <p>
              Atuou no PREFEM/SE em conjunto com o Mecanismo Estadual de Prevenção e Combate à
              Tortura, acompanhando de perto a realidade do sistema prisional. Essa experiência
              reforça sua convicção de que a dignidade humana é inegociável.
            </p>
            <p>
              Também atua na defesa dos interesses de vítimas e de suas famílias, buscando as
              instâncias superiores sempre que necessário para que nenhuma investigação seja
              interrompida antes do tempo.
            </p>
          </div>
        </section>

        <section className="page-section page-ancora" id="atuacao">
          <div className="reveal">
            <p className="panel-tag">ÁREAS DE ATUAÇÃO</p>
            <h2 className="page-h2">Defesa em todas as fases do processo penal</h2>
          </div>
          <div className="page-grid-3">
            {areas.map((a, i) => (
              <article className="page-card page-card-area reveal" key={a.titulo}>
                <span className="page-card-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{a.titulo}</h3>
                <p>{a.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section">
          <div className="reveal">
            <p className="panel-tag">COMO FUNCIONA</p>
            <h2 className="page-h2">Do primeiro contato à conclusão do caso</h2>
          </div>
          <ol className="page-steps">
            {etapas.map((e, i) => (
              <li className="reveal" key={e.titulo}>
                <span>{i + 1}</span>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <blockquote className="page-big-quote reveal">
          A dignidade humana não aceita meios-termos: ela é, por definição, inegociável.
          <cite>{perfil.nome}</cite>
        </blockquote>

        <ChamadaContato />
      </div>
      <Rodape abrir={abrir} />
    </main>
  )
}

function Artigo({ c, aberto, alternar }) {
  return (
    <article className="artigo reveal" id={c.id}>
      <div className="artigo-midia">
        {c.imagem && <img src={c.imagem} alt={c.imagemAlt} loading="lazy" />}
        {c.video && (
          <video src={c.video} poster={c.poster} controls playsInline preload="none" aria-label={c.videoLegenda} />
        )}
      </div>
      <div className="artigo-texto">
        <p className="artigo-meta">
          <span>{c.categoria}</span>{c.data && ` · ${c.data}`}
        </p>
        <h2>{c.titulo}</h2>
        {c.texto ? (
          <>
            {(aberto ? c.texto : c.texto.slice(0, 1)).map((p, i) => <p key={i}>{p}</p>)}
            {c.texto.length > 1 && (
              <button className="panel-link" onClick={alternar}>
                {aberto ? 'Mostrar menos' : 'Ler na íntegra'} <Seta />
              </button>
            )}
          </>
        ) : (
          <p>{c.resumo}</p>
        )}
      </div>
    </article>
  )
}

export function ConteudoPage({ abrir }) {
  const { conteudos } = useSite()
  const [abertos, setAbertos] = useState({})

  useReveal(conteudos)

  return (
    <main className="page">
      <div className="page-inner">
        <LinkVoltar />

        <header className="page-header reveal">
          <p className="panel-tag">CONTEÚDO JURÍDICO</p>
          <h1 className="page-title">Direito, atuação e reflexões</h1>
          <p className="page-lead">
            Casos, palestras e explicações sobre Direito Penal em linguagem acessível.
          </p>
        </header>

        <div className="artigos">
          {conteudos.map((c) => (
            <Artigo
              key={c.id}
              c={c}
              aberto={!!abertos[c.id]}
              alternar={() => setAbertos((a) => ({ ...a, [c.id]: !a[c.id] }))}
            />
          ))}
        </div>

        <ChamadaContato />
      </div>
      <Rodape abrir={abrir} />
    </main>
  )
}
