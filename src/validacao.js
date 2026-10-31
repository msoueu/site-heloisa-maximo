const IMAGENS = ['image/jpeg', 'image/png', 'image/webp']
const VIDEOS = ['video/mp4', 'video/webm']
const MB = 1024 * 1024
const LIMITE_IMAGEM = 10 * MB
const LIMITE_VIDEO = 50 * MB

export const TIPOS_IMAGEM = IMAGENS.join(',')
export const TIPOS_VIDEO = VIDEOS.join(',')

const enderecoSeguro = (valor) => /^https:\/\/[^\s]+$/.test(valor)

function whatsappValido(valor) {
  if (/^https?:\/\//.test(valor)) return enderecoSeguro(valor)
  const digitos = valor.replace(/\D/g, '')
  return digitos.length >= 10 && digitos.length <= 13
}

// Devolve o primeiro problema em linguagem simples, ou null. O banco repete as regras de tamanho
export function validarArquivo(arquivo, video) {
  const permitidos = video ? VIDEOS : IMAGENS
  if (!permitidos.includes(arquivo.type)) {
    return video ? 'Escolha um vídeo em MP4 ou WEBM.' : 'Escolha uma foto em JPG, PNG ou WEBP.'
  }
  if (arquivo.size > (video ? LIMITE_VIDEO : LIMITE_IMAGEM)) {
    return video ? 'O vídeo passa de 50 MB.' : 'A foto passa de 10 MB.'
  }
  return null
}

export function validarConteudo({ perfil, contato, conteudos, parcerias = [] }) {
  if (!perfil.nome.trim()) return 'Preencha o seu nome em Sobre você.'
  if (!whatsappValido(contato.whatsapp)) return 'Confira o número do WhatsApp em Formas de contato.'
  if (contato.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email)) {
    return 'Confira o e-mail em Formas de contato.'
  }
  if (contato.instagram && !enderecoSeguro(contato.instagram)) {
    return 'O link do Instagram precisa começar com https://.'
  }
  if (conteudos.some((c) => !c.titulo.trim())) return 'Há publicação sem título em Publicações.'
  if (parcerias.some((p) => !p.titulo.trim())) return 'Há parceria sem nome em Parceiros.'
  if (parcerias.some((p) => p.link && !enderecoSeguro(p.link))) return 'O link da parceria precisa começar com https://.'
  return null
}
