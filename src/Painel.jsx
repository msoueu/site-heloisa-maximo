import { useEffect, useState } from 'react'
import { supabase, useSite, BUCKET, veioDeRecuperacao, linkWhatsApp } from './SiteData'
import {
  Documento, Telefone, Pessoa, Estrela, Balanca, Passos, Sair, Externo, Mais, Lixeira,
  Cima, Baixo, Imagem, Video, Check, Voltar
} from './Icons'
import './Painel.css'

const SECOES = [
  {
    id: 'conteudos',
    label: 'Publicações',
    Icone: Documento,
    descricao: 'Textos, fotos e vídeos da página Conteúdo jurídico. A primeira da lista também aparece na página inicial.'
  },
  { id: 'contato', label: 'Contato', Icone: Telefone, descricao: 'Como os visitantes falam com você.' },
  { id: 'perfil', label: 'Perfil', Icone: Pessoa, descricao: 'Seu nome, sua apresentação e sua foto.' },
  { id: 'destaques', label: 'Destaques', Icone: Estrela, descricao: 'Os pontos que aparecem ao lado da sua foto.' },
  { id: 'areas', label: 'Áreas de atuação', Icone: Balanca, descricao: 'As áreas listadas na página inicial e na página Sobre.' },
  { id: 'etapas', label: 'Como funciona', Icone: Passos, descricao: 'As etapas do atendimento, na página Sobre.' }
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
  return <Editor email={sessao.user.email} />
}

function TelaCentral({ children }) {
  return <main className="adm-auth">{children}</main>
}

function Marca() {
  return (
    <div className="adm-marca">
      <span className="adm-mark">HM</span>
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
        <h1>Painel não configurado</h1>
        <p className="adm-muted">
          Cadastre <code>REACT_APP_SUPABASE_URL</code> e <code>REACT_APP_SUPABASE_ANON_KEY</code> e
          publique de novo. O passo a passo está em <code>supabase/LEIA-ME.md</code>.
        </p>
      </div>
    </TelaCentral>
  )
}

function mensagemDeErro(error) {
  if (error.code === 'invalid_credentials') return 'E-mail ou senha incorretos.'
  if (error.code === 'email_not_confirmed') {
    return 'Este e-mail ainda não foi confirmado. No Supabase, recrie o usuário marcando Auto Confirm User.'
  }
  if (error.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (!error.status) return 'Não foi possível conectar ao Supabase. Confira as variáveis na Vercel e faça Redeploy.'
  return `Erro ao entrar: ${error.message}`
}

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setEnviando(false)
    if (error) setErro(mensagemDeErro(error))
  }

  const esqueci = async () => {
    setAviso('')
    if (!email) {
      setErro('Digite seu e-mail acima para receber o link de nova senha.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
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
          <p className="adm-muted">Acesso restrito para edição do site.</p>
        </div>
        <Campo label="E-mail" type="email" autoComplete="username" valor={email} mudar={setEmail} required />
        <Campo label="Senha" type="password" autoComplete="current-password" valor={senha} mudar={setSenha} required />
        {erro && <p className="adm-alerta adm-alerta-erro">{erro}</p>}
        {aviso && <p className="adm-alerta adm-alerta-ok">{aviso}</p>}
        <button className="adm-btn adm-btn-primario adm-btn-cheio" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="adm-btn-texto" onClick={esqueci}>Esqueci minha senha</button>
      </form>
    </TelaCentral>
  )
}

function NovaSenha({ aoConcluir }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const salvar = async (e) => {
    e.preventDefault()
    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) setErro('Não foi possível trocar a senha. Peça um novo link.')
    else {
      window.history.replaceState(null, '', '/#/painel')
      aoConcluir()
    }
  }

  return (
    <TelaCentral>
      <form className="adm-auth-card" onSubmit={salvar}>
        <Marca />
        <div>
          <h1>Criar nova senha</h1>
          <p className="adm-muted">Use pelo menos 8 caracteres.</p>
        </div>
        <Campo label="Nova senha" type="password" autoComplete="new-password" valor={senha} mudar={setSenha} required />
        {erro && <p className="adm-alerta adm-alerta-erro">{erro}</p>}
        <button className="adm-btn adm-btn-primario adm-btn-cheio">Salvar senha</button>
      </form>
    </TelaCentral>
  )
}

function copiar({ perfil, contato, destaques, areas, etapas, conteudos }) {
  return JSON.parse(JSON.stringify({ perfil, contato, destaques, areas, etapas, conteudos }))
}

