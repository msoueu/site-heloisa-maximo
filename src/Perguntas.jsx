import { useState } from 'react'
import { useSite, linkWhatsApp } from './SiteData'
import { Baixo } from './Icons'
import { Pagina, Realce } from './Pages'
import './Perguntas.css'

export default function PerguntasPage({ abrir }) {
  const { perguntas, contato, perfil } = useSite()
  const [aberta, setAberta] = useState(0)

  return (
    <Pagina abrir={abrir} chamada={false}>
      <header className="page-header">
        <h1>Perguntas frequentes</h1>
        <p className="page-lead">
          Respostas gerais para as dúvidas mais comuns. Cada caso é único e precisa ser avaliado individualmente.
        </p>
      </header>

      <div className="fq-sanfona">
        {perguntas.map((p, i) => (
          <div key={p.titulo} className={aberta === i ? 'fq-aberta' : ''}>
            <h2>
              <button aria-expanded={aberta === i} onClick={() => setAberta(aberta === i ? -1 : i)}>
                {p.titulo} <Baixo width={24} height={24} />
              </button>
            </h2>
            {aberta === i && <p><Realce>{p.texto}</Realce></p>}
          </div>
        ))}
      </div>

      <section className="fq-pessoa">
        <img src={perfil.foto} alt={`Retrato de ${perfil.nome}`} loading="lazy" decoding="async" />
        <div>
          <h2>Não encontrou a sua dúvida?</h2>
          <p>
            <a href="/diagnostico">Analisar meu caso</a>
            <a href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer">Falar com a advogada</a>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
