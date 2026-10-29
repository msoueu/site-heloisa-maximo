import './Dots.css'

export default function Dots({ current, total, setCurrent }) {
  return (
    <div className="dots-container">
      <span className="dots-count">{String(current + 1).padStart(2, '0')}</span>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`dot ${current === i ? 'dot-active' : ''}`}
          onClick={() => setCurrent(i)}
          aria-label={`Seção ${i + 1}`}
        />
      ))}
      <span className="dots-total">{String(total).padStart(2, '0')}</span>
    </div>
  )
}
