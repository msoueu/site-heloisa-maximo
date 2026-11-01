const ROTAS = ['sobre', 'conteudo', 'atuacao', 'contato', 'diagnostico', 'perguntas', 'privacidade', 'termos', 'painel']

// O link de nova senha chega como #access_token=...&type=recovery; o cliente do Supabase limpa
// esse trecho da URL ao iniciar, então a origem é lida antes de o painel carregar
export const veioDeRecuperacao = window.location.hash.includes('type=recovery')

export function lerRota() {
  if (veioDeRecuperacao) return 'painel'
  const pagina = window.location.pathname.split('/')[1]
  return ROTAS.includes(pagina) ? pagina : 'home'
}

export function navegar(caminho) {
  window.history.pushState(null, '', caminho)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Links antigos e já compartilhados, como /#/sobre, continuam funcionando
export function migrarEnderecoAntigo() {
  const { hash } = window.location
  if (hash.startsWith('#/')) window.history.replaceState(null, '', hash.slice(1))
}

// Links internos trocam de página sem recarregar; novas abas e arquivos seguem o navegador
export function interceptarLink(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const link = e.target.closest('a')
  if (!link || link.target || link.origin !== window.location.origin) return
  e.preventDefault()
  navegar(link.pathname)
}
