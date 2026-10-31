import { useEffect, useRef, useState } from 'react'
import { useSite, linkWhatsApp, aceitaMensagem } from './SiteData'
import { supabase, BUCKET } from './supabase'
import { veioDeRecuperacao } from './rotas'
import { validarArquivo, validarConteudo, TIPOS_IMAGEM, TIPOS_VIDEO } from './validacao'
import {
  Documento, Telefone, Pessoa, Estrela, Balanca, Passos, Sair, Externo, Mais, Lixeira,
  Cima, Baixo, Imagem, Video, Check, Voltar, Letra, Cadeado
} from './Icons'
import { APARENCIA, CONTATO } from './data'
import './Painel.css'

// pagina: o que a prévia abre primeiro. adicionar e campos: os nomes usados na lista dessa seção
const SECOES = [
  {
    id: 'conteudos',
    label: 'Publicações',
    Icone: Documento,
    pagina: 'conteudo',
    descricao: 'Seus artigos, fotos e vídeos. A primeira publicação da lista também aparece na página inicial.'
  },
  { id: 'contato', label: 'Formas de contato', Icone: Telefone, pagina: 'contato', descricao: 'WhatsApp, telefone, e-mail e Instagram que aparecem no site.' },
  { id: 'perfil', label: 'Sobre você', Icone: Pessoa, pagina: 'sobre', descricao: 'Seu nome, sua apresentação e sua foto.' },
  {
    id: 'destaques',
    label: 'Pontos ao lado da foto',
    Icone: Estrela,
    pagina: 'sobre',
    adicionar: 'Adicionar ponto',
    descricao: 'As frases curtas que aparecem ao lado da sua foto.'
  },
  {
    id: 'areas',
    label: 'Áreas de atuação',
    Icone: Balanca,
    pagina: 'atuacao',
    adicionar: 'Adicionar área',
    descricao: 'As áreas em que você trabalha, mostradas na página Atuação.'
  },
  {
    id: 'etapas',
    label: 'Etapas do atendimento',
    Icone: Passos,
    pagina: 'atuacao',
    adicionar: 'Adicionar etapa',
    descricao: 'O caminho do primeiro contato até o fim do caso, mostrado na página Atuação.'
  },
  {
    id: 'perguntas',
    label: 'Perguntas frequentes',
    Icone: Documento,
    pagina: 'perguntas',
    adicionar: 'Adicionar pergunta',
    campos: ['Pergunta', 'Resposta'],
    descricao: 'As perguntas e respostas mostradas na página Perguntas frequentes.'
  },
  { id: 'aparencia', label: 'Letras do site', Icone: Letra, pagina: 'sobre', descricao: 'Tipo e tamanho das letras nas páginas internas. A página inicial não muda.' },
  { id: 'conta', label: 'Minha conta', Icone: Cadeado, descricao: 'Sua senha e seu e-mail de acesso.' }
]

const PAGINAS = [
  ['', 'Página inicial'],
  ['sobre', 'Sobre'],
  ['conteudo', 'Conteúdo'],
  ['atuacao', 'Atuação'],
  ['contato', 'Contato'],
  ['perguntas', 'Perguntas frequentes']
]

const FONTES_TEXTO = [
  ['Source Sans 3', 'Source Sans (a atual)'],
  ['Lato', 'Lato'],
  ['Nunito Sans', 'Nunito Sans'],
  ['Atkinson Hyperlegible', 'Atkinson (feita para baixa visão)']
]
const FONTES_TITULO = [
  ['Georgia', 'Georgia (a atual)'],
  ['EB Garamond', 'EB Garamond'],
  ['Libre Baskerville', 'Libre Baskerville'],
  ['Lora', 'Lora']
]
const DESTAQUES_TEXTO = [
  ['negrito', 'Negrito claro (o atual)'],
  ['dourado', 'Dourado'],
  ['marca', 'Negrito com marca dourada'],
  ['nenhum', 'Sem destaque']
]

export default function Painel() {
  const [sessao, setSessao] = useState(undefined)
  const [recuperando, setRecuperando] = useState(veioDeRecuperacao)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      setSessao(s)
      if (evento === 'PASSWORD_RECOVERY') setRecuperando(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) return <NaoConfigurado />
  if (sessao === undefined) return <TelaCentral><p className="adm-muted">Carregando…</p></TelaCentral>
  if (recuperando) return <NovaSenha aoConcluir={() => setRecuperando(false)} />
  if (!sessao) return <Login />
  return <Editor usuario={sessao.user} />
}

function TelaCentral({ children }) {
  return <main className="adm-auth">{children}</main>
}

