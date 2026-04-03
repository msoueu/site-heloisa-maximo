import './Dots.css'

export default function Dots({ current, total, setCurrent }) {
  return (
    <div className="dots-container">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`dot ${current === i ? 'dot-active' : ''}`}
          onClick={() => setCurrent(i)}
        />
      ))}
    </div>
  )
}