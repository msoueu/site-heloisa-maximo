import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PERFIL, CONTATO, DESTAQUES, AREAS, ETAPAS, CONTEUDOS, APARENCIA, PERGUNTAS_FREQUENTES, MENU, TEXTOS } from './data'
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
  menu: MENU,
  textos: TEXTOS
}

// Os textos salvos completam os padrões, para que um texto novo no código apareça mesmo com dados antigos
const juntar = (dados) => ({ ...PADRAO, ...dados, textos: { ...TEXTOS, ...dados.textos } })

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

const VARS_DESTAQUE = {
  negrito: { '--realce-cor': '#fff', '--realce-peso': '700', '--texto-cor': 'var(--muted)' },
  dourado: { '--realce-cor': 'var(--gold-bright)', '--realce-peso': '700' },
  marca: { '--realce-peso': '700', '--realce-fundo': 'linear-gradient(transparent 68%, rgba(230, 207, 159, 0.38) 68%)' },
  nenhum: {}
}

// As variáveis de CSS de uma escolha de letras; valem no site todo (na raiz) ou numa parte só
export function varsDaAparencia({ fonte, titulo, tamanho, tamanhoTitulo, destaque }) {
  return {
    '--pagina-fonte': `'${fonte}', sans-serif`,
    '--pagina-titulo': `'${titulo}', Georgia, serif`,
    // --sans e --serif levam a mesma letra para a página inicial, o menu e o rodapé
    '--sans': `'${fonte}', -apple-system, 'Segoe UI', Roboto, sans-serif`,
    '--serif': `'${titulo}', Georgia, 'Times New Roman', serif`,
    '--pagina-tamanho': String(tamanho),
    '--pagina-tamanho-titulo': String(tamanhoTitulo),
    // initial descarta o destaque herdado de fora, e o CSS volta ao padrão do var()
    '--realce-cor': 'initial',
    '--realce-peso': 'initial',
    '--realce-fundo': 'initial',
    '--texto-cor': 'initial',
    ...VARS_DESTAQUE[destaque]
  }
}