function Marca() {
  return (
    <div className="adm-marca">
      <span className="adm-mark" />
      <div>
        <strong>Heloisa Máximo</strong>
        <small>Painel do site</small>
      </div>
    </div>
  )
}

function NaoConfigurado() {
  return (
    <TelaCentral>
      <div className="adm-auth-card">
        <Marca />
        <h1>Painel indisponível</h1>
        <p className="adm-muted">Fale com quem cuida do site.</p>
      </div>
    </TelaCentral>
  )
}

function mensagemDeErro(error) {
  // Mesma resposta para senha errada e conta sem confirmar: o erro não revela quais e-mails existem
  if (error.code === 'invalid_credentials' || error.code === 'email_not_confirmed') return 'E-mail ou senha incorretos.'
  if (error.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (!error.status) return 'Não foi possível conectar. Confira sua internet e tente de novo.'
  return 'Não foi possível entrar agora. Tente de novo em alguns minutos.'
}

// shortcut: trava só desta aba, para evitar erro de digitação em série; o limite real é o do Supabase
const LIMITE_TENTATIVAS = 5
const ESPERA_TENTATIVAS = 60000

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)
  const falhas = useRef(0)
  const liberadoEm = useRef(0)

  const entrar = async (e) => {
    e.preventDefault()
    if (Date.now() < liberadoEm.current) {
      setErro('Muitas tentativas. Aguarde um minuto e tente de novo.')
      return
    }
    setEnviando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setEnviando(false)
    if (!error) return
    setErro(mensagemDeErro(error))
    falhas.current += 1
    if (falhas.current >= LIMITE_TENTATIVAS) {
      falhas.current = 0
      liberadoEm.current = Date.now() + ESPERA_TENTATIVAS
    }
  }

  const esqueci = async () => {
    setAviso('')
    if (!email) {
      setErro('Digite seu e-mail acima para receber o link de nova senha.')
      return
    }
    setEnviando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
    setEnviando(false)
    if (error) setErro('Não foi possível enviar o e-mail agora.')
    else {
      setErro('')
      setAviso('Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.')
    }
  }

  return (
    <TelaCentral>
      <form className="adm-auth-card" onSubmit={entrar}>
        <Marca />
        <div>
          <h1>Entrar</h1>
          <p className="adm-muted">Área para você mudar os textos e as fotos do site.</p>
        </div>
        <Campo label="E-mail" type="email" autoComplete="username" valor={email} mudar={setEmail} required />
        <Campo label="Senha" type="password" autoComplete="current-password" valor={senha} mudar={setSenha} required />
        {erro && <p className="adm-alerta adm-alerta-erro">{erro}</p>}
        {aviso && <p className="adm-alerta adm-alerta-ok">{aviso}</p>}
        <button className="adm-btn adm-btn-primario adm-btn-cheio" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="adm-btn-texto" onClick={esqueci} disabled={enviando}>Esqueci minha senha</button>
      </form>
    </TelaCentral>
  )
}

function NovaSenha({ aoConcluir }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const salvar = async (e) => {
    e.preventDefault()
    if (senha.length < 12) {
      setErro('A senha precisa ter pelo menos 12 caracteres.')
      return
    }
    setEnviando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setEnviando(false)
    if (error) setErro('Não foi possível trocar a senha. Peça um novo link.')
    else {
      window.history.replaceState(null, '', '/painel')
      aoConcluir()
    }
  }

  return (
    <TelaCentral>
      <form className="adm-auth-card" onSubmit={salvar}>
        <Marca />
        <div>
          <h1>Criar nova senha</h1>
          <p className="adm-muted">Use pelo menos 12 caracteres.</p>
        </div>
        <Campo label="Nova senha" type="password" autoComplete="new-password" valor={senha} mudar={setSenha} required />
        {erro && <p className="adm-alerta adm-alerta-erro">{erro}</p>}
        <button className="adm-btn adm-btn-primario adm-btn-cheio" disabled={enviando}>Salvar senha</button>
      </form>
    </TelaCentral>
  )
}

function copiar({ perfil, contato, destaques, areas, etapas, conteudos, aparencia, perguntas }) {
  return JSON.parse(JSON.stringify({ perfil, contato, destaques, areas, etapas, conteudos, aparencia, perguntas }))
}

