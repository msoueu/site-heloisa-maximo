import { createContext, useContext, useEffect, useState } from 'react'
import { PERFIL, CONTATO, DESTAQUES, AREAS, ETAPAS, CONTEUDOS, APARENCIA, PERGUNTAS_FREQUENTES, MENU } from './data'
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
  menu: MENU
}

// Nome vazio no painel volta ao padrão, para o link nunca sumir do menu
export const nomesDoMenu = (menu) =>
  Object.keys(MENU).map((pagina) => ({ pagina, label: menu?.[pagina]?.trim() || MENU[pagina] }))

const PESOS_FONTE = {
  'Source Sans 3': '400;700',
  'Lato': '400;700',
  'Nunito Sans': '400;700',
  'Atkinson Hyperlegible': '400;700',
  'EB Garamond': '400;500',
  'Libre Baskerville': '400;700',
  'Lora': '400;500'
}

// O nome vai para uma URL e para o CSS: só letras, números e espaços
export const nomeDeFonteValido = (nome) => /^[A-Za-z0-9 ]{2,40}$/.test(nome)

// Baixa só a letra em uso; Georgia já vem no aparelho
export function carregarFonte(nome) {
  const id = `fonte-${nome}`
  if (nome === 'Georgia' || !nomeDeFonteValido(nome) || document.getElementById(id)) return
  const familia = `https://fonts.googleapis.com/css2?family=${nome.replace(/ /g, '+')}`
  const link = Object.assign(document.createElement('link'), {
    id,
    rel: 'stylesheet',
    href: `${familia}:wght@${PESOS_FONTE[nome] || '400;700'}&display=swap`
  })
  // Letra do Google Fonts sem o peso 700: carrega só a normal, e o negrito fica por conta do navegador
  link.onerror = () => { link.onerror = null; link.href = `${familia}&display=swap` }
  document.head.append(link)
}

export function aplicarAparencia({ fonte, titulo, tamanho, tamanhoTitulo, destaque }) {
  carregarFonte(fonte)
  carregarFonte(titulo)
  const raiz = document.documentElement
  raiz.style.setProperty('--pagina-fonte', `'${fonte}', sans-serif`)
  raiz.style.setProperty('--pagina-titulo', `'${titulo}', Georgia, serif`)
  // --sans e --serif levam a mesma letra para a página inicial, o menu e o rodapé
  raiz.style.setProperty('--sans', `'${fonte}', -apple-system, 'Segoe UI', Roboto, sans-serif`)
  raiz.style.setProperty('--serif', `'${titulo}', Georgia, 'Times New Roman', serif`)
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

// O site só aparece depois de ler o painel, para não mostrar por um instante o que ela já apagou.
// shortcut: se o banco passar de 3 s, abre com o data.js e troca quando ele responder
export function buscarDados() {
  if (rascunho || !CONFIGURADO) return { inicial: Promise.resolve(rascunho ? { ...PADRAO, ...rascunho } : PADRAO) }
  const banco = fetch(`${SUPABASE_URL}/rest/v1/site?select=dados&id=eq.1`, { headers: { apikey: SUPABASE_CHAVE } })
    .then((resposta) => (resposta.ok ? resposta.json() : []))
    .then(([linha]) => (linha ? { ...PADRAO, ...linha.dados } : PADRAO))
    // Se o banco falhar, o site continua no ar com o conteúdo do data.js
    .catch(() => PADRAO)
  const limite = new Promise((resolver) => setTimeout(() => resolver(PADRAO), 3000))
  return { inicial: Promise.race([banco, limite]), banco }
}

export function SiteProvider({ inicial, banco, children }) {
  const [dados, setDados] = useState(inicial)

  useEffect(() => { banco?.then(setDados) }, [banco])

  useEffect(() => aplicarAparencia(dados.aparencia), [dados.aparencia])

  return <SiteContext.Provider value={{ ...dados, atualizar: setDados }}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
