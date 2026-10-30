# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Duas audiências de igual peso. Famílias e pessoas em urgência criminal (prisão em flagrante, investigação), no celular e com medo, que precisam falar com a advogada agora. E clientes com tempo, que pesquisam e comparam advogados antes de decidir.

## Product Purpose

Site institucional da advogada criminalista Heloisa Máximo. Passa autoridade e mantém o plantão e o WhatsApp sempre à mão. Sucesso é o visitante iniciar a conversa no WhatsApp.

## Positioning

Advocacia exclusivamente criminal, com base em Sergipe e atuação nacional. Defesa técnica, humanizada e combativa. Trajetória real: Jovem Advocacia OAB/SE, palestra no "Advocacia por Elas", atuação no PREFEM/SE com o Mecanismo Estadual de Prevenção e Combate à Tortura, entrevista à TV Sergipe em defesa da família de vítimas.

## Capabilities and Constraints

React 19 (Create React App), Three.js com React Three Fiber, Supabase para conteúdo editável e login do painel, hospedagem na Vercel. A estátua 3D é carregada sob demanda e não pode pesar o site. Rotas por hash. Publicidade limitada pelo Código de Ética da OAB e pelo Provimento nº 205/2021: sem promessa de resultado, sem captação de clientela. O número da OAB e a formação ainda não foram informados e ficam ocultos até serem preenchidos.

## Brand Commitments

A identidade visual atual é fixa: bordô e dourado, monograma HM (fundo `public/Prancheta1.jpg`), tema claro e escuro, cabeçalho e composição da página inicial por seções. Propor outra identidade está fora de questão; o protótipo de novos caminhos foi rejeitado. Nome e textos da advogada ficam como estão. Estátua da Justiça em 3D, em cima de uma base que gira; só a câmera e a luz se movem além do giro. Nada de aparência de site feito por IA nas páginas internas.

## Evidence on Hand

Foto da advogada (`public/Heloisa.webp`), fotos reais em `public/conteudo/` (palestra, PREFEM/SE, entrevista), vídeo da entrevista à TV Sergipe, textos de atuação em `src/data.js`. Não há depoimentos, números de casos nem prêmios: nada disso pode ser inventado.

## Product Principles

- Quem está com medo acha o contato em segundos, em qualquer tela.
- A autoridade vem de fatos reais da trajetória, não de adjetivos.
- Sobriedade de escritório: nada de efeito que pareça truque.
- A estátua é uma peça física num espaço real e não pode custar a fluidez do site.

## Accessibility & Inclusion

O site precisa funcionar para todos, inclusive quem tem baixa visão, e isso é requisito, não acabamento. Público em estresse e no celular. Meta: WCAG 2.2 AA, com contraste de 7:1 no texto corrido. Fonte de leitura legível e com peso suficiente, nunca texto fino ou miúdo; tamanhos em `rem`, para respeitar a fonte configurada no navegador e o zoom até 200%. Navegação completa por teclado, foco visível, leitor de tela, alvos de toque grandes e respeito a `prefers-reduced-motion`. Nenhuma informação fica só na estátua ou depende de animação.
