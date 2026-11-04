import { useState } from 'react'
import { useSite, linkWhatsApp, Texto } from './SiteData'
import { Baixo } from './Icons'
import { Pagina, Realce } from './Pages'
import './Perguntas.css'

export default function PerguntasPage() {
  const { perguntas, contato, perfil, textos } = useSite()
  const [aberta, setAberta] = useState(0)

  return (
    <Pagina chamada={false}>
      <header className="page-header">
        <h1><Texto de={textos} campo="perguntas.titulo" /></h1>
        <p className="page-lead"><Texto de={textos} campo="perguntas.subtitulo"><Realce>{textos['perguntas.subtitulo']}</Realce></Texto></p>
      </header>

      <div className="fq-sanfona">
        {perguntas.map((p, i) => (
          <div key={i} className={aberta === i ? 'fq-aberta' : ''}>
            <h2>
              <button aria-expanded={aberta === i} onClick={() => setAberta(aberta === i ? -1 : i)}>
                <Texto de={p} campo="titulo" /> <Baixo width={24} height={24} />
              </button>
            </h2>
            {aberta === i && <p><Texto de={p} campo="texto"><Realce>{p.texto}</Realce></Texto></p>}
          </div>
        ))}
      </div>

      <section className="fq-pessoa">
        <img src={perfil.foto} alt={`Retrato de ${perfil.nome}`} loading="lazy" decoding="async" />
        <div>
          <h2><Texto de={textos} campo="perguntas.naoEncontrou" /></h2>
          <p>
            <a href="/diagnostico"><Texto de={textos} campo="perguntas.linkSituacao" /></a>
            <a href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer"><Texto de={textos} campo="perguntas.linkWhatsApp" /></a>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