function Editor({ usuario }) {
  const site = useSite()
  const { email } = usuario
  const [rascunho, setRascunho] = useState(() => copiar(site))
  const [secao, setSecao] = useState('conteudos')
  const [pendente, setPendente] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const [previa, setPrevia] = useState(false)

  // Quando o conteúdo do banco chega depois da abertura do painel, o rascunho acompanha
  useEffect(() => { setRascunho(copiar(site)) }, [site])

  useEffect(() => {
    if (!pendente) return
    const avisar = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [pendente])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), 3500)
    return () => clearTimeout(t)
  }, [aviso])

  const alterar = (chave, valor) => {
    setRascunho((r) => ({ ...r, [chave]: valor }))
    setPendente(true)
  }

  const salvar = async () => {
    const problema = validarConteudo(rascunho)
    if (problema) {
      setPrevia(false)
      setAviso({ tipo: 'erro', texto: problema })
      return
    }
    setSalvando(true)
    const { error } = await supabase.from('site').upsert({ id: 1, dados: rascunho })
    setSalvando(false)
    if (error) {
      setAviso({ tipo: 'erro', texto: 'Não foi possível publicar. Confira sua internet e tente de novo.' })
      return
    }
    site.atualizar(rascunho)
    setPendente(false)
    setPrevia(false)
    setAviso({ tipo: 'ok', texto: 'Pronto! Suas mudanças já estão no site.' })
  }

  const descartar = () => {
    if (!window.confirm('Desfazer tudo o que você mudou e ainda não publicou?')) return
    setRascunho(copiar(site))
    setPendente(false)
  }

  const abrirPrevia = () => {
    window.rascunhoDoPainel = rascunho
    setPrevia(true)
  }

  const atual = SECOES.find((s) => s.id === secao)
  const contagem = (id) => (Array.isArray(rascunho[id]) ? rascunho[id].length : null)

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <Marca />
        <label className="adm-campo adm-nav-curto">
          <span className="adm-rotulo">O que você quer mudar?</span>
          <select value={secao} onChange={(e) => setSecao(e.target.value)}>
            {SECOES.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <nav className="adm-nav">
          {SECOES.map(({ id, label, Icone }) => (
            <button key={id} className={secao === id ? 'is-active' : ''} onClick={() => setSecao(id)}>
              <Icone />
              <span>{label}</span>
              {contagem(id) !== null && <em>{contagem(id)}</em>}
            </button>
          ))}
        </nav>
        <div className="adm-side-rodape">
          <a className="adm-side-link" href="/" target="_blank" rel="noreferrer">
            <Externo /> Ver site
          </a>
          <div className="adm-usuario">
            <span className="adm-mark" />
            <span className="adm-usuario-email" title={email}>{email}</span>
          </div>
          <button className="adm-side-link" onClick={() => supabase.auth.signOut()}>
            <Sair /> Sair
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-head">
          <div>
            <h1>{atual.label}</h1>
            <p>{atual.descricao}</p>
          </div>
          {secao !== 'conta' && <div className="adm-head-acoes">
            <span className={`adm-status ${pendente ? 'is-pendente' : ''}`}>
              {pendente ? 'Mudanças ainda não publicadas' : <><Check width={14} height={14} /> Tudo publicado</>}
            </span>
            {pendente && <button className="adm-btn" onClick={descartar}>Desfazer</button>}
            <button className="adm-btn" onClick={abrirPrevia}>Ver como vai ficar</button>
            <button className="adm-btn adm-btn-primario" onClick={salvar} disabled={!pendente || salvando}>
              {salvando ? 'Publicando…' : 'Publicar no site'}
            </button>
          </div>}
        </header>

        {secao !== 'conta' && (
          <ol className="adm-passos">
            <li>Escolha no menu o que quer mudar</li>
            <li>Clique em Ver como vai ficar</li>
            <li>Se gostou, clique em Publicar no site</li>
          </ol>
        )}

        <div className="adm-corpo">
          {secao === 'conta' && <Conta usuario={usuario} />}
          {secao === 'conteudos' && <Publicacoes lista={rascunho.conteudos} mudar={(v) => alterar('conteudos', v)} />}
          {secao === 'contato' && <Contato contato={rascunho.contato} mudar={(v) => alterar('contato', v)} />}
          {secao === 'perfil' && <Perfil perfil={rascunho.perfil} mudar={(v) => alterar('perfil', v)} />}
          {secao === 'aparencia' && <Aparencia aparencia={rascunho.aparencia} mudar={(v) => alterar('aparencia', v)} />}
          {['destaques', 'areas', 'etapas', 'perguntas'].includes(secao) && (
            <ListaSimples key={secao} secao={atual} lista={rascunho[secao]} mudar={(v) => alterar(secao, v)} />
          )}
        </div>
      </main>

      {previa && (
        <Previa
          inicial={atual.pagina}
          pendente={pendente}
          salvando={salvando}
          publicar={salvar}
          fechar={() => setPrevia(false)}
        />
      )}

      {aviso && <div className={`adm-toast adm-toast-${aviso.tipo}`} role="status">{aviso.texto}</div>}
    </div>
  )
}

