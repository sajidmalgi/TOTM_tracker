import { useState, useEffect, useCallback } from 'react'
import {
  loadProfile, saveProfile,
  loadCycles, insertCycle, updateCycle, deleteCycle,
  loadLogs, upsertLog,
  loadNotes, insertNote,
  subscribeToChanges,
} from '../lib/db'
import { calcPhase, getPredictions, tod } from '../lib/cycle'

export function useTOTM() {
  const [profile,  setProfile]  = useState(null)
  const [cycles,   setCycles]   = useState([])
  const [logs,     setLogs]     = useState([])
  const [notes,    setNotes]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [syncing,  setSyncing]  = useState(false)
  const [error,    setError]    = useState(null)
  const [lastSync, setLastSync] = useState(null)

  const refresh = useCallback(async (silent = false) => {
    try {
      if (!silent) setSyncing(true)
      const [p, c, l, n] = await Promise.all([loadProfile(), loadCycles(), loadLogs(), loadNotes()])
      setProfile(p)
      setCycles(c)
      setLogs(l)
      setNotes(n)
      setLastSync(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setSyncing(false)
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { refresh() }, [refresh])

  // Real-time subscription — fires whenever ANY device writes to Supabase
  useEffect(() => {
    const unsub = subscribeToChanges(() => refresh(true))
    return unsub
  }, [refresh])

  // ── Derived state ──────────────────────────────────────────────
  const lastCycle  = cycles[cycles.length - 1] || null
  const todayLog   = logs.find(l => l.log_date === tod()) || {}
  const phase      = profile ? calcPhase(lastCycle?.start_date || null, profile.avg_cycle_length, profile.avg_period_length) : null
  const predictions = profile ? getPredictions(lastCycle?.start_date || null, profile.avg_cycle_length, profile.avg_period_length) : []

  // ── Actions ────────────────────────────────────────────────────
  const startPeriod = async () => {
    const row = await insertCycle(tod())
    setCycles(c => [...c, row])
  }

  const endPeriod = async () => {
    if (!lastCycle) return
    await updateCycle(lastCycle.id, { end_date: tod() })
    setCycles(c => c.map(x => x.id === lastCycle.id ? { ...x, end_date: tod() } : x))
  }

  const undoLastCycle = async () => {
    if (!lastCycle) return
    await deleteCycle(lastCycle.id)
    setCycles(c => c.filter(x => x.id !== lastCycle.id))
  }

  const removeCycle = async (id) => {
    await deleteCycle(id)
    setCycles(c => c.filter(x => x.id !== id))
  }

  const saveLog = async (fields) => {
    await upsertLog(tod(), fields)
    setLogs(l => {
      const existing = l.findIndex(x => x.log_date === tod())
      if (existing >= 0) {
        const copy = [...l]; copy[existing] = { ...copy[existing], ...fields, log_date: tod() }; return copy
      }
      return [{ log_date: tod(), ...fields }, ...l]
    })
  }

  const updateSettings = async (patch) => {
    await saveProfile(patch)
    setProfile(p => ({ ...p, ...patch }))
  }

  const completeOnboarding = async (avgCycle, avgPeriod, lastPeriodStart) => {
    await saveProfile({ avg_cycle_length: avgCycle, avg_period_length: avgPeriod, onboarded: true })
    setProfile(p => ({ ...p, avg_cycle_length: avgCycle, avg_period_length: avgPeriod, onboarded: true }))
    if (lastPeriodStart) {
      const row = await insertCycle(lastPeriodStart)
      setCycles([row])
    }
  }

  const sendNote = async (author, text) => {
    const row = await insertNote(author, text)
    setNotes(n => [row, ...n])
    return row
  }

  return {
    profile, cycles, logs, notes, loading, syncing, error, lastSync,
    todayLog, phase, predictions, lastCycle,
    refresh,
    startPeriod, endPeriod, undoLastCycle, removeCycle,
    saveLog, updateSettings, completeOnboarding, sendNote,
  }
}
