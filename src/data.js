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
// Nomes das páginas no menu do topo e no rodapé; a chave é o endereço da página
export const MENU = {
  sobre: 'Sobre',
  conteudo: 'Conteúdo',
  atuacao: 'Atuação',
  contato: 'Contato',
  perguntas: 'Perguntas frequentes'
}

export const APARENCIA = {
  fonte: 'Source Sans 3',
  titulo: 'Georgia',
  tamanho: 1,
  tamanhoTitulo: 1,
  destaque: 'negrito'
}

// Textos fixos das páginas, editáveis no painel. Cada campo: [chave, nome no painel, texto padrão, linhas do campo]
// Em campo de várias linhas, linha em branco separa parágrafos; nas respostas do diagnóstico, uma por linha
export const TEXTOS_DO_SITE = [
  {
    id: 'inicio',
    pagina: 'Página inicial',
    campos: [
      ['inicio.tag', 'Etiqueta da abertura', 'ADVOCACIA CRIMINAL'],
      ['inicio.alcance', 'Depois da área principal', 'Atuação Nacional'],
      ['inicio.linkSobre', 'Link da abertura', 'Conheça a advogada'],
      ['inicio.tagSobre', 'Etiqueta de Sobre', 'SOBRE'],
      ['inicio.linkTrajetoria', 'Link de Sobre', 'Conheça a trajetória completa'],
      ['inicio.tagConteudo', 'Etiqueta de Conteúdo', 'CONTEÚDO JURÍDICO'],
      ['inicio.linkConteudo', 'Link de Conteúdo', 'Ver mais conteúdo jurídico'],
      ['inicio.tagAtuacao', 'Etiqueta de Atuação', 'ÁREAS DE ATUAÇÃO'],
      ['inicio.tituloAtuacao', 'Título de Atuação', 'Defesa em todas as fases do processo penal'],
      ['inicio.linkAtuacao', 'Link de Atuação', 'Ver todas as áreas'],
      ['inicio.tagContato', 'Etiqueta de Contato', 'CONTATO'],
      ['inicio.tituloContato', 'Título de Contato', 'Contato'],
      ['inicio.textoContato', 'Texto de Contato', 'Fale com a advogada pelo WhatsApp ou conte sua situação em quatro perguntas rápidas. Sua conversa é protegida pelo sigilo profissional, nos termos da lei.', 3],
      ['inicio.botaoSituacao', 'Botão de Contato', 'Contar minha situação'],
      ['inicio.linkContato', 'Link de Contato', 'Todas as formas de contato']
    ]
  },
  {
    id: 'sobre',
    pagina: 'Sobre',
    campos: [
      ['sobre.ligacao', 'Entre a profissão e a área', ', com atuação em'],
      ['sobre.tituloTrajetoria', 'Título da trajetória', 'Trajetória'],
      ['sobre.trajetoria', 'Trajetória', TRAJETORIA.join('\n\n'), 10],
      ['sobre.tituloConviccao', 'Título da citação', 'Convicção'],
      ['sobre.citacao', 'Citação', 'A dignidade humana não aceita meios-termos: ela é, por definição, inegociável.', 2],
      ['sobre.citacaoFonte', 'De onde vem a citação', '“O cárcere visto de frente: a dignidade humana é inegociável”'],
      ['sobre.linkAtuacao', 'Link no fim da página', 'Ver as áreas de atuação']
    ]
  },
  {
    id: 'conteudo',
    pagina: 'Conteúdo',
    campos: [
      ['conteudo.titulo', 'Título da página', 'Direito e reflexões'],
      ['conteudo.subtitulo', 'Frase abaixo do título', 'Palestras e explicações sobre Direito Penal em linguagem acessível.', 2],
      ['conteudo.maisRecente', 'Etiqueta da mais recente (celular)', 'Mais recente'],
      ['conteudo.outras', 'Título da lista (celular)', 'Outras publicações']
    ]
  },
  {
    id: 'atuacao',
    pagina: 'Atuação',
    campos: [
      ['atuacao.titulo', 'Título da página', 'Defesa em todas as fases do processo penal'],
      ['atuacao.subtitulo', 'Frase abaixo do título', 'Atuação exclusiva na área criminal, do inquérito aos tribunais.', 2],
      ['atuacao.tituloEtapas', 'Título das etapas', 'Do primeiro contato à conclusão do caso']
    ]
  },
  {
    id: 'contato',
    pagina: 'Contato',
    campos: [
      ['contato.titulo', 'Título da página', 'Contato'],
      ['contato.subtitulo', 'Frase abaixo do título', 'Fale com a advogada pelo WhatsApp ou pelo Instagram.', 2],
      ['contato.porta1Titulo', 'Cartão do WhatsApp: título', 'Falar com a advogada'],
      ['contato.porta1Texto', 'Cartão do WhatsApp: texto', 'Plantão 24h para urgências, como prisões em flagrante.', 2],
      ['contato.porta1Acao', 'Cartão do WhatsApp: botão', 'Abrir o WhatsApp'],
      ['contato.porta2Titulo', 'Cartão da situação: título', 'Contar minha situação'],
      ['contato.porta2Texto', 'Cartão da situação: texto', 'Responda quatro perguntas rápidas para organizar as informações antes do contato.', 2],
      ['contato.porta2Acao', 'Cartão da situação: botão', 'Começar'],
      ['contato.sigilo', 'Frase do sigilo', 'Sua conversa é protegida pelo sigilo profissional, nos termos da lei.', 2],
      ['contato.rotuloTelefone', 'Nome do telefone', 'Telefone'],
      ['contato.rotuloEmail', 'Nome do e-mail', 'E-mail'],
      ['contato.rotuloInstagram', 'Nome do Instagram', 'Instagram'],
      ['contato.rotuloLocal', 'Nome do local', 'Onde atua']
    ]
  },
  {
    id: 'diagnostico',
    pagina: 'Conte sua situação',
    campos: [
      ['diag.titulo', 'Título da página', 'Conte sua situação'],
      ['diag.subtitulo', 'Frase abaixo do título', 'Responda quatro perguntas rápidas para organizar as informações antes do contato. Leva menos de um minuto.', 2],
      ['diag.selo1', 'Selo 1', 'Atendimento confidencial'],
      ['diag.selo2', 'Selo 2', 'Respostas não ficam salvas'],
      ['diag.selo3', 'Selo 3', 'Menos de um minuto'],
      ['diag.aviso', 'Aviso no topo da conversa', 'Mensagens automáticas'],
      ['diag.ola', 'Primeira mensagem', 'Olá! Vou fazer quatro perguntas rápidas para organizar as informações.', 2],
      ['diag.pergunta1', 'Pergunta 1', 'O que está acontecendo?'],
      ['diag.opcoes1', 'Respostas da pergunta 1 (uma por linha)', 'Prisão em flagrante\nInvestigação ou inquérito\nProcesso em andamento\nSou vítima ou familiar de vítima\nCumprimento de pena\nOutra situação', 6],
      ['diag.pergunta2', 'Pergunta 2', 'Quem precisa de ajuda?'],
      ['diag.opcoes2', 'Respostas da pergunta 2 (uma por linha)', 'Eu\nUm familiar\nOutra pessoa', 3],
      ['diag.pergunta3', 'Pergunta 3', 'Quando aconteceu?'],
      ['diag.opcoes3', 'Respostas da pergunta 3 (uma por linha)', 'Agora ou nas últimas 24 horas\nNesta semana\nHá mais tempo', 3],
      ['diag.pergunta4', 'Pergunta 4', 'Já existe advogado no caso?'],
      ['diag.opcoes4', 'Respostas da pergunta 4 (uma por linha)', 'Não\nSim\nNão sei', 3],
      ['diag.fim', 'Mensagem final', 'Pronto. Se quiser, envie essas respostas para a advogada pelo WhatsApp.', 2],
      ['diag.enviar', 'Botão de enviar', 'Enviar para a advogada'],
      ['diag.recomecar', 'Botão de recomeçar', 'Recomeçar'],
      ['diag.notaRotulo', 'Início do aviso legal', 'Importante:'],
      ['diag.nota', 'Aviso legal', 'esta página só organiza as informações para a conversa. Ela não é consulta jurídica, não avalia o seu caso e não indica resultado.', 3]
    ]
  },
  {
    id: 'perguntas',
    pagina: 'Perguntas frequentes',
    campos: [
      ['perguntas.titulo', 'Título da página', 'Perguntas frequentes'],
      ['perguntas.subtitulo', 'Frase abaixo do título', 'Respostas gerais para as dúvidas mais comuns. Cada caso é único e precisa ser avaliado individualmente.', 2],
      ['perguntas.naoEncontrou', 'Título no fim da página', 'Não encontrou a sua dúvida?'],
      ['perguntas.linkSituacao', 'Link da situação', 'Contar minha situação'],
      ['perguntas.linkWhatsApp', 'Link do WhatsApp', 'Falar com a advogada']
    ]
  },
  {
    id: 'geral',
    pagina: 'Topo e rodapé',
    campos: [
      ['geral.marca', 'Nome no topo', 'Heloisa Maximo'],
      ['geral.area', 'Embaixo do nome (topo e rodapé)', 'Advocacia Criminal'],
      ['geral.botaoWhatsApp', 'Botão do WhatsApp', 'Falar no WhatsApp'],
      ['geral.selo1', 'Selo do plantão', 'Plantão 24h para urgências'],
      ['geral.selo2', 'Selo do atendimento', 'Atendimento confidencial'],
      ['geral.voltar', 'Link para voltar', 'Voltar ao início'],
      ['geral.relogio', 'Antes do relógio', 'Plantão 24h · Horário de Brasília'],
      ['geral.chamadaTitulo', 'Faixa de contato: título', 'Contato'],
      ['geral.chamadaTexto', 'Faixa de contato: texto', 'Fale com a advogada pelo WhatsApp. Sua conversa é protegida pelo sigilo profissional, nos termos da lei.', 2],
      ['geral.privacidade', 'Link da privacidade', 'Política de Privacidade'],
      ['geral.termos', 'Link dos termos', 'Termos de Uso'],
      ['geral.direitos', 'Depois do ano e do nome', 'Todos os direitos reservados.'],
      ['geral.informativo', 'Aviso do rodapé', 'Conteúdo de caráter exclusivamente informativo.'],
      ['geral.naoEncontradaTitulo', 'Página não encontrada: título', 'Página não encontrada'],
      ['geral.naoEncontradaTexto', 'Página não encontrada: texto', 'Este endereço não existe ou mudou de lugar.']
    ]
  }
]

export const TEXTOS = Object.fromEntries(TEXTOS_DO_SITE.flatMap((p) => p.campos.map(([chave, , padrao]) => [chave, padrao])))
