import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { PERFIL, CONTATO, DESTAQUES, AREAS, ETAPAS, CONTEUDOS } from './data'

const url = process.env.REACT_APP_SUPABASE_URL
const chave = process.env.REACT_APP_SUPABASE_ANON_KEY

// O link de nova senha chega como #access_token=...&type=recovery; o cliente do Supabase limpa
// esse trecho da URL ao iniciar, então a origem é lida antes de criar o cliente
export const veioDeRecuperacao = window.location.hash.includes('type=recovery')

// Sem as variáveis (ou com os valores de exemplo do .env.example) o site usa só o data.js
// e o painel mostra como configurar
const configurado = Boolean(url && chave) && !url.includes('SEU-PROJETO')
export const supabase = configurado ? createClient(url, chave) : null

export const BUCKET = 'midia'

const PADRAO = {
  perfil: PERFIL,
  contato: CONTATO,
  destaques: DESTAQUES,
  areas: AREAS,
  etapas: ETAPAS,
  conteudos: CONTEUDOS
}

// Aceita o número com DDD ("79 99999-9999") ou um link pronto do WhatsApp
export function linkWhatsApp(valor) {
  if (/^https?:\/\//.test(valor)) return valor
  const digitos = valor.replace(/\D/g, '')
  return `https://wa.me/${digitos.startsWith('55') ? digitos : `55${digitos}`}`
}

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [dados, setDados] = useState(PADRAO)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('site')
      .select('dados')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        // Se o banco falhar, o site continua no ar com o conteúdo do data.js
        if (error) console.error('Conteúdo do Supabase indisponível:', error.message)
        else if (data) setDados({ ...PADRAO, ...data.dados })
      })
  }, [])

  const salvar = useCallback(async (novos) => {
    const { error } = await supabase.from('site').upsert({ id: 1, dados: novos })
    if (error) throw error
    setDados(novos)
  }, [])

  return <SiteContext.Provider value={{ ...dados, salvar }}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
