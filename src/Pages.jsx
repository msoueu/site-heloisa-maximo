import { useEffect, useRef, useState } from 'react'
import { DEV } from './data'
import { useSite, linkWhatsApp, nomesDoMenu, Texto } from './SiteData'
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
  const { textos } = useSite()
  const [agora, setAgora] = useState(() => FORMATO_HORA.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setAgora(FORMATO_HORA.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="sinal-relogio"><span /> <Texto de={textos} campo="geral.relogio" /> {agora}</p>
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
  const { contato, textos } = useSite()
  return (
    <a href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer" className="page-botao">
      <WhatsApp width={22} height={22} /> <Texto de={textos} campo="geral.botaoWhatsApp" />
    </a>
  )
}

function Rodape() {
  const { perfil, contato, menu, textos } = useSite()
  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-marca">
          <span className="page-footer-monograma" />
          <div>
            <p className="page-footer-name"><Texto de={perfil} campo="nome" /></p>
            <p className="page-footer-area"><Texto de={textos} campo="geral.area" /></p>
            {perfil.oab && <p><Texto de={perfil} campo="oab" /></p>}
          </div>
        </div>
        <ul>
          <li><Relogio /> <Texto de={textos} campo="geral.selo1" /></li>
          <li><Local /> <Texto de={perfil} campo="local" /></li>
          <li><Instagram /><a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a></li>
        </ul>
        <nav className="page-footer-links" aria-label="Páginas do site">
          {nomesDoMenu(menu).map(({ pagina, label }) => <a key={pagina} href={`/${pagina}`}>{label}</a>)}
        </nav>
      </div>
      <div className="page-footer-base">
        <nav aria-label="Informações legais">
          <a href="/privacidade"><Texto de={textos} campo="geral.privacidade" /></a>
          <a href="/termos"><Texto de={textos} campo="geral.termos" /></a>
        </nav>
        <p>© {new Date().getFullYear()} {perfil.nome}. <Texto de={textos} campo="geral.direitos" />{perfil.oab && ` ${perfil.oab}.`}</p>
        <p><Texto de={textos} campo="geral.informativo" /></p>
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
  const { textos } = useSite()
  return (
    <main className="page" id="conteudo" tabIndex={-1}>
      <div className="page-inner">
        <a className="page-back" href="/">
          <Voltar width={18} height={18} /> <Texto de={textos} campo="geral.voltar" />
        </a>
        {plantao && <Horario />}
        {children}
      </div>
      {chamada && (
        <section className="page-chamada">
          <div>
            <h2><Texto de={textos} campo="geral.chamadaTitulo" /></h2>
            <p><Texto de={textos} campo="geral.chamadaTexto" /></p>
          </div>
          <BotaoWhatsApp />
        </section>
      )}
      <Rodape />
    </main>
  )
}

export function SobrePage() {
  const { perfil, destaques, textos } = useSite()
  const raiz = useSinal()

  return (
    <Pagina>
      <div ref={raiz}>
        <header className="sinal sinal-topo">
          <div>
            <h1><Texto de={perfil} campo="nome" /></h1>
            <p className="page-lead"><Texto de={perfil} campo="titulo" /><Texto de={textos} campo="sobre.ligacao" /> <Texto de={perfil} campo="especialidade" />.</p>
            <p className="page-slogan"><Texto de={perfil} campo="slogan" /></p>
            {(perfil.oab || perfil.formacao) && (
              <p>
                {perfil.oab && <Texto de={perfil} campo="oab" />}
                {perfil.oab && perfil.formacao && ' · '}
                {perfil.formacao && <Texto de={perfil} campo="formacao" />}
              </p>
            )}
          </div>
          <img src={perfil.foto} alt={`Retrato de ${perfil.nome}`} />
        </header>

        <section className="sinal sinal-linha">
          <h2><Texto de={textos} campo="sobre.tituloTrajetoria" /></h2>
          <div className="page-texto">
            {paragrafos(textos['sobre.trajetoria']).map((p, i) => <p key={i}><Texto de={textos} campo="sobre.trajetoria"><Realce>{p}</Realce></Texto></p>)}
          </div>
        </section>

        <section className="sinal sinal-linha">
          <h2><Texto de={textos} campo="sobre.tituloConviccao" /></h2>
          <blockquote className="page-citacao">
            <p><Texto de={textos} campo="sobre.citacao" /></p>
            <cite>
              <Texto de={perfil} campo="nome" />, em{' '}
              <a href="/conteudo/carcere-de-frente"><Texto de={textos} campo="sobre.citacaoFonte" /></a>
            </cite>
          </blockquote>
        </section>

        {destaques.map((d, i) => (
          <section className="sinal sinal-linha" key={i}>
            <h2><Texto de={d} campo="titulo" /></h2>
            <p><Texto de={d} campo="texto"><Realce>{d.texto}</Realce></Texto></p>
          </section>
        ))}

        <a className="page-seguir" href="/atuacao">
          <Texto de={textos} campo="sobre.linkAtuacao" /> <Seta width={20} height={20} />
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

// Linha em branco separa parágrafos nos textos longos do painel
export const paragrafos = (texto = '') => texto.split(/\n\s*\n/).filter((p) => p.trim())

const comMouse = window.matchMedia('(hover: hover)').matches

export function ConteudoPage() {
  const { conteudos, textos } = useSite()
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
        <h1><Texto de={textos} campo="conteudo.titulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="conteudo.subtitulo"><Realce>{textos['conteudo.subtitulo']}</Realce></Texto></p>
      </header>

      {c && (
        <div className="indice">
          <div className="indice-lista">
            {/* No celular a publicação aberta fica no topo e esta lista mostra só as outras */}
            {conteudos.length > 1 && <p className="indice-rotulo"><Texto de={textos} campo="conteudo.outras" /></p>}
            {conteudos.map((item) => (
              <button
                key={item.id}
                aria-pressed={item.id === c.id}
                onClick={() => escolher(item.id)}
                // Só com mouse: no celular o toque escolheria antes do clique e o cartão sumiria
                onMouseEnter={() => comMouse && setAtivo(item.id)}
              >
                {(item.imagem || item.poster) && <img className="indice-capa" src={item.imagem || item.poster} alt="" loading="lazy" />}
                <span className="indice-cartao">
                  <span className="indice-meta"><Texto de={item} campo="categoria" />{item.data && item.estilos?.data?.linha !== 'embaixo' && ', '}<Texto de={item} campo="data" /></span>
                  <Texto de={item} campo="titulo" />
                </span>
              </button>
            ))}
          </div>
          <article className="indice-leitor" ref={leitor} key={c.id}>
            <header className="indice-leitor-topo">
              <p className="indice-rotulo">{c.id === conteudos[0].id ? <Texto de={textos} campo="conteudo.maisRecente" /> : <><Texto de={c} campo="categoria" />{c.data && c.estilos?.data?.linha !== 'embaixo' && ', '}<Texto de={c} campo="data" /></>}</p>
              <h2><Texto de={c} campo="titulo" /></h2>
            </header>
            <Midia c={c} />
            <div className="page-texto">
              {(c.texto || [c.resumo]).map((p, i) => <p key={i}><Texto de={c} campo={c.texto ? 'texto' : 'resumo'}><Realce>{p}</Realce></Texto></p>)}
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
  const { areas, etapas, textos } = useSite()
  const raiz = useFeixe()

  return (
    <Pagina>
      <header className="page-header">
        <h1><Texto de={textos} campo="atuacao.titulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="atuacao.subtitulo"><Realce>{textos['atuacao.subtitulo']}</Realce></Texto></p>
      </header>

      <div ref={raiz}>
        <div className="feixe-grade">
          {areas.map((a, i) => (
            <article className="feixe-bloco" key={i}>
              <h2><Texto de={a} campo="titulo" /></h2>
              <p><Texto de={a} campo="texto"><Realce>{a.texto}</Realce></Texto></p>
            </article>
          ))}
        </div>

        <h2 className="feixe-titulo"><Texto de={textos} campo="atuacao.tituloEtapas" /></h2>
        <ol className="etapas">
          {etapas.map((e, i) => {
            const Icone = ICONES_ETAPA[i % ICONES_ETAPA.length]
            return (
            <li key={i}>
              <span className="etapa-icone"><Icone /></span>
              <h3><Texto de={e} campo="titulo" /></h3>
              <p><Texto de={e} campo="texto"><Realce>{e.texto}</Realce></Texto></p>
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
  const { textos } = useSite()
  return (
    <Pagina chamada={false} plantao={false}>
      <header className="page-header">
        <h1><Texto de={textos} campo="geral.naoEncontradaTitulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="geral.naoEncontradaTexto" /></p>
      </header>
    </Pagina>
  )
}

export function ContatoPage() {
  const { perfil, contato, textos } = useSite()
  const zap = linkWhatsApp(contato.whatsapp, contato.mensagem)

  return (
    <Pagina chamada={false}>
      <header className="page-header">
        <h1><Texto de={textos} campo="contato.titulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="contato.subtitulo"><Realce>{textos['contato.subtitulo']}</Realce></Texto></p>
      </header>

      <div className="portas">
        <a className="porta porta-urgente" href={zap} target="_blank" rel="noreferrer">
          <Relogio width={28} height={28} />
          <h2><Texto de={textos} campo="contato.porta1Titulo" /></h2>
          <p><Texto de={textos} campo="contato.porta1Texto" /></p>
          <span><Texto de={textos} campo="contato.porta1Acao" /> <Seta width={22} height={22} /></span>
        </a>
        <a className="porta" href="/diagnostico">
          <Papeis width={28} height={28} />
          <h2><Texto de={textos} campo="contato.porta2Titulo" /></h2>
          <p><Texto de={textos} campo="contato.porta2Texto" /></p>
          <span><Texto de={textos} campo="contato.porta2Acao" /> <Seta width={22} height={22} /></span>
        </a>
      </div>

      <p className="contato-sigilo">
        <Texto de={textos} campo="contato.sigilo"><Realce>{textos['contato.sigilo']}</Realce></Texto>
      </p>

      <ul className="canais">
        {contato.telefone && (
          <li>
            <span className="canal-icone"><Telefone /></span>
            <div><strong><Texto de={textos} campo="contato.rotuloTelefone" /></strong><a href={`tel:${contato.telefone.replace(/\D/g, '')}`}>{contato.telefone}</a></div>
          </li>
        )}
        {contato.email && (
          <li>
            <span className="canal-icone"><Email /></span>
            <div><strong><Texto de={textos} campo="contato.rotuloEmail" /></strong><a href={`mailto:${contato.email}`}>{contato.email}</a></div>
          </li>
        )}
        <li>
          <span className="canal-icone"><Instagram /></span>
          <div><strong><Texto de={textos} campo="contato.rotuloInstagram" /></strong><a href={contato.instagram} target="_blank" rel="noreferrer">{contato.instagramUser}</a></div>
        </li>
        <li>
          <span className="canal-icone"><Local /></span>
          <div><strong><Texto de={textos} campo="contato.rotuloLocal" /></strong><Texto de={perfil} campo="local" /></div>
        </li>
      </ul>
    </Pagina>
  )
}
