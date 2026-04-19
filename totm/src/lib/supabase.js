import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://apwawcjnvcodnwtyophp.supabase.co'
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd2F3Y2pudmNvZG53dHlvcGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzQyNDEsImV4cCI6MjA5MjExMDI0MX0.Mbca9aLvyRb5iIGFaeIxaHkeiiQUX9npeiFv9oqjPuc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
