// Textos, links e informações da advogada usados no site.

export const PERFIL = {
  nome: 'Heloisa Máximo',
  titulo: 'Advogada Criminalista',
  slogan: 'Defesa técnica, humanizada e combativa.',
  especialidade: 'Direito Penal e Processual Penal',
  local: 'Sergipe · Atuação em todo o Brasil',
  foto: '/Heloisa.webp',
  // Preencha para exibir no site (deixe vazio para ocultar)
  oab: '', // ex.: 'OAB/SE 0000'
  formacao: '' // ex.: 'Bacharel em Direito pela ...'
}

export const DEV = {
  nome: 'Emy',
  github: 'https://github.com/msoueu'
}

export const CONTATO = {
  whatsapp: 'https://wa.me/message/OOKYODDRW6ILK1',
  instagram: 'https://www.instagram.com/advheloisamaximo/',
  instagramUser: '@advheloisamaximo'
}

export const DESTAQUES = [
  { titulo: 'Plantão 24h', texto: 'Atendimento imediato em urgências, como prisões em flagrante.' },
  { titulo: 'Penal e Processual Penal', texto: 'Atuação exclusiva na área criminal, do inquérito aos tribunais.' },
  { titulo: 'Atuação nacional', texto: 'Base em Sergipe, com atendimento em todo o Brasil.' },
  { titulo: 'Jovem Advocacia OAB/SE', texto: 'Palestrante do projeto “Advocacia por Elas”.' }
]

export const AREAS = [
  {
    titulo: 'Prisão em flagrante',
    texto: 'Atuação imediata na delegacia e na audiência de custódia, buscando a liberdade do cliente.'
  },
  {
    titulo: 'Inquérito e ação penal',
    texto: 'Defesa técnica desde a fase de investigação até a sentença, com estratégia em cada etapa.'
  },
  {
    titulo: 'Habeas corpus e recursos',
    texto: 'Medidas urgentes contra prisões ilegais e recursos às instâncias superiores.'
  },
  {
    titulo: 'Tribunal do Júri',
    texto: 'Atuação em crimes dolosos contra a vida, com preparo técnico e oratória.'
  },
  {
    titulo: 'Assistência à vítima',
    texto: 'Defesa dos interesses de vítimas e de suas famílias para que a investigação não pare.'
  },
  {
    titulo: 'Execução penal',
    texto: 'Acompanhamento do cumprimento da pena, progressão de regime e garantia de direitos.'
  }
]

export const ETAPAS = [
  { titulo: 'Primeiro contato', texto: 'Você fala diretamente com a advogada pelo WhatsApp, com total sigilo.' },
  { titulo: 'Análise do caso', texto: 'Estudo dos fatos e documentos para entender riscos e possibilidades.' },
  { titulo: 'Estratégia de defesa', texto: 'Definição clara dos próximos passos, explicada em linguagem simples.' },
  { titulo: 'Acompanhamento', texto: 'Atualizações constantes até a conclusão do processo.' }
]

// O primeiro item aparece na página inicial
export const CONTEUDOS = [
  {
    id: 'verdade-real',
    categoria: 'Atuação',
    data: 'Abril de 2026',
    titulo: 'Pela memória de quem se foi e pela verdade real dos fatos',
    resumo:
      'Diante do arquivamento do caso pelo Ministério Público, buscamos a instância superior para garantir que a investigação não seja interrompida precocemente.',
    texto: [
      'O luto de uma família que perde um ente querido em circunstâncias violentas não admite lacunas ou dúvidas. Na defesa dos interesses da família das vítimas, nossa atuação vai além dos autos; busca-se o conforto que apenas a justiça e a verdade podem proporcionar.',
      'Diante do arquivamento do caso pelo Ministério Público, buscamos a instância superior para garantir que a investigação não seja interrompida precocemente.',
      'A justiça pode ser um caminho longo, mas é o único caminho capaz de trazer algum alento a quem ficou. Pela memória de quem se foi e pela verdade real dos fatos.'
    ],
    video: '/conteudo/verdade-real.mp4',
    poster: '/conteudo/verdade-real.jpg',
    videoLegenda: 'Heloisa Máximo em entrevista à TV Sergipe (SE2)'
  },
  {
    id: 'advocacia-por-elas',
    categoria: 'Palestra',
    data: 'Março',
    titulo: 'Advocacia por Elas: março não é um mês de flores, é um mês de vigília',
    resumo:
      'Palestra no projeto “Advocacia por Elas”, da OAB/SE, representando a Jovem Advocacia no interior do estado.',
    imagem: '/conteudo/advocacia-por-elas.jpg',
    imagemAlt: 'Heloisa Máximo falando ao microfone durante palestra',
    texto: [
      'Na última semana eu tive a honra e o privilégio de estar como palestrante no projeto “Advocacia por Elas” da OAB/SE, representando a Jovem Advocacia no interior do estado.',
      'Ocupar este espaço para debater violência doméstica é compreender que a nossa missão transcende os processos; ela toca na dignidade humana. Março não é um mês de flores, é um mês de vigília.',
      'Como jovens advogados, carregamos a responsabilidade de modernizar não apenas o olhar jurídico, mas o acolhimento social. Onde houver uma mulher em perigo, deve haver uma advocacia forte, técnica e, acima de tudo, corajosa.'
    ]
  },
  {
    id: 'carcere-de-frente',
    categoria: 'Direitos humanos',
    data: 'PREFEM/SE',
    titulo: 'O cárcere visto de frente: a dignidade humana é inegociável',
    resumo:
      'Atuação no PREFEM/SE em conjunto com o Mecanismo Estadual de Prevenção e Combate à Tortura.',
    imagem: '/conteudo/prefem-se.jpg',
    imagemAlt: 'Heloisa Máximo diante do portão de um pavilhão prisional, segurando uma prancheta',
    texto: [
      'É comum que o sistema prisional seja discutido sob o escudo das estatísticas, um distanciamento que, muitas vezes, mascara a crueza da vida real. No entanto, a verdade do cárcere se impõe nos detalhes, que por vezes passam despercebidos ou são minimizados por aqueles que não precisam viver essa realidade.',
      'Minha atuação no PREFEM/SE, em conjunto com o Mecanismo Estadual de Prevenção e Combate à Tortura, não foi apenas uma diligência técnica; foi um confronto necessário com a face mais dura do Estado. Ninguém retorna ileso ao encarar o cárcere de frente; é uma vivência que desarticula qualquer indiferença e transmuta nossa consciência sobre o Direito.',
      'A justiça deve ser o limite intransponível contra o arbítrio. Se a pena ultrapassa a privação da liberdade para atingir a humanidade do indivíduo, o Estado renuncia à sua própria legitimidade. A dignidade humana não aceita meios-termos: ela é, por definição, inegociável.'
    ]
  }
]
