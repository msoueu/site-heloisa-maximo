// Textos, links e informações da advogada usados no site.

export const PERFIL = {
  nome: 'Heloisa Maximo',
  titulo: 'Advogada Criminalista',
  slogan: 'Defesa e orientação na área criminal.',
  especialidade: 'Direito Penal e Processual Penal',
  local: 'Sergipe · Atuação em todo o Brasil',
  foto: '/Heloisa.webp',
  // Preencha para exibir no site (deixe vazio para ocultar)
  oab: 'OAB/SE 18.236',
  formacao: '' // ex.: 'Bacharel em Direito pela ...'
}

export const TRAJETORIA = [
  'Heloisa Maximo é advogada criminalista, com atuação dedicada ao Direito Penal e ao Direito Processual Penal, da fase de investigação aos tribunais.',
  'Representando a Jovem Advocacia, foi palestrante do projeto “Advocacia por Elas”, da OAB/SE, debatendo o enfrentamento à violência doméstica no interior do estado.',
  'Atuou no PREFEM/SE em conjunto com o Mecanismo Estadual de Prevenção e Combate à Tortura, acompanhando de perto a realidade do sistema prisional. Essa experiência reforça sua convicção de que a dignidade humana é inegociável.',
  'Também atua na assistência a vítimas e a suas famílias, acompanhando a investigação e o processo.'
]

export const DEV = {
  nome: 'Emy',
  github: 'https://github.com/msoueu'
}

export const CONTATO = {
  whatsapp: '+55 79 99627-0697',
  mensagem: 'Olá, Dra. Heloisa Maximo! Vim pelo seu site e gostaria de falar com a senhora.',
  mensagemAnalise: 'Olá, Dra. Heloisa Maximo! Vim pelo seu site e gostaria de falar com a senhora sobre um caso.\n\nOrganizei as informações e respondi o seguinte:',
  instagram: 'https://www.instagram.com/advheloisamaximo/',
  instagramUser: '@advheloisamaximo',
  telefone: '',
  email: ''
}

export const DESTAQUES = [
  { titulo: 'Plantão 24h', texto: 'Contato disponível para urgências, como prisões em flagrante. O retorno depende da disponibilidade da advogada.' },
  { titulo: 'Penal e Processual Penal', texto: 'Atuação exclusiva na área criminal, do inquérito aos tribunais.' },
  { titulo: 'Atuação nacional', texto: 'Base em Sergipe, com atendimento em todo o Brasil.' },
  { titulo: 'Jovem Advocacia OAB/SE', texto: 'Palestrante do projeto “Advocacia por Elas”.' }
]

export const AREAS = [
  {
    titulo: 'Prisão em flagrante',
    texto: 'Acompanhamento na delegacia e na audiência de custódia.'
  },
  {
    titulo: 'Inquérito e ação penal',
    texto: 'Defesa técnica desde a fase de investigação até a sentença.'
  },
  {
    titulo: 'Habeas corpus e recursos',
    texto: 'Medidas urgentes contra prisões ilegais e recursos às instâncias superiores.'
  },
  {
    titulo: 'Tribunal do Júri',
    texto: 'Atuação em crimes dolosos contra a vida, em todas as fases do júri.'
  },
  {
    titulo: 'Assistência à vítima',
    texto: 'Acompanhamento de vítimas e de suas famílias na investigação e no processo.'
  },
  {
    titulo: 'Execução penal',
    texto: 'Acompanhamento do cumprimento da pena, progressão de regime e garantia de direitos.'
  }
]

export const ETAPAS = [
  { titulo: 'Primeiro contato', texto: 'Você fala com a advogada pelo WhatsApp.' },
  { titulo: 'Análise do caso', texto: 'Estudo dos fatos e documentos para entender riscos e possibilidades.' },
  { titulo: 'Estratégia de defesa', texto: 'Definição clara dos próximos passos, explicada em linguagem simples.' },
  { titulo: 'Acompanhamento', texto: 'Informações sobre o andamento até a conclusão do processo.' }
]

