const NOME = 'Heloisa Máximo'

const PAGINAS = {
  home: {
    titulo: `${NOME} · Advocacia Criminal`,
    descricao: 'Heloisa Máximo, advogada criminalista. Defesa técnica, humanizada e combativa em Direito Penal e Processual Penal, com base em Sergipe e atuação em todo o Brasil.'
  },
  sobre: {
    titulo: `Sobre · ${NOME}`,
    descricao: 'Conheça a trajetória de Heloisa Máximo, advogada criminalista com base em Sergipe e atuação em todo o Brasil.'
  },
  conteudo: {
    titulo: `Conteúdo jurídico · ${NOME}`,
    descricao: 'Casos, palestras e explicações sobre Direito Penal em linguagem acessível.'
  },
  atuacao: {
    titulo: `Áreas de atuação · ${NOME}`,
    descricao: 'Atuação exclusiva na área criminal, do inquérito aos tribunais: prisão em flagrante, inquérito, habeas corpus, Tribunal do Júri, assistência à vítima e execução penal.'
  },
  contato: {
    titulo: `Contato · ${NOME}`,
    descricao: 'Fale com Heloisa Máximo, advogada criminalista, pelo WhatsApp ou pelo Instagram. Atendimento confidencial.'
  },
  diagnostico: {
    titulo: `Analisar meu caso · ${NOME}`,
    descricao: 'Responda quatro perguntas rápidas para organizar as informações antes de falar com a advogada. Não é consulta jurídica.'
  },
  perguntas: {
    titulo: `Perguntas frequentes · ${NOME}`,
    descricao: 'Respostas gerais sobre prisão, audiência de custódia, intimação, habeas corpus e sigilo na advocacia criminal.'
  },
  parcerias: {
    titulo: `Parcerias · ${NOME}`,
    descricao: 'Pessoas e instituições parceiras de Heloisa Máximo, advogada criminalista.'
  },
  privacidade: {
    titulo: `Política de Privacidade · ${NOME}`,
    descricao: 'Como os dados pessoais são tratados no site de Heloisa Máximo, conforme a LGPD.'
  },
  termos: {
    titulo: `Termos de Uso · ${NOME}`,
    descricao: 'Condições de uso do site institucional de Heloisa Máximo.'
  },
  painel: { titulo: `Painel · ${NOME}`, descricao: 'Área restrita.' }
}

const definir = (seletor, atributo, valor) => document.querySelector(seletor)?.setAttribute(atributo, valor)

export function aplicarMetadados(rota) {
  const { titulo, descricao } = PAGINAS[rota]
  const endereco = window.location.origin + window.location.pathname

  document.title = titulo
  definir('meta[name="description"]', 'content', descricao)
  definir('meta[name="robots"]', 'content', rota === 'painel' ? 'noindex, nofollow' : 'index, follow')
  definir('link[rel="canonical"]', 'href', endereco)
  definir('meta[property="og:url"]', 'content', endereco)
  definir('meta[property="og:title"]', 'content', titulo)
  definir('meta[property="og:description"]', 'content', descricao)
  definir('meta[name="twitter:title"]', 'content', titulo)
  definir('meta[name="twitter:description"]', 'content', descricao)
}
