import './SectionContent.css'
import { useEffect } from 'react'

const sections = [
  {
    tag: 'ADVOCACIA CRIMINAL',
    titulo: 'Heloisa Máximo',
    desc: 'Defesa técnica, humanizada e combativa.',
    sub: 'Direito Penal e Processual Penal · Atuação Nacional',
    tipo: 'intro'
  },
  {
    tag: 'SOBRE',
    titulo: 'Advogada Criminalista',
    desc: 'Atendimento com hora marcada e atendimento 24hrs para URGÊNCIAS.',
    tipo: 'foto'
  },
  {
    tag: 'CONTEÚDO JURÍDICO',
    titulo: 'Achado não é roubado?',
    video: 'https://www.instagram.com/reel/DUTPKnMDK1c/',
    tipo: 'video'
  },
  {
    tag: 'CONTEÚDO JURÍDICO',
    titulo: 'O nome disso não é favor, é Lavagem de Dinheiro',
    video: 'https://www.instagram.com/reel/DUirkLZgFJU/',
    tipo: 'video'
  },
  {
    tag: 'CONTATO',
    titulo: 'Pronto para defender você',
    desc: 'Defesa técnica, humanizada e combativa.\nDireito Penal e Processual Penal · Atuação Nacional',
    tipo: 'cta'
  }
]
export default function SectionContent({ current }) {
  useEffect(() => {
    if (window.instgrm) window.instgrm.Embeds.process()
  }, [current])

  return (
    <div className="section-content">
      {sections.map((s, i) => (
        <div
          key={i}
          className={`section-panel ${current === i ? 'panel-active' : 'panel-hidden'}`}
        >
          <p className="panel-tag">{s.tag}</p>

          {s.tipo === 'intro' && (
            <div className="painel-intro">
              <h1 className="panel-name">{s.titulo}</h1>
              <div className="panel-divider" />
              <p className="panel-desc">{s.desc}</p>
              <p className="panel-sub">{s.sub}</p>
            </div>
          )}

          {s.tipo === 'foto' && (
            <>
              <h2 className="panel-titulo">{s.titulo}</h2>
              <div className="panel-divider" />
              <img
                src="/heloisa.webp"
                alt="Heloisa Máximo"
                className="panel-foto"
              />
              <p className="panel-desc">{s.desc}</p>
              
            </>
          )}

          {s.tipo === 'video' && (
            <>
              <h2 className="panel-titulo">{s.titulo}</h2>
              <div className="panel-divider" />
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={s.video}
                data-instgrm-version="14"
              ></blockquote>
              <script async src="https://www.instagram.com/embed.js"></script>
            </>
          )}

          {s.tipo === 'cta' && (
            <>
              <h2 className="panel-name">{s.titulo}</h2>
              <div className="panel-divider" />
              <p className="panel-desc">{s.desc}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}