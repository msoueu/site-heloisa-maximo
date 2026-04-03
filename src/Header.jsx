import './Header.css'
import { useState, useEffect } from 'react'

export default function Header() {
    const [opacity, setOpacity] = useState(1)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const newOpacity = Math.max(0, 1 - scrollY / 400)
            setOpacity(newOpacity)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

  return (
    <div className="header-overlay">

      <div className="header-nav" style={{ opacity }}>
        <p className="header-nav-logo"></p>
        <div className="header-nav-links">
          {['Sobre', 'Atuação', 'Contato'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      <div className="header-cta">
        
            
        <a href='"https://wa.me/message/OOKYODDRW6ILK1"
                target="_blank"
                rel="noreferrer"
                className="panel-btn"'>
          AGENDAR CONSULTA
        </a>
        <p>ATENDIMENTOS E URGÊNCIAS</p>
      </div>

    </div>
  )
}