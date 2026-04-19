import { useState } from 'react'
import { Card, Chip, Tag, Btn, PhaseHero, EnergyDots, BookCard, IslamCard, NavBar, Page, Headline, Spacer } from './ui'
import { MOODS, FLOWS, SYMPTOMS, NUTRITION, fmtShort, fmtDay, timeOfDay, diffD, tod } from '../lib/cycle'

const FF  = "'Nunito', sans-serif"
const FFH = "'Playfair Display', serif"

export default function WifeView({ data }) {
  const [tab, setTab] = useState('home')
  const tabs = [
    { id:'home',  ico:'◉', lbl:'Home'    },
    { id:'log',   ico:'✦', lbl:'Today'   },
    { id:'cycle', ico:'◌', lbl:'Cycle'   },
    { id:'well',  ico:'✿', lbl:'Wellness'},
    { id:'notes', ico:'✉', lbl:'Notes'   },
  ]
  return (
    <div>
      {tab === 'home'  && <Home  {...data} />}
      {tab === 'log'   && <LogToday {...data} />}
      {tab === 'cycle' && <CycleTab {...data} />}
      {tab === 'well'  && <Wellness phase={data.phase} />}
      {tab === 'notes' && <Notes data={data} author="Sarah" />}
      <NavBar tabs={tabs} active={tab} setActive={setTab} />
    </div>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────
function Home({ phase, todayLog, lastCycle, startPeriod, endPeriod, undoLastCycle, showToast }) {
  const onPeriod  = phase?.phase === 'menstrual'
  const justToday = lastCycle && !lastCycle.end_date && diffD(lastCycle.start_date, tod()) === 0

  return (
    <Page>
      <div style={{ marginBottom:18 }}>
        <p style={{ fontFamily:FF, fontSize:10, letterSpacing:2.5, color:'#B09588', marginBottom:4, fontWeight:700, textTransform:'uppercase' }}>Good {timeOfDay()},</p>
        <h2 style={{ fontFamily:FFH, fontSize:28, fontWeight:700, color:'#2B1F1A', fontStyle:'italic' }}>Sarah 🌸</h2>
      </div>

      <PhaseHero phase={phase}>
        {phase?.daysUntilNext > 0 && phase.daysUntilNext <= 60 && (
          <div style={{ display:'inline-block', background:'rgba(255,255,255,.65)', borderRadius:20, padding:'6px 14px', fontSize:12, color:'#9B8880', marginTop:12, fontFamily:FF, fontWeight:600 }}>
            Next period in <strong>{phase.daysUntilNext} days</strong> · {fmtShort(phase.nextPeriod)}
          </div>
        )}
      </PhaseHero>

      {/* Period controls */}
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        {!onPeriod ? (
          <button style={periodBtn('#C2785F')} onClick={async () => { await startPeriod(); showToast("Period logged 💙") }}>
            🩸 Period Started
          </button>
        ) : (
          <button style={periodBtn('#7DBF74')} onClick={async () => { await endPeriod(); showToast('Period ended. Alhamdulillah 🌿') }}>
            ✓ Period Ended
          </button>
        )}
        {justToday && (
          <button onClick={async () => { await undoLastCycle(); showToast('Entry removed ✓') }}
            style={{ padding:'0 16px', borderRadius:14, border:'1.5px solid #DDD5CC', background:'rgba(255,255,255,.8)', color:'#9B8880', fontSize:13, fontFamily:FF, fontWeight:600, cursor:'pointer' }}>
            ↩ Undo
          </button>
        )}
        <div style={{ width:64, background:'rgba(255,255,255,.8)', borderRadius:14, border:'1px solid #EDE5DF', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:8 }}>
          <span style={{ fontSize:9, letterSpacing:2, color:'#B09588', fontFamily:FF, fontWeight:700, textTransform:'uppercase' }}>mood</span>
          <span style={{ fontSize:24 }}>{MOODS.find(m => m.v === todayLog.mood)?.e || '—'}</span>
        </div>
      </div>

      {todayLog.flow && (
        <Card title="Today's log">
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            <Tag label={todayLog.flow} />
            {todayLog.symptoms?.map(s => <Tag key={s} label={s} />)}
          </div>
        </Card>
      )}
      <Spacer />
    </Page>
  )
}

const periodBtn = bg => ({
  flex:1, padding:'15px 10px', borderRadius:14, border:'none',
  background: bg, color:'#fff', fontSize:14, fontFamily:"'Nunito',sans-serif",
  fontWeight:700, boxShadow:'0 4px 16px rgba(194,120,95,.28)', cursor:'pointer', transition:'all .2s',
})

// ── Log Today ──────────────────────────────────────────────────────────────
function LogToday({ todayLog, saveLog, showToast }) {
  const [form, setForm] = useState({
    flow:     todayLog.flow     || '',
    mood:     todayLog.mood     || 0,
    energy:   todayLog.energy   || 0,
    symptoms: todayLog.symptoms || [],
    notes:    todayLog.notes    || '',
  })
  const [saved, setSaved] = useState(false)

  const toggle = s => setForm(f => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x => x !== s) : [...f.symptoms, s] }))

  const doSave = async () => {
    await saveLog(form)
    setSaved(true); showToast('Log saved ✓')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Page>
      <Headline title="Log Today" sub={fmtDay()} />
      <Card title="Flow">
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {FLOWS.map(f => <Chip key={f} label={f} active={form.flow === f} onClick={() => setForm(p => ({ ...p, flow: f }))} />)}
        </div>
      </Card>
      <Card title="Mood">
        <div style={{ display:'flex', gap:7, justifyContent:'space-between' }}>
          {MOODS.map(m => (
            <button key={m.v} onClick={() => setForm(p => ({ ...p, mood: m.v }))} style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              padding:'10px 5px', borderRadius:13, border:`1.5px solid ${form.mood === m.v ? '#C2785F' : '#DDD5CC'}`,
              background: form.mood === m.v ? '#FBE8E4' : 'transparent', fontFamily:FF, cursor:'pointer', transition:'all .15s',
            }}>
              <span style={{ fontSize:24 }}>{m.e}</span>
              <span style={{ fontSize:10, fontWeight:600 }}>{m.l}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card title="Energy">
        <EnergyDots value={form.energy} onChange={v => setForm(p => ({ ...p, energy: v }))} />
      </Card>
      <Card title="Symptoms">
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {SYMPTOMS.map(s => <Chip key={s} label={s} active={form.symptoms.includes(s)} onClick={() => toggle(s)} />)}
        </div>
      </Card>
      <Card title="Private notes — only you see these">
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="How are you really feeling today…"
          rows={3} style={{
            width:'100%', borderRadius:12, border:'1.5px solid #DDD5CC',
            background:'rgba(255,255,255,.6)', padding:'12px', fontFamily:FF,
            fontSize:14, color:'#2B1F1A', lineHeight:1.65, resize:'vertical',
          }}/>
      </Card>
      <Btn label={saved ? '✓ Saved' : "Save Today's Log"} color={saved ? '#7DBF74' : '#C2785F'} onClick={doSave} style={{ marginBottom:20 }} />
      <Spacer />
    </Page>
  )
}

