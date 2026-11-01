const NOME = 'Heloisa Maximo'

const PAGINAS = {
  home: {
    titulo: `${NOME} · Advocacia Criminal`,
    descricao: 'Heloisa Maximo, advogada criminalista. Atuação em Direito Penal e Processual Penal, com base em Sergipe e atuação em todo o Brasil.'
  },
  sobre: {
    titulo: `Sobre · ${NOME}`,
    descricao: 'Conheça a trajetória de Heloisa Maximo, advogada criminalista com base em Sergipe e atuação em todo o Brasil.'
  },
  conteudo: {
    titulo: `Conteúdo jurídico · ${NOME}`,
    descricao: 'Palestras e explicações sobre Direito Penal em linguagem acessível.'
  },
  atuacao: {
    titulo: `Áreas de atuação · ${NOME}`,
    descricao: 'Atuação exclusiva na área criminal, do inquérito aos tribunais: prisão em flagrante, inquérito, habeas corpus, Tribunal do Júri, assistência à vítima e execução penal.'
  },
  contato: {
    titulo: `Contato · ${NOME}`,
    descricao: 'Fale com Heloisa Maximo, advogada criminalista, pelo WhatsApp ou pelo Instagram. Atendimento confidencial.'
  },
  diagnostico: {
    titulo: `Conte sua situação · ${NOME}`,
    descricao: 'Responda quatro perguntas rápidas para organizar as informações antes de falar com a advogada. Não é consulta jurídica.'
  },
  perguntas: {
    titulo: `Perguntas frequentes · ${NOME}`,
    descricao: 'Respostas gerais sobre prisão, audiência de custódia, intimação, habeas corpus e sigilo na advocacia criminal.'
  },
  privacidade: {
    titulo: `Política de Privacidade · ${NOME}`,
    descricao: 'Como os dados pessoais são tratados no site de Heloisa Maximo, conforme a LGPD.'
  },
  termos: {
    titulo: `Termos de Uso · ${NOME}`,
    descricao: 'Condições de uso do site institucional de Heloisa Maximo.'
  },
  painel: { titulo: `Painel · ${NOME}`, descricao: 'Área restrita.' },
  naoEncontrada: { titulo: `Página não encontrada · ${NOME}`, descricao: 'Este endereço não existe ou mudou de lugar.' }
}

// Também usado por scripts/gerar-paginas.mjs
export function metadadosDaPagina(rota, conteudo) {
  return conteudo ? { titulo: `${conteudo.titulo} · ${NOME}`, descricao: conteudo.resumo } : PAGINAS[rota]
}

const definir = (seletor, atributo, valor) => document.querySelector(seletor)?.setAttribute(atributo, valor)

export function aplicarMetadados(rota, conteudos) {
  const id = rota === 'conteudo' && window.location.pathname.split('/')[2]
  const conteudo = id ? conteudos.find((c) => c.id === id) : undefined
  const { titulo, descricao } = metadadosDaPagina(rota, conteudo)
  // Publicação que não existe aponta para a lista
  const endereco = window.location.origin + (id && !conteudo ? '/conteudo' : window.location.pathname)
  const oculta = rota === 'painel' || rota === 'naoEncontrada'

  document.title = titulo
  definir('meta[name="description"]', 'content', descricao)
  definir('meta[name="robots"]', 'content', oculta ? 'noindex, nofollow' : 'index, follow')
  definir('link[rel="canonical"]', 'href', endereco)
  definir('meta[property="og:url"]', 'content', endereco)
  definir('meta[property="og:title"]', 'content', titulo)
  definir('meta[property="og:description"]', 'content', descricao)
  definir('meta[name="twitter:title"]', 'content', titulo)
  definir('meta[name="twitter:description"]', 'content', descricao)
}
