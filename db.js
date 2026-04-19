import { supabase } from './supabase'

const PROFILE_ID = 'totm-shared' // single shared profile row

// ── READ ──────────────────────────────────────────────────────────
export async function loadProfile() {
  const { data, error } = await supabase
    .from('totm_profile')
    .select('*')
    .eq('id', PROFILE_ID)
    .single()

  if (error && error.code === 'PGRST116') {
    // Row doesn't exist yet — create it
    return createProfile()
  }
  if (error) throw error
  return data
}

async function createProfile() {
  const defaults = {
    id: PROFILE_ID,
    avg_cycle_length: 28,
    avg_period_length: 6,
    onboarded: false,
  }
  const { data, error } = await supabase
    .from('totm_profile')
    .insert(defaults)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function saveProfile(patch) {
  const { error } = await supabase
    .from('totm_profile')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', PROFILE_ID)
  if (error) throw error
}

// ── CYCLES ────────────────────────────────────────────────────────
export async function loadCycles() {
  const { data, error } = await supabase
    .from('totm_cycles')
    .select('*')
    .order('start_date', { ascending: true })
  if (error) throw error
  return data || []
}

export async function insertCycle(startDate) {
  const { data, error } = await supabase
    .from('totm_cycles')
    .insert({ start_date: startDate })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCycle(id, patch) {
  const { error } = await supabase
    .from('totm_cycles')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}

export async function deleteCycle(id) {
  const { error } = await supabase
    .from('totm_cycles')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── DAILY LOGS ────────────────────────────────────────────────────
export async function loadLogs() {
  const { data, error } = await supabase
    .from('totm_logs')
    .select('*')
    .order('log_date', { ascending: false })
    .limit(90)
  if (error) throw error
  return data || []
}

export async function upsertLog(logDate, fields) {
  const { error } = await supabase
    .from('totm_logs')
    .upsert({ log_date: logDate, ...fields }, { onConflict: 'log_date' })
  if (error) throw error
}

// ── NOTES ─────────────────────────────────────────────────────────
export async function loadNotes() {
  const { data, error } = await supabase
    .from('totm_notes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}

export async function insertNote(author, text) {
  const { data, error } = await supabase
    .from('totm_notes')
    .insert({ author, text })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── REAL-TIME SUBSCRIPTION ────────────────────────────────────────
export function subscribeToChanges(callback) {
  const channel = supabase
    .channel('totm-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'totm_profile' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'totm_cycles' },  callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'totm_logs' },    callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'totm_notes' },   callback)
    .subscribe()
  return () => supabase.removeChannel(channel)
}