// ── Cycle ──────────────────────────────────────────────────────────────────
function CycleTab({ profile, cycles, predictions, updateSettings, removeCycle, showToast }) {
  const [avgC, setAvgC] = useState(profile?.avg_cycle_length || 28)
  const [avgP, setAvgP] = useState(profile?.avg_period_length || 6)
  const [saved, setSaved] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const doSave = async () => {
    await updateSettings({ avg_cycle_length: avgC, avg_period_length: avgP })
    setSaved(true); showToast('Settings updated ✓')
    setTimeout(() => setSaved(false), 2500)
  }

  const sorted = [...cycles].reverse()
  const visible = showAll ? sorted : sorted.slice(0, 5)

  return (
    <Page>
      <Headline title="Your Cycle" sub="Your rhythm, tracked with care" />
      <Card title="Cycle settings">
        <SlRow label="Average cycle length" value={avgC} min={21} max={40} onChange={setAvgC} />
        <SlRow label="Average period length" value={avgP} min={2} max={10} onChange={setAvgP} />
        <Btn label={saved ? '✓ Updated' : 'Save Settings'} color={saved ? '#7DBF74' : '#C2785F'} onClick={doSave} style={{ marginTop:8 }} />
      </Card>

      {predictions.length > 0 && (
        <Card title="Upcoming periods — predicted">
          {predictions.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:13, padding:'10px 0', borderBottom: i < predictions.length - 1 ? '1px solid #F0E8E2' : 'none' }}>
              <span style={{ fontSize:22 }}>🌙</span>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:'#2B1F1A', fontFamily:FF }}>{fmtShort(p.start)} — {fmtShort(p.end)}</p>
                <p style={{ fontSize:11, color:'#B09588', fontFamily:FF, marginTop:2 }}>predicted</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card title="Logged cycles">
        {cycles.length === 0
          ? <p style={{ color:'#B09588', fontStyle:'italic', fontSize:13.5, lineHeight:1.7, fontFamily:FF }}>No cycles logged yet.</p>
          : <>
            {visible.map((c, i) => (
              <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom: i < visible.length - 1 ? '1px solid #EEE7E0' : 'none' }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#2B1F1A', fontFamily:FF }}>{fmtShort(c.start_date)}{c.end_date ? ` — ${fmtShort(c.end_date)}` : ''}</p>
                  <p style={{ fontSize:11, color:'#B09588', fontFamily:FF, marginTop:2 }}>{c.end_date ? `${diffD(c.start_date, c.end_date)} days` : 'ongoing'}</p>
                </div>
                <button onClick={async () => { await removeCycle(c.id); showToast('Entry removed') }}
                  style={{ width:30, height:30, borderRadius:'50%', border:'1px solid #E0D8D0', background:'transparent', color:'#C0ADA6', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
            ))}
            {cycles.length > 5 && (
              <button onClick={() => setShowAll(v => !v)} style={{ width:'100%', padding:10, background:'transparent', border:'none', color:'#B09588', fontSize:13, fontFamily:FF, textDecoration:'underline', cursor:'pointer', marginTop:6 }}>
                {showAll ? 'Show less ↑' : `Show all ${cycles.length} cycles ↓`}
              </button>
            )}
          </>
        }
      </Card>
      <Spacer />
    </Page>
  )
}

