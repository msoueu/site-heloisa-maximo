import { useEffect, useRef, useState } from 'react'
import { useSite, linkWhatsApp } from './SiteData'
import { CONTATO } from './data'
import { WhatsApp, Check, Escudo, Relogio, Info } from './Icons'
import { Pagina } from './Pages'
import './Diagnostico.css'

const PERGUNTAS = [
  {
    id: 'Situação',
    texto: 'O que está acontecendo?',
    opcoes: ['Prisão em flagrante', 'Investigação ou inquérito', 'Processo em andamento', 'Sou vítima ou familiar de vítima', 'Cumprimento de pena', 'Outra situação']
  },
  { id: 'Quem', texto: 'Quem precisa de ajuda?', opcoes: ['Eu', 'Um familiar', 'Outra pessoa'] },
  { id: 'Quando', texto: 'Quando aconteceu?', opcoes: ['Agora ou nas últimas 24 horas', 'Nesta semana', 'Há mais tempo'] },
  { id: 'Advogado', texto: 'Já existe advogado no caso?', opcoes: ['Não', 'Sim, mas quero outra opinião', 'Não sei'] }
]
const URGENTES = ['Prisão em flagrante', 'Agora ou nas últimas 24 horas']
const ESPERA_DIGITANDO = 900

function useAnalise() {
  const [respostas, setRespostas] = useState({})
  const atual = PERGUNTAS.findIndex((p) => !respostas[p.id])
  return {
    respostas,
    atual,
    completa: atual === -1,
    urgente: Object.values(respostas).some((r) => URGENTES.includes(r)),
    responder: (id, opcao) => setRespostas((r) => ({ ...r, [id]: opcao })),
    reiniciar: () => setRespostas({})
  }
}

function useLinkResumo(respostas) {
  const { contato } = useSite()
  const resumo = PERGUNTAS.map((p) => `${p.texto} ${respostas[p.id]}`).join('\n')
  const mensagem = `${contato.mensagemAnalise || CONTATO.mensagemAnalise}\n${resumo}`
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
  const { perfil } = useSite()
  const pergunta = PERGUNTAS[analise.atual]
  const href = useLinkResumo(analise.respostas)
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
        <div><strong>Heloisa Máximo</strong><small>Advocacia Criminal</small></div>
      </div>
      <div className="tel-conversa" ref={conversa} aria-live="polite">
        <p className="tel-aviso">Mensagens automáticas</p>
        <Balao>Olá! Vou fazer quatro perguntas rápidas para a advogada entender a sua situação.</Balao>
        {respondidas.map((p) => (
          <div key={p.id}>
            <Balao>{p.texto}</Balao>
            <Balao minha>{analise.respostas[p.id]}</Balao>
          </div>
        ))}
        {digitando && <div className="tel-balao tel-digitando" aria-label="Digitando"><i /><i /><i /></div>}
        {!digitando && !analise.completa && <Balao>{pergunta.texto}</Balao>}
        {!digitando && analise.completa && (
          <Balao>
            {analise.urgente
              ? 'Sua situação pede atenção imediata. O plantão 24h atende urgências como esta.'
              : 'Pronto! Com essas respostas, a advogada já começa a conversa entendendo o seu momento.'}
          </Balao>
        )}
      </div>
      <div className="tel-respostas">
        {!digitando && !analise.completa && pergunta.opcoes.map((o) => (
          <button key={o} onClick={() => analise.responder(pergunta.id, o)}>{o}</button>
        ))}
        {!digitando && analise.completa && (
          <>
            <a href={href} target="_blank" rel="noreferrer"><WhatsApp width={20} height={20} /> {analise.urgente ? 'Falar agora' : 'Enviar para a advogada'}</a>
            <button onClick={analise.reiniciar}>Refazer a análise</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DiagnosticoPage({ abrir }) {
  const analise = useAnalise()

  return (
    <Pagina abrir={abrir} chamada={false}>
      <header className="page-header diag-topo">
        <h1>Analisar meu caso</h1>
        <p className="page-lead">
          Responda quatro perguntas rápidas para a advogada entender a sua situação. Leva menos de um minuto.
        </p>
        <ul className="nota-selos">
          <li><Escudo /> Atendimento confidencial</li>
          <li><Check /> Respostas não ficam salvas</li>
          <li><Relogio /> Menos de um minuto</li>
        </ul>
      </header>

      <Celular analise={analise} />

      <p className="nota-legal">
        <Info /> <span><strong>Importante:</strong> esta análise só organiza as informações para a conversa. Ela <strong>não é consulta jurídica</strong>, não avalia o seu caso e <strong>não indica resultado</strong>.</span>
      </p>
    </Pagina>
  )
}
