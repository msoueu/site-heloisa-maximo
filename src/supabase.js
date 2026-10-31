import { createClient } from '@supabase/supabase-js'
import { CONFIGURADO, SUPABASE_URL, SUPABASE_CHAVE } from './ambiente'

// Só o painel importa este arquivo: quem visita o site não baixa a biblioteca de login
export const supabase = CONFIGURADO ? createClient(SUPABASE_URL, SUPABASE_CHAVE) : null

export const BUCKET = 'midia'
