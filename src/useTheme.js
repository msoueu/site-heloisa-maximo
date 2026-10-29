import { useState, useEffect } from 'react'

const KEY = 'hm-tema'

// Com cookies bloqueados, acessar localStorage lança erro; nesse caso o tema não é salvo
const armazenamento = navigator.cookieEnabled ? window.localStorage : null

function temaInicial() {
  return armazenamento?.getItem(KEY) === 'escuro' ? 'escuro' : 'claro'
}

export default function useTheme() {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    armazenamento?.setItem(KEY, tema)
  }, [tema])

  const alternar = () => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'))
  return [tema, alternar]
}
