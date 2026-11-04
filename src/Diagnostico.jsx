import { useEffect, useRef, useState } from 'react'
import { useSite, linkWhatsApp, Texto } from './SiteData'
import { CONTATO } from './data'
import { WhatsApp, Check, Escudo, Relogio, Info } from './Icons'
import { Pagina, Realce } from './Pages'
import './Diagnostico.css'

// Os ids guardam as respostas; o texto das perguntas e das respostas vem do painel
const IDS = ['Situação', 'Quem', 'Quando', 'Advogado']

function usePerguntas() {
  const { textos } = useSite()
  return IDS.map((id, i) => ({
    id,
    texto: textos[`diag.pergunta${i + 1}`],
    opcoes: textos[`diag.opcoes${i + 1}`].split('\n').map((o) => o.trim()).filter(Boolean)
  }))
}
const ESPERA_DIGITANDO = 900

function useAnalise() {
  const PERGUNTAS = usePerguntas()
  const [respostas, setRespostas] = useState({})
  const atual = PERGUNTAS.findIndex((p) => !respostas[p.id])
  return {
    perguntas: PERGUNTAS,
    respostas,
    atual,
    completa: atual === -1,
    responder: (id, opcao) => setRespostas((r) => ({ ...r, [id]: opcao })),
    reiniciar: () => setRespostas({})
  }
}

function useLinkResumo(PERGUNTAS, respostas) {
  const { contato } = useSite()
  // Os asteriscos viram negrito no WhatsApp
  const resumo = PERGUNTAS.map((p) => `*${p.texto}*\n${respostas[p.id]}`).join('\n\n')
  const mensagem = `${contato.mensagemAnalise || CONTATO.mensagemAnalise}\n\n${resumo}`
  return linkWhatsApp(contato.whatsapp, mensagem)
}

function Hora() {
  const [hora] = useState(() => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
  return <time>{hora}</time>
}

function Balao({ minha, children }) {
  return (
    <div className={`tel-balao ${minha ? 'tel-minha' : ''}`}>
      <p>{children}</p>
      <span className="tel-hora"><Hora />{minha && <Check width={14} height={14} />}</span>
    </div>
  )
}

// Celular com a conversa: as mensagens são automáticas e isso fica dito na tela
function Celular({ analise }) {
  const { perfil, textos } = useSite()
  const PERGUNTAS = analise.perguntas
  const pergunta = PERGUNTAS[analise.atual]
  const href = useLinkResumo(PERGUNTAS, analise.respostas)
  const [digitando, setDigitando] = useState(true)
  const conversa = useRef()

  useEffect(() => {
    setDigitando(true)
    const id = setTimeout(() => setDigitando(false), ESPERA_DIGITANDO)
    return () => clearTimeout(id)
  }, [analise.atual])

  useEffect(() => {
    conversa.current.scrollTop = conversa.current.scrollHeight
  })

  const respondidas = PERGUNTAS.slice(0, analise.completa ? PERGUNTAS.length : analise.atual)
  return (
    <div className="tel">
      <div className="tel-topo">
        <img className="tel-avatar" src={perfil.fotoWhatsapp || perfil.foto} alt="" />
        <div><strong><Texto de={textos} campo="geral.marca" /></strong><small><Texto de={textos} campo="geral.area" /></small></div>
      </div>
      <div className="tel-conversa" ref={conversa} aria-live="polite">
        <p className="tel-aviso"><Texto de={textos} campo="diag.aviso" /></p>
        <Balao><Texto de={textos} campo="diag.ola" /></Balao>
        {respondidas.map((p) => (
          <div key={p.id}>
            <Balao>{p.texto}</Balao>
            <Balao minha>{analise.respostas[p.id]}</Balao>
          </div>
        ))}
        {digitando && <div className="tel-balao tel-digitando" aria-label="Digitando"><i /><i /><i /></div>}
        {!digitando && !analise.completa && <Balao>{pergunta.texto}</Balao>}
        {!digitando && analise.completa && (
          <Balao><Texto de={textos} campo="diag.fim" /></Balao>
        )}
      </div>
      <div className="tel-respostas">
        {!digitando && !analise.completa && pergunta.opcoes.map((o) => (
          <button key={o} onClick={() => analise.responder(pergunta.id, o)}>{o}</button>
        ))}
        {!digitando && analise.completa && (
          <>
            <a href={href} target="_blank" rel="noreferrer"><WhatsApp width={20} height={20} /> <Texto de={textos} campo="diag.enviar" /></a>
            <button onClick={analise.reiniciar}><Texto de={textos} campo="diag.recomecar" /></button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DiagnosticoPage() {
  const analise = useAnalise()
  const { textos } = useSite()

  return (
    <Pagina chamada={false}>
      <header className="page-header diag-topo">
        <h1><Texto de={textos} campo="diag.titulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="diag.subtitulo"><Realce>{textos['diag.subtitulo']}</Realce></Texto></p>
        <ul className="nota-selos">
          <li><Escudo /> <Texto de={textos} campo="diag.selo1" /></li>
          <li><Check /> <Texto de={textos} campo="diag.selo2" /></li>
          <li><Relogio /> <Texto de={textos} campo="diag.selo3" /></li>
        </ul>
      </header>

      <Celular analise={analise} />

      <p className="nota-legal">
        <Info /> <span><strong><Texto de={textos} campo="diag.notaRotulo" /></strong> <Texto de={textos} campo="diag.nota"><Realce>{textos['diag.nota']}</Realce></Texto></span>
      </p>
    </Pagina>
  )
}
