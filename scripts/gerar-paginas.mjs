// Depois do build, grava um HTML por página com título, canônica e texto próprios,
// para quem não executa JavaScript. O React substitui esse conteúdo ao carregar.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = join(RAIZ, 'build')
const SITE = 'https://advheloisamaximo.vercel.app'

// src/ é ESM num pacote CommonJS: a URL data: evita configurar o Node
const carregar = (arquivo) => {
  const fonte = readFileSync(join(RAIZ, 'src', arquivo), 'utf8')
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(fonte)}`)
}

async function lerPainel() {
  const url = process.env.REACT_APP_SUPABASE_URL
  const chave = process.env.REACT_APP_SUPABASE_ANON_KEY
  if (!url || !chave) return {}
  try {
    const resposta = await fetch(`${url}/rest/v1/site?select=dados&id=eq.1`, { headers: { apikey: chave } })
    const [linha] = resposta.ok ? await resposta.json() : []
    return linha?.dados ?? {}
  } catch {
    // Igual ao site: se o banco falhar, vale o conteúdo do data.js
    return {}
  }
}

const esc = (texto) => String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inline = (texto) => esc(texto)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

function bloco(texto) {
  const linhas = texto.split('\n')
  const titulo = texto.match(/^(#{1,3}) (.*)/)
  if (titulo) return `<h${titulo[1].length}>${esc(titulo[2])}</h${titulo[1].length}>`
  if (texto.startsWith('- ')) return `<ul>${linhas.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`
  if (/^1\. /.test(texto)) return `<ol>${linhas.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`
  return `<p>${linhas.map((l) => inline(l.trim())).join('<br>')}</p>`
}

const paragrafos = (lista) => lista.map((p) => `<p>${esc(p)}</p>`).join('')
const itens = (lista) => lista.map((i) => `<h2>${esc(i.titulo)}</h2><p>${esc(i.texto)}</p>`).join('')
const cabecalho = (titulo, lead) => `<h1>${esc(titulo)}</h1><p>${esc(lead)}</p>`

function montarPaginas(site, preencher, { PRIVACIDADE, TERMOS }, TRAJETORIA) {
  const { perfil, contato, destaques, areas, etapas, conteudos, perguntas } = site
  const lista = conteudos.map((c) => `<li><a href="/conteudo/${esc(c.id)}">${esc(c.titulo)}</a></li>`).join('')
  const legal = (texto) => preencher(texto, perfil.oab).split('\n\n').map(bloco).join('')

  const paginas = [
    {
      caminho: '/',
      rota: 'home',
      corpo: cabecalho(perfil.nome, `${perfil.titulo}. ${perfil.especialidade}. ${perfil.local}.`) + itens(destaques) + itens(areas) + `<ul>${lista}</ul>`
    },
    {
      caminho: '/sobre',
      rota: 'sobre',
      corpo: cabecalho(perfil.nome, `${perfil.titulo}, com atuação em ${perfil.especialidade}.`) + `<p>${esc(perfil.oab)}</p>` + paragrafos(TRAJETORIA) + itens(destaques)
    },
    {
      caminho: '/conteudo',
      rota: 'conteudo',
      corpo: cabecalho('Direito e reflexões', 'Palestras e explicações sobre Direito Penal em linguagem acessível.') + `<ul>${lista}</ul>`
    },
    {
      caminho: '/atuacao',
      rota: 'atuacao',
      corpo: cabecalho('Defesa em todas as fases do processo penal', 'Atuação exclusiva na área criminal, do inquérito aos tribunais.') + itens(areas) + itens(etapas)
    },
    {
      caminho: '/contato',
      rota: 'contato',
      corpo: cabecalho('Contato', 'Fale com a advogada pelo WhatsApp ou pelo Instagram.') +
        `<p>WhatsApp: ${esc(contato.whatsapp)}</p><p>Instagram: <a href="${esc(contato.instagram)}">${esc(contato.instagramUser)}</a></p><p>${esc(perfil.local)}</p>`
    },
    {
      caminho: '/diagnostico',
      rota: 'diagnostico',
      corpo: cabecalho('Conte sua situação', 'Responda quatro perguntas rápidas para organizar as informações antes do contato.')
    },
    {
      caminho: '/perguntas',
      rota: 'perguntas',
      corpo: cabecalho('Perguntas frequentes', 'Respostas gerais para as dúvidas mais comuns. Cada caso é único e precisa ser avaliado individualmente.') + itens(perguntas)
    },
    { caminho: '/privacidade', rota: 'privacidade', corpo: legal(PRIVACIDADE) },
    { caminho: '/termos', rota: 'termos', corpo: legal(TERMOS) },
    ...conteudos.map((c) => ({
      caminho: `/conteudo/${c.id}`,
      rota: 'conteudo',
      conteudo: c,
      corpo: `<h1>${esc(c.titulo)}</h1>` + paragrafos(c.texto || [c.resumo])
    }))
  ]

  return [
    ...paginas.map((p) => ({ ...p, corpo: `<main>${p.corpo}</main>${navegacao}` })),
    { caminho: '/painel', rota: 'painel', arquivo: 'painel/index.html', oculta: true, corpo: '' },
    { caminho: '/', rota: 'naoEncontrada', arquivo: '404.html', oculta: true, corpo: `<main>${cabecalho('Página não encontrada', 'Este endereço não existe ou mudou de lugar.')}</main>${navegacao}` }
  ]
}

const LINKS = [
  ['/', 'Início'], ['/sobre', 'Sobre'], ['/conteudo', 'Conteúdo jurídico'], ['/atuacao', 'Áreas de atuação'],
  ['/perguntas', 'Perguntas frequentes'], ['/contato', 'Contato'], ['/privacidade', 'Política de Privacidade'], ['/termos', 'Termos de Uso']
]
const navegacao = `<nav>${LINKS.map(([href, nome]) => `<a href="${href}">${nome}</a>`).join(' · ')}</nav>`

// Falha o build se o modelo do index.html mudar e um campo deixar de ser trocado
function trocar(html, padrao, valor) {
  if (!padrao.test(html)) throw new Error(`Campo não encontrado no index.html: ${padrao}`)
  return html.replace(padrao, (_, inicio = '') => `${inicio}${esc(valor)}`)
}

function montarHtml(modelo, { caminho, rota, conteudo, oculta, corpo }, metadadosDaPagina) {
  const { titulo, descricao } = metadadosDaPagina(rota, conteudo)
  const endereco = SITE + (caminho === '/' ? '/' : caminho)
  const metas = [
    [/(<meta name="description" content=")[^"]*/, descricao],
    [/(<meta name="robots" content=")[^"]*/, oculta ? 'noindex, nofollow' : 'index, follow'],
    [/(<link rel="canonical" href=")[^"]*/, endereco],
    [/(<meta property="og:title" content=")[^"]*/, titulo],
    [/(<meta property="og:description" content=")[^"]*/, descricao],
    [/(<meta property="og:url" content=")[^"]*/, endereco],
    [/(<meta name="twitter:title" content=")[^"]*/, titulo],
    [/(<meta name="twitter:description" content=")[^"]*/, descricao],
    [/(<title>)[^<]*/, titulo]
  ]
  const html = metas.reduce((atual, [padrao, valor]) => trocar(atual, padrao, valor), modelo)
  if (!html.includes('<div id="root"></div>')) throw new Error('#root não encontrado no index.html')
  return corpo ? html.replace('<div id="root"></div>', () => `<div id="root"><div class="estatico">${corpo}</div></div>`) : html
}

const [dados, { metadadosDaPagina }, legais, painel] = await Promise.all([
  carregar('data.js'), carregar('metadados.js'), carregar('textosLegais.js'), lerPainel()
])

const site = {
  perfil: dados.PERFIL,
  contato: dados.CONTATO,
  destaques: dados.DESTAQUES,
  areas: dados.AREAS,
  etapas: dados.ETAPAS,
  conteudos: dados.CONTEUDOS,
  perguntas: dados.PERGUNTAS_FREQUENTES,
  ...painel
}

const modelo = readFileSync(join(BUILD, 'index.html'), 'utf8')
const paginas = montarPaginas(site, legais.preencher, legais, dados.TRAJETORIA)

for (const pagina of paginas) {
  const arquivo = join(BUILD, pagina.arquivo ?? (pagina.caminho === '/' ? 'index.html' : `${pagina.caminho.slice(1)}/index.html`))
  mkdirSync(dirname(arquivo), { recursive: true })
  writeFileSync(arquivo, montarHtml(modelo, pagina, metadadosDaPagina))
}

console.log(`${paginas.length} páginas geradas${Object.keys(painel).length ? ' com os dados do painel' : ''}`)