function Editor({ email }) {
  const site = useSite()
  const [rascunho, setRascunho] = useState(() => copiar(site))
  const [secao, setSecao] = useState('conteudos')
  const [pendente, setPendente] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [aviso, setAviso] = useState(null)

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
    setSalvando(true)
    try {
      await site.salvar(rascunho)
      setPendente(false)
      setAviso({ tipo: 'ok', texto: 'Alterações publicadas no site.' })
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: `Não foi possível salvar: ${erro.message}` })
    }
    setSalvando(false)
  }

  const descartar = () => {
    if (!window.confirm('Descartar as alterações que ainda não foram salvas?')) return
    setRascunho(copiar(site))
    setPendente(false)
  }

  const atual = SECOES.find((s) => s.id === secao)
  const contagem = (id) => (Array.isArray(rascunho[id]) ? rascunho[id].length : null)

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <Marca />
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
          <a className="adm-side-link" href="#/" target="_blank" rel="noreferrer">
            <Externo /> Ver site
          </a>
          <div className="adm-usuario">
            <span className="adm-avatar">{email.slice(0, 1).toUpperCase()}</span>
            <span className="adm-usuario-email" title={email}>{email}</span>
            <button className="adm-icone" onClick={() => supabase.auth.signOut()} title="Sair" aria-label="Sair">
              <Sair />
            </button>
          </div>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-head">
          <div>
            <h1>{atual.label}</h1>
            <p>{atual.descricao}</p>
          </div>
          <div className="adm-head-acoes">
            <span className={`adm-status ${pendente ? 'is-pendente' : ''}`}>
              {pendente ? 'Alterações não salvas' : <><Check width={14} height={14} /> Tudo salvo</>}
            </span>
            {pendente && <button className="adm-btn" onClick={descartar}>Descartar</button>}
            <button className="adm-btn adm-btn-primario" onClick={salvar} disabled={!pendente || salvando}>
              {salvando ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        </header>

        <div className="adm-corpo">
          {secao === 'conteudos' && <Publicacoes lista={rascunho.conteudos} mudar={(v) => alterar('conteudos', v)} />}
          {secao === 'contato' && <Contato contato={rascunho.contato} mudar={(v) => alterar('contato', v)} />}
          {secao === 'perfil' && <Perfil perfil={rascunho.perfil} mudar={(v) => alterar('perfil', v)} />}
          {['destaques', 'areas', 'etapas'].includes(secao) && (
            <ListaSimples key={secao} lista={rascunho[secao]} mudar={(v) => alterar(secao, v)} />
          )}
        </div>
      </main>

      {aviso && <div className={`adm-toast adm-toast-${aviso.tipo}`} role="status">{aviso.texto}</div>}
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
    setEnviando(true)
    setErro('')
    const nome = `${Date.now()}-${arquivo.name.normalize('NFD').replace(/[^\w.-]/g, '')}`
    const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivo)
    setEnviando(false)
    if (error) {
      setErro(`Falha no envio: ${error.message}`)
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
            <strong>{enviando ? 'Enviando…' : `Enviar ${video ? 'vídeo' : 'imagem'}`}</strong>
            <small>{video ? 'MP4, até 50 MB' : 'JPG, PNG ou WEBP'}</small>
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

function Contato({ contato, mudar }) {
  const campo = (chave) => (v) => mudar({ ...contato, [chave]: v })
  return (
    <div className="adm-pilha">
      <Bloco titulo="WhatsApp" descricao="Usado nos botões “Agendar consulta” e “Falar no WhatsApp”.">
        <Campo
          label="Número ou link"
          valor={contato.whatsapp}
          mudar={campo('whatsapp')}
          dica="Digite o número com DDD, ex.: 79 99999-9999. Também aceita um link pronto do WhatsApp."
        />
        {contato.whatsapp && (
          <a className="adm-btn adm-btn-pequeno adm-btn-auto" href={linkWhatsApp(contato.whatsapp)} target="_blank" rel="noreferrer">
            <Externo width={14} height={14} /> Testar link
          </a>
        )}
      </Bloco>
      <Bloco titulo="Instagram">
        <div className="adm-dupla">
          <Campo label="Link do perfil" valor={contato.instagram} mudar={campo('instagram')} />
          <Campo label="Nome exibido" valor={contato.instagramUser} mudar={campo('instagramUser')} dica="Ex.: @advheloisamaximo" />
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
          <Campo label="Título" valor={perfil.titulo} mudar={campo('titulo')} />
          <Campo label="Frase de apresentação" valor={perfil.slogan} mudar={campo('slogan')} />
        </Bloco>
        <Bloco titulo="Atuação">
          <div className="adm-dupla">
            <Campo label="Especialidade" valor={perfil.especialidade} mudar={campo('especialidade')} />
            <Campo label="Local" valor={perfil.local} mudar={campo('local')} />
          </div>
        </Bloco>
        <Bloco titulo="Registro" descricao="Campos vazios não aparecem no site.">
          <div className="adm-dupla">
            <Campo label="OAB" valor={perfil.oab} mudar={campo('oab')} placeholder="OAB/SE 0000" />
            <Campo label="Formação" valor={perfil.formacao} mudar={campo('formacao')} />
          </div>
        </Bloco>
      </div>
      <Bloco titulo="Foto">
        <Arquivo valor={perfil.foto} mudar={campo('foto')} aceita="image/*" redondo />
      </Bloco>
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
      <button type="button" className="adm-icone" onClick={() => aoMover(i - 1)} disabled={i === 0} aria-label="Mover para cima"><Cima /></button>
      <button type="button" className="adm-icone" onClick={() => aoMover(i + 1)} disabled={i === total - 1} aria-label="Mover para baixo"><Baixo /></button>
    </div>
  )
}

function ListaSimples({ lista, mudar }) {
  const editar = (i, chave, v) => mudar(lista.map((item, n) => (n === i ? { ...item, [chave]: v } : item)))
  const remover = (i) => {
    if (window.confirm('Remover este item?')) mudar(lista.filter((_, n) => n !== i))
  }

  return (
    <div className="adm-pilha">
      {lista.map((item, i) => (
        <div className="adm-item" key={i}>
          <span className="adm-item-num">{String(i + 1).padStart(2, '0')}</span>
          <div className="adm-item-campos">
            <Campo label="Título" valor={item.titulo} mudar={(v) => editar(i, 'titulo', v)} />
            <Campo label="Texto" valor={item.texto} mudar={(v) => editar(i, 'texto', v)} longo={2} />
          </div>
          <div className="adm-item-acoes">
            <Ordenar i={i} total={lista.length} aoMover={(para) => mudar(mover(lista, i, para))} />
            <button type="button" className="adm-icone adm-icone-perigo" onClick={() => remover(i)} aria-label="Remover"><Lixeira /></button>
          </div>
        </div>
      ))}
      <button className="adm-adicionar" onClick={() => mudar([...lista, { titulo: '', texto: '' }])}>
        <Mais /> Adicionar item
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
          if (!window.confirm('Excluir esta publicação? Ela sai do site depois que você salvar.')) return
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
        <button className="adm-btn adm-btn-primario" onClick={nova}><Mais width={16} height={16} /> Nova publicação</button>
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
                {i === 0 && <span className="adm-selo">Página inicial</span>}
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
            label="Resumo"
            valor={pub.resumo}
            mudar={(v) => mudar({ resumo: v })}
            longo={2}
            dica={naHome ? 'Aparece na página inicial, abaixo do primeiro parágrafo.' : 'Uma ou duas frases sobre a publicação.'}
          />
          <Campo
            label="Texto completo"
            valor={(pub.texto || []).join('\n\n')}
            mudar={(v) => mudar({ texto: v.split(/\n\s*\n/) })}
            longo={12}
            dica="Deixe uma linha em branco entre os parágrafos."
          />
        </Bloco>

        <div className="adm-pilha">
          <Bloco titulo="Detalhes">
            <Campo label="Categoria" valor={pub.categoria} mudar={(v) => mudar({ categoria: v })} placeholder="Atuação, Palestra…" />
            <Campo label="Data" valor={pub.data || ''} mudar={(v) => mudar({ data: v })} placeholder="Abril de 2026" />
            {naHome && <p className="adm-nota">É a primeira da lista, por isso aparece na página inicial.</p>}
          </Bloco>

          <Bloco titulo="Mídia">
            <div className="adm-segmentos" role="radiogroup" aria-label="Tipo de mídia">
              {[['nenhuma', 'Nenhuma'], ['imagem', 'Imagem'], ['video', 'Vídeo']].map(([valor, rotulo]) => (
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
                <Arquivo valor={pub.imagem || ''} mudar={(v) => mudar({ imagem: v })} aceita="image/*" />
                <Campo label="Descrição da imagem" valor={pub.imagemAlt || ''} mudar={(v) => mudar({ imagemAlt: v })} dica="Lida por quem usa leitor de tela." />
              </>
            )}
            {tipo === 'video' && (
              <>
                <Arquivo valor={pub.video || ''} mudar={(v) => mudar({ video: v })} aceita="video/mp4,video/webm" />
                <Arquivo label="Capa do vídeo (opcional)" valor={pub.poster || ''} mudar={(v) => mudar({ poster: v })} aceita="image/*" />
              </>
            )}
          </Bloco>

          <button className="adm-btn adm-btn-perigo adm-btn-cheio" onClick={excluir}>
            <Lixeira width={16} height={16} /> Excluir publicação
          </button>
        </div>
      </div>
    </div>
  )
}