// O primeiro item aparece na página inicial
export const CONTEUDOS = [
  {
    id: 'direitos-da-vitima',
    categoria: 'Explicação',
    data: 'Novembro de 2026',
    titulo: 'Arquivamento do inquérito: o que a vítima pode fazer',
    resumo:
      'Quando o inquérito é arquivado, a vítima deve ser comunicada e pode pedir que a decisão seja revista dentro do Ministério Público.',
    texto: [
      'O arquivamento acontece quando o Ministério Público entende que não há elementos para seguir com a investigação ou oferecer denúncia. Isso não impede que a vítima conheça os motivos da decisão e questione esse entendimento.',
      'Segundo o art. 28, § 1º, do Código de Processo Penal, a vítima ou seu representante legal que não concordar com o arquivamento pode, em até 30 dias do recebimento da comunicação, levar o tema à instância de revisão do próprio Ministério Público.',
      'Cada situação tem particularidades, e este texto é apenas informativo. Ele não substitui a análise individual de um caso.'
    ]
  },
  {
    id: 'advocacia-por-elas',
    categoria: 'Palestra',
    data: 'Março',
    titulo: 'Advocacia por Elas: março não é um mês de flores, é um mês de vigília',
    resumo:
      'Palestra no projeto “Advocacia por Elas”, da OAB/SE, representando a Jovem Advocacia no interior do estado.',
    imagem: '/conteudo/advocacia-por-elas.jpg',
    imagemAlt: 'Heloisa Maximo falando ao microfone durante palestra',
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
    imagemAlt: 'Heloisa Maximo diante do portão de um pavilhão prisional, segurando uma prancheta',
    texto: [
      'É comum que o sistema prisional seja discutido sob o escudo das estatísticas, um distanciamento que, muitas vezes, mascara a crueza da vida real. No entanto, a verdade do cárcere se impõe nos detalhes, que por vezes passam despercebidos ou são minimizados por aqueles que não precisam viver essa realidade.',
      'Minha atuação no PREFEM/SE, em conjunto com o Mecanismo Estadual de Prevenção e Combate à Tortura, não foi apenas uma diligência técnica; foi um confronto necessário com a face mais dura do Estado. Ninguém retorna ileso ao encarar o cárcere de frente; é uma vivência que desarticula qualquer indiferença e transmuta nossa consciência sobre o Direito.',
      'A justiça deve ser o limite intransponível contra o arbítrio. Se a pena ultrapassa a privação da liberdade para atingir a humanidade do indivíduo, o Estado renuncia à sua própria legitimidade. A dignidade humana não aceita meios-termos: ela é, por definição, inegociável.'
    ]
  }
]

export const PERGUNTAS_FREQUENTES = [
  {
    titulo: 'Alguém da minha família foi preso. O que fazer primeiro?',
    texto: 'Procure a orientação de um advogado ou advogada o quanto antes. Toda pessoa presa tem direito de comunicar a prisão à família e de ter assistência de advogado, e a orientação logo no início ajuda a proteger esses direitos.'
  },
  {
    titulo: 'O que é a audiência de custódia?',
    texto: 'É a apresentação da pessoa presa a um juiz logo após a prisão, em regra em até 24 horas. Nela, o juiz analisa como a prisão aconteceu e decide se a pessoa continua presa ou se responde em liberdade.'
  },
  {
    titulo: 'Sou obrigado a falar na delegacia?',
    texto: 'Sobre os fatos, não. A Constituição garante o direito de permanecer calado, e esse silêncio não pode ser usado contra você. Os dados de identificação pessoal, porém, devem ser informados. Se possível, converse com um advogado ou advogada antes de prestar depoimento.'
  },
  {
    titulo: 'Recebi uma intimação da delegacia. O que eu faço?',
    texto: 'Não ignore a intimação e leia com atenção a data e o motivo. Procure orientação jurídica antes de comparecer, para entender em que condição você está sendo chamado e como se preparar.'
  },
  {
    titulo: 'O que é habeas corpus?',
    texto: 'É uma medida usada para proteger a liberdade de locomoção de quem está preso ou ameaçado de prisão de forma ilegal ou com abuso de poder.'
  },
  {
    titulo: 'Sou vítima de um crime. Posso ter advogado?',
    texto: 'Sim. A vítima e sua família podem ter advogado para acompanhar a investigação e o processo e defender seus interesses.'
  },
  {
    titulo: 'A conversa com a advogada é sigilosa?',
    texto: 'Sim. O que você conta à advogada no exercício da profissão é protegido pelo sigilo profissional, nos termos da lei.'
  },
  {
    titulo: 'A advogada atende fora de Sergipe?',
    texto: 'Sim. A base é em Sergipe, com atendimento em todo o Brasil.'
  },
  {
    titulo: 'Quanto custa uma consulta?',
    texto: 'Os honorários dependem da complexidade de cada caso e são combinados diretamente com a advogada, conforme as regras da OAB.'
  }
]

// Opções da seção Aparência do painel; valem só para as páginas internas
export const APARENCIA = {
  fonte: 'Source Sans 3',
  titulo: 'Georgia',
  tamanho: 1,
  tamanhoTitulo: 1,
  destaque: 'negrito'
}
