export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
export const SUPABASE_CHAVE = process.env.REACT_APP_SUPABASE_ANON_KEY

// Sem as variáveis (ou com os valores de exemplo do .env.example) o site usa só o data.js
// e o painel mostra como configurar
export const CONFIGURADO = Boolean(SUPABASE_URL && SUPABASE_CHAVE) && !SUPABASE_URL.includes('SEU-PROJETO')

// Celular e tablet: menos pixels, menos partículas e 30 quadros por segundo
export const LEVE = window.matchMedia('(pointer: coarse)').matches
