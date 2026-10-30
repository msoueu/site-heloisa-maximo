import './Dots.css'

const SECOES = ['Início', 'Sobre', 'Conteúdo jurídico', 'Áreas de atuação', 'Contato']

export default function Dots({ current, total, setCurrent }) {
  return (
    <div className="dots-container">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`dot ${current === i ? 'dot-active' : ''}`}
          onClick={() => setCurrent(i)}
          aria-label={`Ir para ${SECOES[i]}`}
        />
      ))}
    </div>
  )
}