export function aplicarAparencia(aparencia) {
  carregarFonte(aparencia.fonte)
  carregarFonte(aparencia.titulo)
  Object.entries(varsDaAparencia(aparencia)).forEach(([nome, valor]) => document.documentElement.style.setProperty(nome, valor))
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

// Formato escolhido na barra de um campo do painel: { fonte, tamanho, negrito, italico, sublinhado, linha }
export function estiloCss(formato) {
  if (!formato) return undefined
  const css = {}
  if (formato.fonte && nomeDeFonteValido(formato.fonte)) css.fontFamily = `'${formato.fonte}', var(--sans)`
  const tamanho = Number(formato.tamanho)
  // em: relativo ao tamanho que o texto já tem ali, seja título ou parágrafo
  if (tamanho >= 0.5 && tamanho <= 3 && tamanho !== 1) css.fontSize = `${tamanho}em`
  if (formato.negrito) css.fontWeight = 700
  if (formato.italico) css.fontStyle = 'italic'
  if (formato.sublinhado) css.textDecoration = 'underline'
  // Na linha de baixo: o texto sai da linha do que vem antes e fica embaixo dele
  if (formato.linha === 'embaixo') css.display = 'block'
  return Object.keys(css).length ? css : undefined
}

// Um texto do painel com o formato do campo dele. Ex.: <Texto de={area} campo="titulo" />
export function Texto({ de, campo, children = de?.[campo] }) {
  const formato = de?.estilos?.[campo]
  const fonte = formato?.fonte
  useEffect(() => { if (fonte) carregarFonte(fonte) }, [fonte])
  // Quebra de linha feita no editor aparece no site
  const quebra = typeof de?.[campo] === 'string' && de[campo].includes('\n')
  const css = quebra ? { ...estiloCss(formato), whiteSpace: 'pre-line' } : estiloCss(formato)
  if (EDITANDO) return <TextoEditavel de={de} campo={campo} css={css}>{children}</TextoEditavel>
  return css ? <span style={css}>{children}</span> : children
}

// Dentro da prévia do painel o site mostra o rascunho, que ainda não foi publicado
const rascunho = window.frameElement && window.location.search.includes('previa') ? window.parent.rascunhoDoPainel : null

// Com &editar na prévia, cada texto vira um campo: clicou, escreveu, o painel recebe
const EDITANDO = !!rascunho && window.location.search.includes('editar')
export const CHAVES_DO_SITE = Object.keys(PADRAO)

// Onde um objeto está nos dados: ['perfil'] ou ['areas', 2]
function caminhoDe(dados, objeto) {
  for (const chave of CHAVES_DO_SITE) {
    const valor = dados[chave]
    if (valor === objeto) return [chave]
    if (Array.isArray(valor) && valor.includes(objeto)) return [chave, valor.indexOf(objeto)]
  }
  return null
}

// Troca um valor dentro dos dados sem mexer no original: definir(d, ['areas', 2, 'titulo'], 'Novo')
export function definir(dados, [chave, ...resto], valor) {
  const copia = Array.isArray(dados) ? [...dados] : { ...dados }
  copia[chave] = resto.length ? definir(dados?.[chave] ?? {}, resto, valor) : valor
  return copia
}

const LETRAS_EDITOR = ['Source Sans 3', 'Lato', 'Nunito Sans', 'Atkinson Hyperlegible', 'Georgia', 'EB Garamond', 'Libre Baskerville', 'Lora']
const TAMANHOS_EDITOR = [['0.85', 'Menor'], ['1', 'Normal'], ['1.15', 'Maior'], ['1.3', 'Bem maior'], ['1.5', 'Muito maior']]
const MARCAS_EDITOR = [['negrito', 'N', 'Negrito'], ['italico', 'I', 'Itálico'], ['sublinhado', 'S', 'Sublinhado']]
// Botão da barra não tira o cursor do texto
const manterFoco = (e) => e.preventDefault()

function TextoEditavel({ de, campo, css, children }) {
  const site = useSite()
  const [ativo, setAtivo] = useState(false)
  const [posicao, setPosicao] = useState(null)
  const ref = useRef()
  const barra = useRef()
  const original = de?.[campo]
  const caminho = caminhoDe(site, de)
  // Só texto simples que aparece inteiro; parágrafos cortados de um texto maior ficam no painel
  const inteiro = children === original || children?.props?.children === original

  useEffect(() => {
    if (!ativo) return
    ref.current?.focus()
    const medir = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r) setPosicao({ top: Math.max(8, r.top - 52), left: Math.max(8, Math.min(r.left, window.innerWidth - 440)) })
    }
    medir()
    window.addEventListener('scroll', medir, true)
    window.addEventListener('resize', medir)
    return () => {
      window.removeEventListener('scroll', medir, true)
      window.removeEventListener('resize', medir)
    }
  }, [ativo])

  if (!caminho || typeof original !== 'string' || !inteiro) return css ? <span style={css}>{children}</span> : children

  const enviar = (onde, valor) => {
    site.atualizar((d) => definir(d, onde, valor))
    window.parent.postMessage({ tipo: 'editar-texto', caminho: onde, valor }, window.location.origin)
  }
  const formato = de.estilos?.[campo] || {}
  const formatar = (chave, valor) => {
    enviar([...caminho, 'estilos', campo], { ...formato, [chave]: valor })
    if (chave === 'fonte' && valor) carregarFonte(valor)
    ref.current?.focus()
  }
  const salvar = () => {
    const valor = ref.current.innerText.replace(/\n{3,}/g, '\n\n').trim()
    setAtivo(false)
    setPosicao(null)
    if (valor !== original) enviar([...caminho, campo], valor)
  }
  // Sai da edição só quando o foco deixa o texto e a barra
  const sair = (e) => {
    const para = e.relatedTarget
    if (para && (ref.current?.contains(para) || barra.current?.contains(para))) return
    salvar()
  }
  const tecla = (e) => {
    if (e.key === 'Escape') { ref.current.innerText = original; ref.current.blur() }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ref.current.blur() }
  }

  if (!ativo) {
    return (
      <texto-editavel key="parado" class={original ? undefined : 'is-vazio'} style={css} title="Clique para editar" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAtivo(true) }}>
        {original ? children : 'Clique para escrever'}
      </texto-editavel>
    )
  }

  // Tag própria, e não span: regras como ".sinal-relogio span" do site não pegam nela.
  // key troca o elemento ao entrar e sair da edição, para o React não brigar com o texto digitado
  return (
    <>
      <texto-editavel key="editando" ref={ref} class="is-ativo" style={css} contentEditable="true" suppressContentEditableWarning onBlur={sair} onKeyDown={tecla}>{original}</texto-editavel>
      {posicao && createPortal(
        <div ref={barra} className="editor-barra" style={posicao} onBlur={sair} onClick={(e) => e.stopPropagation()}>
          <select value={formato.fonte || ''} onChange={(e) => formatar('fonte', e.target.value)} aria-label="Tipo de letra">
            <option value="">Letra do site</option>
            {LETRAS_EDITOR.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
          </select>
          <select value={String(formato.tamanho || 1)} onChange={(e) => formatar('tamanho', Number(e.target.value))} aria-label="Tamanho">
            {TAMANHOS_EDITOR.map(([v, nome]) => <option key={v} value={v}>{nome}</option>)}
          </select>
          {MARCAS_EDITOR.map(([chave, letra, nome]) => (
            <button key={chave} type="button" className={`editor-${chave}`} aria-pressed={!!formato[chave]} title={nome} aria-label={nome} onMouseDown={manterFoco} onClick={() => formatar(chave, !formato[chave])}>{letra}</button>
          ))}
          <span className="editor-divisor" />
          <button type="button" title="Quebrar a linha onde está o cursor (Shift+Enter)" onMouseDown={manterFoco} onClick={() => document.execCommand('insertLineBreak')}>↵ Quebrar linha</button>
          <button type="button" aria-pressed={formato.linha === 'embaixo'} title="Começar este texto na linha de baixo" onMouseDown={manterFoco} onClick={() => formatar('linha', formato.linha === 'embaixo' ? '' : 'embaixo')}>Linha própria</button>
        </div>,
        document.body
      )}
    </>
  )
}

if (EDITANDO) {
  // Clicar num texto dentro de um link edita, não navega; para trocar de página use o seletor do painel
  document.addEventListener('click', (e) => { if (e.target.closest('a')) e.preventDefault() }, true)
  document.documentElement.classList.add('modo-editar')
}

const SiteContext = createContext(null)

// O site só aparece depois de ler o painel, para não mostrar por um instante o que ela já apagou.
// shortcut: se o banco passar de 3 s, abre com o data.js e troca quando ele responder
export function buscarDados() {
  if (rascunho || !CONFIGURADO) return { inicial: Promise.resolve(rascunho ? juntar(rascunho) : PADRAO) }
  const banco = fetch(`${SUPABASE_URL}/rest/v1/site?select=dados&id=eq.1`, { headers: { apikey: SUPABASE_CHAVE } })
    .then((resposta) => (resposta.ok ? resposta.json() : []))
    .then(([linha]) => (linha ? juntar(linha.dados) : PADRAO))
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