// O site de verdade, dentro de um quadro, lendo o rascunho em vez do que está publicado
function Previa({ inicial, pendente, salvando, publicar, fechar }) {
  const [pagina, setPagina] = useState(inicial)
  const [aparelho, setAparelho] = useState('computador')

  return (
    <div className="adm-tela-previa" role="dialog" aria-modal="true" aria-label="Prévia do site">
      <header>
        <button className="adm-btn" onClick={fechar}><Voltar width={16} height={16} /> Voltar a editar</button>
        <label className="adm-campo adm-previa-pagina">
          <span className="adm-rotulo">Página</span>
          <select value={pagina} onChange={(e) => setPagina(e.target.value)}>
            {PAGINAS.map(([v, nome]) => <option key={v} value={v}>{nome}</option>)}
          </select>
        </label>
        <div className="adm-segmentos adm-segmentos-dois" role="radiogroup" aria-label="Tamanho da tela">
          {[['computador', 'Computador'], ['celular', 'Celular']].map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={aparelho === valor}
              className={aparelho === valor ? 'is-active' : ''}
              onClick={() => setAparelho(valor)}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <button className="adm-btn adm-btn-primario" onClick={publicar} disabled={!pendente || salvando}>
          {salvando ? 'Publicando…' : 'Publicar no site'}
        </button>
      </header>
      <p>
        {pendente
          ? 'Isto é só uma prévia. Quem visita o site ainda não vê estas mudanças.'
          : 'Você ainda não mudou nada. O site está assim agora.'}
      </p>
      <iframe src={`/${pagina}?previa=1`} title="Prévia do site" className={`is-${aparelho}`} />
    </div>
  )
}

function Campo({ label, valor, mudar, longo, dica, ...resto }) {
  return (
    <label className="adm-campo">
      <span className="adm-rotulo">{label}</span>
      {longo
        ? <textarea value={valor} onChange={(e) => mudar(e.target.value)} rows={longo} {...resto} />
        : <input value={valor} onChange={(e) => mudar(e.target.value)} {...resto} />}
      {dica && <small>{dica}</small>}
    </label>
  )
}

function Bloco({ titulo, descricao, children }) {
  return (
    <section className="adm-bloco">
      {(titulo || descricao) && (
        <header>
          {titulo && <h2>{titulo}</h2>}
          {descricao && <p>{descricao}</p>}
        </header>
      )}
      <div className="adm-bloco-campos">{children}</div>
    </section>
  )
}

function Arquivo({ label, valor, mudar, aceita, redondo }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const video = aceita.startsWith('video')

  const enviar = async (e) => {
    const arquivo = e.target.files[0]
    e.target.value = ''
    if (!arquivo) return
    const problema = validarArquivo(arquivo, video)
    if (problema) {
      setErro(problema)
      return
    }
    setEnviando(true)
    setErro('')
    const nome = `${Date.now()}-${arquivo.name.normalize('NFD').replace(/[^\w.-]/g, '')}`
    const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivo)
    setEnviando(false)
    if (error) {
      setErro('Não foi possível enviar o arquivo. Tente de novo.')
      return
    }
    mudar(supabase.storage.from(BUCKET).getPublicUrl(nome).data.publicUrl)
  }

  return (
    <div className="adm-campo">
      {label && <span className="adm-rotulo">{label}</span>}
      <div className={`adm-upload ${valor ? 'tem-arquivo' : ''} ${redondo ? 'is-redondo' : ''}`}>
        {valor && (video
          ? <video src={valor} controls preload="metadata" />
          : <img src={valor} alt="" />)}
        {!valor && (
          <label className="adm-upload-vazio">
            {video ? <Video /> : <Imagem />}
            <strong>{enviando ? 'Enviando…' : `Escolher ${video ? 'vídeo' : 'foto'}`}</strong>
            <small>{video ? 'Formato MP4, até 50 MB' : 'Clique para escolher no seu aparelho'}</small>
            <input type="file" accept={aceita} onChange={enviar} disabled={enviando} />
          </label>
        )}
      </div>
      {valor && (
        <div className="adm-upload-acoes">
          <label className="adm-btn adm-btn-pequeno">
            {enviando ? 'Enviando…' : 'Trocar'}
            <input type="file" accept={aceita} onChange={enviar} disabled={enviando} />
          </label>
          <button type="button" className="adm-btn adm-btn-pequeno adm-btn-perigo" onClick={() => mudar('')}>Remover</button>
        </div>
      )}
      {erro && <small className="adm-texto-erro">{erro}</small>}
    </div>
  )
}

