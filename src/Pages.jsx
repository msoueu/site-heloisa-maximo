import { useEffect, useRef, useState } from 'react'
import { DEV, TRAJETORIA } from './data'
import { useSite, linkWhatsApp } from './SiteData'
import { Seta, Voltar, WhatsApp, Instagram, Local, Relogio, Email, Telefone, Papeis, Escudo, Sino } from './Icons'
import './Pages.css'

// Termos destacados nos textos; vale também para o que for editado no painel
const TERMOS = /(Direito Processual Penal|Direito Penal|dignidade humana|sigilo profissional|Plantão 24h|prisões em flagrante|audiência de custódia|Jovem Advocacia|Advocacia por Elas|PREFEM\/SE|vítimas|instâncias superiores|Tribunal do Júri|crimes dolosos contra a vida|liberdade|defesa técnica|recursos às instâncias superiores|progressão de regime|todo o Brasil|verdade real|riscos e possibilidades|próximos passos|linguagem simples|conclusão do processo)/gi

export function Realce({ children }) {
  return String(children).split(TERMOS).map((trecho, i) => (
    i % 2 ? <strong className="realce" key={i}>{trecho}</strong> : trecho
  ))
}

const FORMATO_HORA = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', timeStyle: 'medium' })

export function Horario() {
  const [agora, setAgora] = useState(() => FORMATO_HORA.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setAgora(FORMATO_HORA.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="sinal-relogio"><span /> Plantão 24h · Horário de Brasília {agora}</p>
}

// Cada .sinal aparece e desenha sua linha ao entrar na tela
export function useSinal(dep) {
  const raiz = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && e.target.classList.add('sinal-on')),
      { rootMargin: '0px 0px -8% 0px' }
    )
    raiz.current.querySelectorAll('.sinal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
  return raiz
}

// Passa a posição do cursor para as bordas dos .feixe-bloco, que acendem perto dele
export function useFeixe() {
  const raiz = useRef()
  useEffect(() => {
    const mover = (e) => {
      raiz.current.style.setProperty('--x', `${e.clientX}px`)
      raiz.current.style.setProperty('--y', `${e.clientY}px`)
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [])
  return raiz
}

export function BotaoWhatsApp() {
  const { contato } = useSite()
  return (
    <a href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer" className="page-botao">
      <WhatsApp width={22} height={22} /> Falar no WhatsApp
    </a>
  )
}

function Rodape() {
  const { perfil, contato } = useSite()
  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-marca">
          <span className="page-footer-monograma" />
          <div>
            <p className="page-footer-name">{perfil.nome}</p>
            <p className="page-footer-area">Advocacia Criminal</p>
            {perfil.oab && <p>{perfil.oab}</p>}
          </div>
        </div>
        <ul>
          <li><Relogio /> Plantão 24h para urgências</li>
          <li><Local /> {perfil.local}</li>
          <li><Instagram /><a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a></li>
        </ul>
        <nav className="page-footer-links" aria-label="Páginas do site">
          <a href="/sobre">Sobre</a>
          <a href="/conteudo">Conteúdo jurídico</a>
          <a href="/atuacao">Áreas de atuação</a>
          <a href="/contato">Contato</a>
          <a href="/perguntas">Perguntas frequentes</a>
        </nav>
      </div>
      <div className="page-footer-base">
        <nav aria-label="Informações legais">
          <a href="/privacidade">Política de Privacidade</a>
          <a href="/termos">Termos de Uso</a>
        </nav>
        <p>© {new Date().getFullYear()} {perfil.nome}. Todos os direitos reservados.{perfil.oab && ` ${perfil.oab}.`}</p>
        <p>Conteúdo de caráter exclusivamente informativo.</p>
        <p className="page-footer-creditos">
          <a href={DEV.github} target="_blank" rel="noreferrer">Site por {DEV.nome}</a>
          {/* crédito exigido pela licença CC BY 4.0 do modelo */}
          <a
            href="https://sketchfab.com/3d-models/lady-justice-statue-holding-scales-held-by-chai-0a201e1e2cbc499e8e18cfec34402dc9"
            target="_blank"
            rel="noreferrer"
          >
            Estátua: RaresXS (CC BY 4.0)
          </a>
        </p>
      </div>
    </footer>
  )
}

export function Pagina({ chamada = true, plantao = true, children }) {
  return (
    <main className="page" id="conteudo" tabIndex={-1}>
      <div className="page-inner">
        <a className="page-back" href="/">
          <Voltar width={18} height={18} /> Voltar ao início
        </a>
        {plantao && <Horario />}
        {children}
      </div>
      {chamada && (
        <section className="page-chamada">
          <div>
            <h2>Contato</h2>
            <p>Fale com a advogada pelo WhatsApp. Sua conversa é protegida pelo sigilo profissional, nos termos da lei.</p>
          </div>
          <BotaoWhatsApp />
        </section>
      )}
      <Rodape />
    </main>
  )
}

export function SobrePage() {
  const { perfil, destaques } = useSite()
  const raiz = useSinal()

  return (
    <Pagina>
      <div ref={raiz}>
        <header className="sinal sinal-topo">
          <div>
            <h1>{perfil.nome}</h1>
            <p className="page-lead">{perfil.titulo}, com atuação em {perfil.especialidade}.</p>
            <p className="page-slogan">{perfil.slogan}</p>
            {(perfil.oab || perfil.formacao) && (
              <p>{[perfil.oab, perfil.formacao].filter(Boolean).join(' · ')}</p>
            )}
          </div>
          <img src={perfil.foto} alt={`Retrato de ${perfil.nome}`} />
        </header>

        <section className="sinal sinal-linha">
          <h2>Trajetória</h2>
          <div className="page-texto">
            {TRAJETORIA.map((p) => <p key={p}><Realce>{p}</Realce></p>)}
          </div>
        </section>

        <section className="sinal sinal-linha">
          <h2>Convicção</h2>
          <blockquote className="page-citacao">
            <p>A dignidade humana não aceita meios-termos: ela é, por definição, inegociável.</p>
            <cite>
              {perfil.nome}, em{' '}
              <a href="/conteudo/carcere-de-frente">“O cárcere visto de frente: a dignidade humana é inegociável”</a>
            </cite>
          </blockquote>
        </section>

        {destaques.map((d) => (
          <section className="sinal sinal-linha" key={d.titulo}>
            <h2>{d.titulo}</h2>
            <p><Realce>{d.texto}</Realce></p>
          </section>
        ))}

        <a className="page-seguir" href="/atuacao">
          Ver as áreas de atuação <Seta width={20} height={20} />
        </a>
      </div>
    </Pagina>
  )
}

function Midia({ c }) {
  if (c.video) {
    return <video src={c.video} poster={c.poster} controls playsInline preload="none" aria-label={c.videoLegenda} />
  }
  return c.imagem ? <img src={c.imagem} alt={c.imagemAlt} /> : null
}

export function ConteudoPage() {
  const { conteudos } = useSite()
  // /conteudo/carcere-de-frente abre direto nessa publicação; pelo id, porque a lista do painel chega depois
  const [ativo, setAtivo] = useState(() => window.location.pathname.split('/')[2])
  const leitor = useRef()
  const c = conteudos.find((p) => p.id === ativo) || conteudos[0]

  const escolher = (id) => {
    setAtivo(id)
    // O leitor é recriado a cada publicação: a rolagem espera o novo entrar na página
    requestAnimationFrame(() => leitor.current.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <Pagina chamada={false}>
      <header className="page-header">
        <h1>Direito e reflexões</h1>
        <p className="page-lead"><Realce>Palestras e explicações sobre Direito Penal em linguagem acessível.</Realce></p>
      </header>

      {c && (
        <div className="indice">
          <div>
            {conteudos.map((item) => (
              <button
                key={item.id}
                aria-pressed={item.id === c.id}
                onClick={() => escolher(item.id)}
                onMouseEnter={() => setAtivo(item.id)}
              >
                <span>{item.categoria}{item.data && `, ${item.data}`}</span>
                {item.titulo}
              </button>
            ))}
          </div>
          <article className="indice-leitor" ref={leitor} key={c.id}>
            <Midia c={c} />
            <div className="page-texto">
              {(c.texto || [c.resumo]).map((p) => <p key={p}><Realce>{p}</Realce></p>)}
            </div>
          </article>
        </div>
      )}
    </Pagina>
  )
}

// Segue a ordem das etapas; se forem acrescentadas no painel, os ícones se repetem
const ICONES_ETAPA = [Telefone, Papeis, Escudo, Sino]

export function AtuacaoPage() {
  const { areas, etapas } = useSite()
  const raiz = useFeixe()

  return (
    <Pagina>
      <header className="page-header">
        <h1>Defesa em todas as fases do processo penal</h1>
        <p className="page-lead">Atuação exclusiva na área criminal, do inquérito aos tribunais.</p>
      </header>

      <div ref={raiz}>
        <div className="feixe-grade">
          {areas.map((a) => (
            <article className="feixe-bloco" key={a.titulo}>
              <h2>{a.titulo}</h2>
              <p><Realce>{a.texto}</Realce></p>
            </article>
          ))}
        </div>

        <h2 className="feixe-titulo">Do primeiro contato à conclusão do caso</h2>
        <ol className="etapas">
          {etapas.map((e, i) => {
            const Icone = ICONES_ETAPA[i % ICONES_ETAPA.length]
            return (
            <li key={e.titulo}>
              <span className="etapa-icone"><Icone /></span>
              <h3>{e.titulo}</h3>
              <p><Realce>{e.texto}</Realce></p>
              {i < etapas.length - 1 && <span className="etapa-seta" aria-hidden="true"><Seta width={16} height={16} /></span>}
            </li>
            )
          })}
        </ol>
      </div>
    </Pagina>
  )
}

export function NaoEncontradaPage() {
  return (
    <Pagina chamada={false} plantao={false}>
      <header className="page-header">
        <h1>Página não encontrada</h1>
        <p className="page-lead">Este endereço não existe ou mudou de lugar.</p>
      </header>
    </Pagina>
  )
}

export function ContatoPage() {
  const { perfil, contato } = useSite()
  const zap = linkWhatsApp(contato.whatsapp, contato.mensagem)

  return (
    <Pagina chamada={false}>
      <header className="page-header">
        <h1>Contato</h1>
        <p className="page-lead">
          Fale com a advogada pelo WhatsApp ou pelo Instagram.
        </p>
      </header>

      <div className="portas">
        <a className="porta porta-urgente" href={zap} target="_blank" rel="noreferrer">
          <Relogio width={28} height={28} />
          <h2>Falar com a advogada</h2>
          <p>Plantão 24h para urgências, como prisões em flagrante.</p>
          <span>Abrir o WhatsApp <Seta width={22} height={22} /></span>
        </a>
        <a className="porta" href="/diagnostico">
          <Papeis width={28} height={28} />
          <h2>Contar minha situação</h2>
          <p>Responda quatro perguntas rápidas para organizar as informações antes do contato.</p>
          <span>Começar <Seta width={22} height={22} /></span>
        </a>
      </div>

      <p className="contato-sigilo">
        Sua conversa é protegida pelo <Realce>sigilo profissional</Realce>, nos termos da lei.
      </p>

      <ul className="canais">
        {contato.telefone && (
          <li>
            <span className="canal-icone"><Telefone /></span>
            <div><strong>Telefone</strong><a href={`tel:${contato.telefone.replace(/\D/g, '')}`}>{contato.telefone}</a></div>
          </li>
        )}
        {contato.email && (
          <li>
            <span className="canal-icone"><Email /></span>
            <div><strong>E-mail</strong><a href={`mailto:${contato.email}`}>{contato.email}</a></div>
          </li>
        )}
        <li>
          <span className="canal-icone"><Instagram /></span>
          <div><strong>Instagram</strong><a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a></div>
        </li>
        <li>
          <span className="canal-icone"><Local /></span>
          <div><strong>Onde atua</strong>{perfil.local}</div>
        </li>
      </ul>
    </Pagina>
  )
}
