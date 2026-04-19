import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to https://supabase.com → New project (free)
// 2. Settings → API → copy "Project URL" and "anon public" key
// 3. Paste them below (or use .env variables — see README)
// ─────────────────────────────────────────────────────────────────

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
