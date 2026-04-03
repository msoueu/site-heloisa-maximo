# ⚖️ Heloisa Máximo — Site Institucional

> Site institucional de advocacia criminal com modelo 3D interativo, navegação por scroll e design cinematográfico.

---

## 🖥️ Preview

O site apresenta uma estátua 3D que se move conforme o usuário navega pelas seções, cada uma revelando uma parte diferente do modelo com transições suaves de câmera.

---

## 🚀 Tecnologias Utilizadas

### Linguagens
| Linguagem | Uso |
|-----------|-----|
| **JavaScript (ES2022+)** | Lógica do site, animações, eventos |
| **JSX** | Sintaxe React para escrever HTML dentro do JavaScript |
| **CSS3** | Estilização, posicionamento fixo, transições |

### Frameworks e Bibliotecas
| Ferramenta | Finalidade |
|------------|------------|
| **React 18** | Biblioteca principal para construção da interface |
| **React Three Fiber** | Integração do Three.js com React (Canvas 3D) |
| **Three.js** | Renderização 3D no navegador via WebGL |
| **@react-three/drei** | Utilitários para React Three Fiber (carregamento de modelos GLTF) |
| **@react-three/postprocessing** | Efeitos visuais pós-renderização (Bloom/brilho) |

### Ferramentas de Desenvolvimento
| Ferramenta | Finalidade |
|------------|------------|
| **Create React App** | Configuração do projeto (Webpack, Babel, scripts) |
| **Webpack** | Empacotador de módulos (configurado pelo CRA) |
| **Babel** | Transpila JSX e JS moderno para compatibilidade com navegadores |
| **npm** | Gerenciador de pacotes |
| **Git** | Controle de versão |
| **GitHub** | Hospedagem do repositório |

### Conceitos e Padrões Utilizados
- **WebGL** — API gráfica do navegador usada pelo Three.js para renderização 3D
- **GLTF/GLB** — Formato de arquivo 3D usado para o modelo da estátua
- **React Hooks** — `useState`, `useEffect`, `useRef` para controle de estado e efeitos
- **CSS Positioning** — `position: fixed` para camadas sobrepostas (z-index stack)
- **Lerp (Linear Interpolation)** — Técnica de suavização de animações 3D
- **Component-based Architecture** — Separação do código em componentes reutilizáveis

---

## 📁 Estrutura do Projeto

```
src/
├── App.jsx              # Componente raiz — monta todas as camadas
├── App.css              # Estilos globais e do canvas 3D
├── Estatua.jsx          # Modelo 3D com câmera animada por seção
├── Header.jsx           # Cabeçalho fixo com menu e botão WhatsApp
├── Header.css           # Estilos do header
├── Dots.jsx             # Pontinhos de navegação lateral
├── Dots.css             # Estilos dos pontinhos
├── SectionContent.jsx   # Conteúdo textual de cada seção
├── SectionContent.css   # Estilos dos painéis de conteúdo
├── index.js             # Ponto de entrada da aplicação React
└── index.css            # Reset e estilos base do body

public/
├── estatua.glb          # Modelo 3D da estátua (arquivo binário)
├── heloisa.webp         # Foto da advogada
└── Prancheta1.jpg       # Imagem de fundo
```

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 16 ou superior
- npm (já vem com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 2. Entre na pasta do projeto
cd SEU_REPOSITORIO

# 3. Instale as dependências
npm install

# 4. Rode o servidor de desenvolvimento
npm start
```

O site abrirá automaticamente em `http://localhost:3000`

---

## 📦 Build para Produção

```bash
npm run build
```

Gera a pasta `/build` com os arquivos otimizados prontos para deploy.

---

## 🧭 Navegação

| Ação | Resultado |
|------|-----------|
| Scroll para baixo | Avança para a próxima seção |
| Scroll para cima | Volta para a seção anterior |
| Clique nos pontinhos laterais | Vai direto para a seção clicada |

---

## 📄 Licença

Todos os direitos reservados © Heloisa Máximo Advocacia.
