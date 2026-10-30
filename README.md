# Heloisa Máximo Advocacia

Site institucional da advogada criminalista Heloisa Máximo.

Site publicado: https://site-heloisa-maximo.vercel.app

## Tecnologias

- React 19 (Create React App)
- Three.js com React Three Fiber e drei
- Supabase (conteúdo editável e login do painel)
- Vercel (hospedagem)

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
git clone https://github.com/msoueu/site-heloisa-maximo.git
cd site-heloisa-maximo
npm install
npm start
```

O site abre em http://localhost:3000.

Para gerar a versão de produção:

```bash
npm run build
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha com os dados do projeto no Supabase:

```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
```

Sem essas variáveis o site funciona normalmente com os textos de `src/data.js`; só o painel de edição fica desativado.

## Painel de edição

O painel fica em `/#/painel`. A configuração do Supabase está em [supabase/LEIA-ME.md](supabase/LEIA-ME.md).

## Estrutura

```
public/          imagens, vídeo e modelo 3D
scripts/         preparação dos dados do modelo 3D
src/             componentes, estilos e textos do site
supabase/        SQL e instruções do banco
```

O modelo 3D usa `public/justica.bin` e `public/marmore.bin`, gerados a partir de `scripts/justica-original.glb`. Se o modelo for trocado, gere de novo com:

```bash
node scripts/preparar-estatua.mjs
```

## Créditos

Modelo 3D da estátua: [Lady Justice Statue](https://sketchfab.com/3d-models/lady-justice-statue-holding-scales-held-by-chai-0a201e1e2cbc499e8e18cfec34402dc9), de RaresXS, sob licença CC BY 4.0.

## Licença

Todos os direitos reservados. Heloisa Máximo Advocacia.
