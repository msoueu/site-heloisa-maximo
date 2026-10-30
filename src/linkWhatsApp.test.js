import { linkWhatsApp, aceitaMensagem } from './SiteData'

test('o número leva a mensagem automática', () => {
  const link = linkWhatsApp('79 99999-9999')
  expect(link.startsWith('https://wa.me/5579999999999?text=')).toBe(true)
  expect(decodeURIComponent(link.split('text=')[1])).toContain('Vim pelo seu site')
})

test('as respostas da análise vão com quebra de linha', () => {
  const link = linkWhatsApp('5579999999999', 'Situação: Prisão em flagrante\nQuem: Eu')
  expect(decodeURIComponent(link.split('text=')[1])).toBe('Situação: Prisão em flagrante\nQuem: Eu')
})

test('mensagem em branco volta para a original', () => {
  expect(decodeURIComponent(linkWhatsApp('79 99999-9999', '').split('text=')[1])).toContain('Vim pelo seu site')
})

test('link com número também recebe o texto', () => {
  expect(linkWhatsApp('https://wa.me/5579999999999', 'Oi')).toBe('https://wa.me/5579999999999?text=Oi')
})

test('link de conta comercial continua igual, porque ignora o texto', () => {
  const link = 'https://wa.me/message/OOKYODDRW6ILK1'
  expect(aceitaMensagem(link)).toBe(false)
  expect(linkWhatsApp(link)).toBe(link)
})