function Aparencia({ aparencia, mudar }) {
  const campo = (chave) => (v) => mudar({ ...aparencia, [chave]: v })
  const amostra = {
    fontFamily: `'${aparencia.fonte}', sans-serif`,
    fontSize: `${1.1875 * aparencia.tamanho}rem`
  }
  const titulo = {
    fontFamily: `'${aparencia.titulo}', serif`,
    fontSize: `${2.25 * aparencia.tamanhoTitulo}rem`
  }
  return (
    <div className="adm-pilha">
      <Bloco titulo="Tipo de letra">
        <div className="adm-dupla">
          <Opcoes label="Letra dos textos" valor={aparencia.fonte} mudar={campo('fonte')} opcoes={FONTES_TEXTO} />
          <Opcoes label="Letra dos títulos" valor={aparencia.titulo} mudar={campo('titulo')} opcoes={FONTES_TITULO} />
        </div>
      </Bloco>
      <Bloco titulo="Tamanho das letras" descricao="Arraste para aumentar ou diminuir. Os textos não ficam menores que o atual, para continuarem fáceis de ler.">
        <div className="adm-dupla">
          <Faixa label="Tamanho do texto" valor={aparencia.tamanho} mudar={campo('tamanho')} min={1} max={1.3} />
          <Faixa label="Tamanho dos títulos" valor={aparencia.tamanhoTitulo} mudar={campo('tamanhoTitulo')} min={0.8} max={1.2} />
        </div>
      </Bloco>
      <Bloco titulo="Palavras importantes" descricao="Como as palavras importantes aparecem no meio dos textos.">
        <Opcoes label="Estilo" valor={aparencia.destaque} mudar={campo('destaque')} opcoes={DESTAQUES_TEXTO} />
      </Bloco>
      <Bloco titulo="Amostra">
        <div className="adm-previa" data-destaque={aparencia.destaque}>
          <p style={titulo}>Cada hora conta.</p>
          <p style={amostra}>
            Fale diretamente com a advogada, com <strong className="realce">sigilo absoluto</strong>.
            Atendimento em <strong className="realce">Plantão 24h</strong> para urgências.
          </p>
        </div>
        <button className="adm-btn adm-btn-pequeno adm-btn-auto" onClick={() => mudar({ ...APARENCIA })}>
          Voltar ao que era antes
        </button>
      </Bloco>
    </div>
  )
}

function Opcoes({ label, valor, mudar, opcoes }) {
  return (
    <label className="adm-campo">
      <span className="adm-rotulo">{label}</span>
      <select value={valor} onChange={(e) => mudar(e.target.value)}>
        {opcoes.map(([v, nome]) => <option key={v} value={v}>{nome}</option>)}
      </select>
    </label>
  )
}

function Faixa({ label, valor, mudar, min, max }) {
  return (
    <label className="adm-campo">
      <span className="adm-rotulo">{label}: {Math.round(valor * 100)}%</span>
      <input type="range" min={min} max={max} step={0.05} value={valor} onChange={(e) => mudar(Number(e.target.value))} />
    </label>
  )
}