function SlRow({ label, value, min, max, onChange }) {
  return (
    <div style={{ marginBottom:16 }}>
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, letterSpacing:2, color:'#B09588', marginBottom:8, fontWeight:700, textTransform:'uppercase' }}>{label}</p>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} style={{ flex:1 }} />
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#2B1F1A', minWidth:55 }}>{value} days</span>
      </div>
    </div>
  )
}

// ── Wellness ───────────────────────────────────────────────────────────────
function Wellness({ phase }) {
  const p = phase?.phase || 'follicular'
  const n = NUTRITION[p]
  return (
    <Page>
      <Headline title="Wellness" sub={phase ? `For your ${phase.name} phase` : 'General guidance'} />
      {n.meals.map((m, i) => (
        <div key={i} style={{ display:'flex', gap:13, alignItems:'flex-start', background:'rgba(255,255,255,.82)', borderRadius:16, border:'1px solid #EDE5DF', padding:'14px 16px', marginBottom:12 }}>
          <span style={{ fontSize:28, flexShrink:0 }}>{m.icon}</span>
          <div>
            <p style={{ fontFamily:FFH, fontSize:14, fontWeight:600, color:'#2B1F1A', marginBottom:3, fontStyle:'italic' }}>{m.title}</p>
            <p style={{ fontSize:13, color:'#7A6055', lineHeight:1.6, fontFamily:FF }}>{m.body}</p>
          </div>
        </div>
      ))}
      <BookCard text={n.bookMood} />
      <IslamCard title="A gentle reminder" body={n.islamNote} />
      <Spacer />
    </Page>
  )
}

// ── Notes ──────────────────────────────────────────────────────────────────
export function Notes({ data, author, showToast }) {
  const [text, setText] = useState('')
  const { notes, sendNote } = data

  const send = async () => {
    if (!text.trim()) return
    await sendNote(author, text.trim())
    setText('')
    showToast('Note sent ✓')
  }

  return (
    <Page>
      <Headline title="Notes" sub="A shared thread between you both" />
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14, minHeight:180 }}>
        {notes.length === 0 && <p style={{ color:'#B09588', fontStyle:'italic', fontSize:13.5, fontFamily:FF }}>No notes yet — send the first one 💌</p>}
        {notes.map(n => (
          <div key={n.id} style={{
            padding:'12px 15px', borderRadius:16, maxWidth:'86%',
            ...(n.author === author
              ? { background:'#C2785F', color:'#fff', alignSelf:'flex-end', borderBottomRightRadius:4 }
              : { background:'rgba(255,255,255,.85)', border:'1px solid #EDE5DF', color:'#2B1F1A', alignSelf:'flex-start', borderBottomLeftRadius:4 }),
          }}>
            <p style={{ fontSize:10, opacity:.7, marginBottom:5, fontFamily:FF, fontWeight:700, letterSpacing:.5, textTransform:'uppercase' }}>{n.author}</p>
            <p style={{ fontSize:14, lineHeight:1.55, fontFamily:FF }}>{n.text}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'flex-end', position:'sticky', bottom:80, background:'rgba(251,246,241,.96)', backdropFilter:'blur(10px)', padding:'10px 0' }}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Write something…" rows={2}
          style={{ flex:1, borderRadius:14, border:'1.5px solid #DDD5CC', background:'rgba(255,255,255,.7)', padding:'12px', fontFamily:FF, fontSize:14, color:'#2B1F1A', lineHeight:1.5, resize:'none' }}/>
        <button onClick={send} style={{ padding:'14px 18px', borderRadius:14, border:'none', background:'#C2785F', color:'#fff', fontSize:14, fontFamily:FF, fontWeight:700, cursor:'pointer' }}>Send</button>
      </div>
      <Spacer />
    </Page>
  )
}
