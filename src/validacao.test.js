import { validarArquivo, validarConteudo } from './validacao'

const base = {
  perfil: { nome: 'Heloisa' },
  contato: { whatsapp: '+55 79 99627-0697', email: '', instagram: 'https://www.instagram.com/x/' },
  conteudos: [{ titulo: 'Um título' }]
}
const com = (mudanca) => ({ ...base, ...mudanca })

test('conteúdo correto passa', () => {
  expect(validarConteudo(base)).toBeNull()
})

test('recusa campos errados', () => {
  expect(validarConteudo(com({ perfil: { nome: ' ' } }))).toMatch(/nome/)
  expect(validarConteudo(com({ contato: { ...base.contato, whatsapp: '123' } }))).toMatch(/WhatsApp/)
  expect(validarConteudo(com({ contato: { ...base.contato, whatsapp: 'javascript:alert(1)' } }))).toMatch(/WhatsApp/)
  expect(validarConteudo(com({ contato: { ...base.contato, email: 'sem-arroba' } }))).toMatch(/e-mail/)
  expect(validarConteudo(com({ contato: { ...base.contato, instagram: 'javascript:alert(1)' } }))).toMatch(/Instagram/)
  expect(validarConteudo(com({ conteudos: [{ titulo: '' }] }))).toMatch(/título/)
})

test('valida o arquivo pelo tipo e pelo tamanho', () => {
  expect(validarArquivo({ type: 'image/jpeg', size: 1000 }, false)).toBeNull()
  expect(validarArquivo({ type: 'video/mp4', size: 1000 }, true)).toBeNull()
  expect(validarArquivo({ type: 'image/svg+xml', size: 1000 }, false)).toMatch(/JPG/)
  expect(validarArquivo({ type: 'image/png', size: 11 * 1024 * 1024 }, false)).toMatch(/10 MB/)
  expect(validarArquivo({ type: 'video/mp4', size: 51 * 1024 * 1024 }, true)).toMatch(/50 MB/)
})