function erroDaConta(error) {
  if (error.code === 'email_exists') return 'Esse e-mail já está em uso em outra conta.'
  if (error.code === 'same_password') return 'A nova senha precisa ser diferente da atual.'
  if (error.code === 'weak_password') return 'Essa senha é fácil de adivinhar. Escolha outra.'
  if (error.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (!error.status) return 'Não foi possível conectar. Confira sua internet e tente de novo.'
  return 'Não foi possível salvar agora. Tente de novo em alguns minutos.'
}

const TROCAS = {
  senha: { label: 'Nova senha', type: 'password', autoComplete: 'new-password', dica: 'Use pelo menos 12 caracteres.' },
  email: { label: 'Novo e-mail', type: 'email', autoComplete: 'email' }
}

function Conta({ usuario }) {
  const [troca, setTroca] = useState('senha')
  const [atual, setAtual] = useState('')
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [enviando, setEnviando] = useState(false)

  const escolher = (opcao) => {
    setTroca(opcao)
    setValor('')
    setErro('')
    setOk('')
  }

  const salvar = async (e) => {
    e.preventDefault()
    setErro('')
    setOk('')
    if (troca === 'senha' && valor.length < 12) return setErro('A senha precisa ter pelo menos 12 caracteres.')

    setEnviando(true)
    // Pede a senha de novo: um computador esquecido aberto não entrega o acesso a outra pessoa
    const { error: semAcesso } = await supabase.auth.signInWithPassword({ email: usuario.email, password: atual })
    if (semAcesso) {
      setEnviando(false)
      return setErro(semAcesso.code === 'invalid_credentials' ? 'A senha atual está incorreta.' : mensagemDeErro(semAcesso))
    }
    const { data, error } = await supabase.auth.updateUser(troca === 'senha' ? { password: valor } : { email: valor })
    setEnviando(false)
    if (error) return setErro(erroDaConta(error))

    setAtual('')
    setValor('')
    if (troca === 'senha') setOk('Senha trocada.')
    else if (data.user.email === valor.toLowerCase()) setOk('E-mail trocado. Use o novo para entrar.')
    else setOk('Enviamos um link de confirmação. O e-mail só muda depois que você confirmar.')
  }

  return (
    <div className="adm-pilha">
      <Bloco titulo="Seus dados de acesso">
        <p className="adm-muted">E-mail: {usuario.email}</p>
      </Bloco>
      <Bloco titulo="Fazer uma troca">
        <form className="adm-pilha" onSubmit={salvar}>
          <label className="adm-campo">
            <span className="adm-rotulo">O que você quer trocar?</span>
            <select value={troca} onChange={(e) => escolher(e.target.value)}>
              <option value="senha">Senha</option>
              <option value="email">E-mail de acesso</option>
            </select>
          </label>
          <Campo key={troca} {...TROCAS[troca]} valor={valor} mudar={setValor} required />
          <Campo label="Senha atual" type="password" autoComplete="current-password" valor={atual} mudar={setAtual} required dica="Se não lembrar, saia do painel e use Esqueci minha senha." />
          {erro && <p className="adm-alerta adm-alerta-erro" role="alert">{erro}</p>}
          {ok && <p className="adm-alerta adm-alerta-ok" role="status">{ok}</p>}
          <button className="adm-btn adm-btn-primario adm-btn-auto" disabled={enviando}>{enviando ? 'Salvando…' : 'Salvar troca'}</button>
        </form>
      </Bloco>
    </div>
  )
}

function Contato({ contato, mudar }) {
  const campo = (chave) => (v) => mudar({ ...contato, [chave]: v })
  return (
    <div className="adm-pilha">
      <Bloco titulo="WhatsApp" descricao="Para onde vão os botões “Falar no WhatsApp” e a análise do caso.">
        <Campo
          label="Número do WhatsApp"
          valor={contato.whatsapp}
          mudar={campo('whatsapp')}
          dica="Digite com DDD, por exemplo: 79 99999-9999."
        />
        {!aceitaMensagem(contato.whatsapp) && (
          <p className="adm-alerta adm-alerta-erro">
            Este link não leva a mensagem automática nem as respostas da análise do caso. Digite aqui o número com DDD.
          </p>
        )}
        {contato.whatsapp && (
          <a className="adm-btn adm-btn-pequeno adm-btn-auto" href={linkWhatsApp(contato.whatsapp, contato.mensagem)} target="_blank" rel="noreferrer">
            <Externo width={14} height={14} /> Testar se abre o WhatsApp
          </a>
        )}
      </Bloco>
      <Bloco
        titulo="Mensagem automática do WhatsApp"
        descricao="O texto que já aparece escrito quando a pessoa abre a conversa. Ela ainda pode mudar antes de enviar."
      >
        <Campo
          label="Nos botões do WhatsApp"
          valor={contato.mensagem ?? CONTATO.mensagem}
          mudar={campo('mensagem')}
          longo={3}
          dica="Se deixar em branco, volta a mensagem original."
        />
        <Campo
          label="Na análise do caso"
          valor={contato.mensagemAnalise ?? CONTATO.mensagemAnalise}
          mudar={campo('mensagemAnalise')}
          longo={5}
          dica="As respostas da pessoa entram sozinhas depois deste texto."
        />
      </Bloco>
      <Bloco titulo="Telefone e e-mail" descricao="Aparecem na página Contato. Se deixar em branco, não aparecem.">
        <div className="adm-dupla">
          <Campo label="Telefone" valor={contato.telefone || ''} mudar={campo('telefone')} placeholder="(79) 99999-9999" />
          <Campo label="E-mail" type="email" valor={contato.email || ''} mudar={campo('email')} />
        </div>
      </Bloco>
      <Bloco titulo="Instagram">
        <div className="adm-dupla">
          <Campo label="Link do perfil" valor={contato.instagram} mudar={campo('instagram')} dica="Copie o endereço da sua página no Instagram e cole aqui." />
          <Campo label="Nome no Instagram" valor={contato.instagramUser} mudar={campo('instagramUser')} dica="Ex.: @advheloisamaximo" />
        </div>
      </Bloco>
    </div>
  )
}

function Perfil({ perfil, mudar }) {
  const campo = (chave) => (v) => mudar({ ...perfil, [chave]: v })
  return (
    <div className="adm-colunas">
      <div className="adm-pilha">
        <Bloco titulo="Apresentação">
          <Campo label="Nome" valor={perfil.nome} mudar={campo('nome')} />
          <Campo label="Profissão" valor={perfil.titulo} mudar={campo('titulo')} dica="Por exemplo: Advogada Criminalista." />
          <Campo label="Frase de apresentação" valor={perfil.slogan} mudar={campo('slogan')} dica="Uma frase curta que aparece na página inicial." />
        </Bloco>
        <Bloco titulo="Onde e com o que você trabalha">
          <div className="adm-dupla">
            <Campo label="Área principal" valor={perfil.especialidade} mudar={campo('especialidade')} />
            <Campo label="Cidade ou estado" valor={perfil.local} mudar={campo('local')} />
          </div>
        </Bloco>
        <Bloco titulo="OAB e formação">
          <div className="adm-dupla">
            <Campo label="Número da OAB" valor={perfil.oab} mudar={campo('oab')} placeholder="OAB/SE 0000" />
            <Campo label="Formação" valor={perfil.formacao} mudar={campo('formacao')} dica="Se deixar em branco, não aparece no site." />
          </div>
        </Bloco>
      </div>
      <div className="adm-pilha">
        <Bloco titulo="Sua foto">
          <Arquivo valor={perfil.foto} mudar={campo('foto')} aceita={TIPOS_IMAGEM} redondo />
        </Bloco>
        <Bloco titulo="Foto do WhatsApp" descricao="Aparece na conversa da análise do caso. Sem ela, entra a sua foto principal.">
          <Arquivo valor={perfil.fotoWhatsapp} mudar={campo('fotoWhatsapp')} aceita={TIPOS_IMAGEM} redondo />
        </Bloco>
      </div>
    </div>
  )
}

function mover(lista, de, para) {
  const nova = [...lista]
  ;[nova[de], nova[para]] = [nova[para], nova[de]]
  return nova
}

function Ordenar({ i, total, aoMover }) {
  return (
    <div className="adm-ordenar">
      <button type="button" className="adm-icone" onClick={() => aoMover(i - 1)} disabled={i === 0} aria-label="Subir na lista" title="Subir na lista"><Cima /></button>
      <button type="button" className="adm-icone" onClick={() => aoMover(i + 1)} disabled={i === total - 1} aria-label="Descer na lista" title="Descer na lista"><Baixo /></button>
    </div>
  )
}

function ListaSimples({ secao, lista, mudar }) {
  const [rotuloTitulo, rotuloTexto] = secao.campos || ['Título', 'Texto']
  const editar = (i, chave, v) => mudar(lista.map((item, n) => (n === i ? { ...item, [chave]: v } : item)))
  const remover = (i) => {
    if (window.confirm('Apagar este item? Ele só sai do site quando você publicar.')) mudar(lista.filter((_, n) => n !== i))
  }

  return (
    <div className="adm-pilha">
      {lista.map((item, i) => (
        <div className="adm-item" key={i}>
          <span className="adm-item-num">{String(i + 1).padStart(2, '0')}</span>
          <div className="adm-item-campos">
            <Campo label={rotuloTitulo} valor={item.titulo} mudar={(v) => editar(i, 'titulo', v)} />
            <Campo label={rotuloTexto} valor={item.texto} mudar={(v) => editar(i, 'texto', v)} longo={2} />
          </div>
          <div className="adm-item-acoes">
            <Ordenar i={i} total={lista.length} aoMover={(para) => mudar(mover(lista, i, para))} />
            <button type="button" className="adm-icone adm-icone-perigo" onClick={() => remover(i)} aria-label="Apagar" title="Apagar"><Lixeira /></button>
          </div>
        </div>
      ))}
      <button className="adm-adicionar" onClick={() => mudar([...lista, { titulo: '', texto: '' }])}>
        <Mais /> {secao.adicionar}
      </button>
    </div>
  )
}

function Publicacoes({ lista, mudar }) {
  const [aberta, setAberta] = useState(null)

  const nova = () => {
    mudar([{ id: `pub-${Date.now()}`, categoria: '', data: '', titulo: '', resumo: '', texto: [''] }, ...lista])
    setAberta(0)
  }

  if (aberta !== null && lista[aberta]) {
    return (
      <EditarPublicacao
        pub={lista[aberta]}
        naHome={aberta === 0}
        mudar={(mudancas) => mudar(lista.map((item, n) => (n === aberta ? { ...item, ...mudancas } : item)))}
        excluir={() => {
          if (!window.confirm('Apagar esta publicação? Ela só sai do site quando você publicar.')) return
          mudar(lista.filter((_, n) => n !== aberta))
          setAberta(null)
        }}
        voltar={() => setAberta(null)}
      />
    )
  }

  return (
    <div className="adm-pilha">
      <div className="adm-barra">
        <span className="adm-muted">{lista.length} {lista.length === 1 ? 'publicação' : 'publicações'}</span>
        <button className="adm-btn adm-btn-primario" onClick={nova}><Mais width={16} height={16} /> Escrever nova publicação</button>
      </div>

      {lista.length === 0 && (
        <div className="adm-vazio">
          <Documento />
          <p>Nenhuma publicação ainda.</p>
        </div>
      )}

      <ul className="adm-pubs">
        {lista.map((c, i) => {
          const capa = c.imagem || c.poster
          return (
            <li key={c.id} className="adm-pub">
              <button className="adm-pub-abrir" onClick={() => setAberta(i)}>
                <span className="adm-pub-capa">
                  {capa ? <img src={capa} alt="" /> : c.video ? <Video /> : <Documento />}
                </span>
                <span className="adm-pub-info">
                  <strong>{c.titulo || 'Sem título'}</strong>
                  <span>
                    {[c.categoria, c.data].filter(Boolean).join(' · ') || 'Sem categoria'}
                    {c.video && ' · vídeo'}
                  </span>
                </span>
                {i === 0 && <span className="adm-selo">Na página inicial</span>}
              </button>
              <Ordenar i={i} total={lista.length} aoMover={(para) => mudar(mover(lista, i, para))} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function EditarPublicacao({ pub, naHome, mudar, excluir, voltar }) {
  const [tipo, setTipo] = useState(pub.video ? 'video' : pub.imagem ? 'imagem' : 'nenhuma')

  const trocarMidia = (novo) => {
    if (novo === tipo) return
    setTipo(novo)
    mudar({ imagem: '', imagemAlt: '', video: '', poster: '' })
  }

  return (
    <div className="adm-pilha">
      <button className="adm-voltar" onClick={voltar}><Voltar /> Todas as publicações</button>

      <div className="adm-colunas">
        <Bloco>
          <Campo label="Título" valor={pub.titulo} mudar={(v) => mudar({ titulo: v })} placeholder="Título da publicação" />
          <Campo
            label="Resumo curto"
            valor={pub.resumo}
            mudar={(v) => mudar({ resumo: v })}
            longo={2}
            dica="Uma ou duas frases contando do que se trata."
          />
          <Campo
            label="Texto completo"
            valor={(pub.texto || []).join('\n\n')}
            mudar={(v) => mudar({ texto: v.split(/\n\s*\n/) })}
            longo={12}
            dica="Para começar um novo parágrafo, deixe uma linha em branco."
          />
        </Bloco>

        <div className="adm-pilha">
          <Bloco titulo="Informações">
            <Campo label="Categoria" valor={pub.categoria} mudar={(v) => mudar({ categoria: v })} placeholder="Atuação, Palestra…" />
            <Campo label="Data" valor={pub.data || ''} mudar={(v) => mudar({ data: v })} placeholder="Abril de 2026" />
            {naHome && <p className="adm-nota">Esta publicação aparece na página inicial porque é a primeira da lista.</p>}
          </Bloco>

          <Bloco titulo="Foto ou vídeo">
            <div className="adm-segmentos" role="radiogroup" aria-label="Foto ou vídeo da publicação">
              {[['nenhuma', 'Só texto'], ['imagem', 'Foto'], ['video', 'Vídeo']].map(([valor, rotulo]) => (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={tipo === valor}
                  className={tipo === valor ? 'is-active' : ''}
                  onClick={() => trocarMidia(valor)}
                >
                  {rotulo}
                </button>
              ))}
            </div>
            {tipo === 'imagem' && (
              <>
                <Arquivo valor={pub.imagem || ''} mudar={(v) => mudar({ imagem: v })} aceita={TIPOS_IMAGEM} />
                <Campo label="O que aparece na foto" valor={pub.imagemAlt || ''} mudar={(v) => mudar({ imagemAlt: v })} dica="Descreva em uma frase. Pessoas cegas ouvem esse texto no celular ou computador." />
              </>
            )}
            {tipo === 'video' && (
              <>
                <Arquivo valor={pub.video || ''} mudar={(v) => mudar({ video: v })} aceita={TIPOS_VIDEO} />
                <Arquivo label="Foto de capa do vídeo (não é obrigatória)" valor={pub.poster || ''} mudar={(v) => mudar({ poster: v })} aceita={TIPOS_IMAGEM} />
              </>
            )}
          </Bloco>

          <button className="adm-btn adm-btn-perigo adm-btn-cheio" onClick={excluir}>
            <Lixeira width={16} height={16} /> Apagar publicação
          </button>
        </div>
      </div>
    </div>
  )
}
