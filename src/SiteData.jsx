import { createContext, useContext, useEffect, useState } from 'react'
import { PERFIL, CONTATO, DESTAQUES, AREAS, ETAPAS, CONTEUDOS, APARENCIA, PERGUNTAS_FREQUENTES, PARCERIAS } from './data'
import { CONFIGURADO, SUPABASE_URL, SUPABASE_CHAVE } from './ambiente'

const PADRAO = {
  perfil: PERFIL,
  contato: CONTATO,
  destaques: DESTAQUES,
  areas: AREAS,
  etapas: ETAPAS,
  conteudos: CONTEUDOS,
  aparencia: APARENCIA,
  perguntas: PERGUNTAS_FREQUENTES,
  parcerias: PARCERIAS
}

export function aplicarAparencia({ fonte, titulo, tamanho, tamanhoTitulo, destaque }) {
  const raiz = document.documentElement
  raiz.style.setProperty('--pagina-fonte', `'${fonte}', sans-serif`)
  raiz.style.setProperty('--pagina-titulo', `'${titulo}', Georgia, serif`)
  raiz.style.setProperty('--pagina-tamanho', tamanho)
  raiz.style.setProperty('--pagina-tamanho-titulo', tamanhoTitulo)
  raiz.dataset.destaque = destaque
}

// Links wa.me/message/... são da conta comercial e ignoram o texto: só o número leva a mensagem
export const aceitaMensagem = (valor) => !valor.includes('wa.me/message/')

// Aceita o número com DDD ("79 99999-9999") ou um link pronto do WhatsApp
export function linkWhatsApp(valor, mensagem) {
  if (!aceitaMensagem(valor)) return valor
  const texto = `text=${encodeURIComponent(mensagem || CONTATO.mensagem)}`
  if (/^https?:\/\//.test(valor)) return `${valor}${valor.includes('?') ? '&' : '?'}${texto}`
  const digitos = valor.replace(/\D/g, '')
  return `https://wa.me/${digitos.startsWith('55') ? digitos : `55${digitos}`}?${texto}`
}

// Dentro da prévia do painel o site mostra o rascunho, que ainda não foi publicado
const rascunho = window.frameElement && window.location.search.includes('previa') ? window.parent.rascunhoDoPainel : null

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [dados, setDados] = useState(rascunho ? { ...PADRAO, ...rascunho } : PADRAO)

  useEffect(() => {
    if (!CONFIGURADO || rascunho) return
    fetch(`${SUPABASE_URL}/rest/v1/site?select=dados&id=eq.1`, { headers: { apikey: SUPABASE_CHAVE } })
      .then((resposta) => (resposta.ok ? resposta.json() : []))
      .then(([linha]) => { if (linha) setDados({ ...PADRAO, ...linha.dados }) })
      // Se o banco falhar, o site continua no ar com o conteúdo do data.js
      .catch(() => {})
  }, [])

  useEffect(() => aplicarAparencia(dados.aparencia), [dados.aparencia])

  return <SiteContext.Provider value={{ ...dados, atualizar: setDados }}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
