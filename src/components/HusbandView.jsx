import { useState } from 'react'
import { Card, EnergyDots, Tag, IslamCard, BookCard, NavBar, Page, Headline, Spacer } from './ui'
import { Notes } from './WifeView'
import { MOODS, NUTRITION, CARE, fmtShort } from '../lib/cycle'

const FF  = "'Nunito', sans-serif"
const FFH = "'Playfair Display', serif"

export default function HusbandView({ data }) {
  const [tab, setTab] = useState('dash')
  const tabs = [
    { id:'dash',  ico:'◉', lbl:'Dashboard' },
    { id:'care',  ico:'💛', lbl:'Care Guide'},
    { id:'notes', ico:'✉', lbl:'Notes'     },
  ]
  return (
    <div>
      {tab === 'dash'  && <Dashboard {...data} />}
      {tab === 'care'  && <CareGuide phase={data.phase} />}
      {tab === 'notes' && <Notes data={data} author="You" showToast={data.showToast} />}
      <NavBar tabs={tabs} active={tab} setActive={setTab} />
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ phase, todayLog, predictions }) {
  return (
    <Page>
      <div style={{ marginBottom:20 }}>
        <p style={{ fontFamily:FF, fontSize:10, letterSpacing:2.5, color:'#B09588', marginBottom:5, fontWeight:700, textTransform:'uppercase' }}>As-salāmu ʿalaykum</p>
        <h2 style={{ fontFamily:FFH, fontSize:24, fontWeight:700, color:'#2B1F1A', lineHeight:1.3, fontStyle:'italic' }}>Here's how Sarah is doing today.</h2>
      </div>

      {/* Phase card */}
      <div style={{
        borderRadius:22, border:`1.5px solid ${phase?.color || '#EDD8CF'}`,
        padding:'20px 18px', marginBottom:16,
        background: phase ? `linear-gradient(145deg,${phase.color}55,${phase.color}18)` : 'linear-gradient(145deg,#F2C4BB33,#F2C4BB0A)',
        animation:'fadeUp .4s ease both',
      }}>
        {phase ? (
          <>
            <div style={{ display:'flex', alignItems:'flex-start', gap:13, marginBottom:10 }}>
              <span style={{ fontSize:36, lineHeight:1 }}>{phase.emoji}</span>
              <div>
                <p style={{ fontFamily:FF, fontSize:9, letterSpacing:2.5, color:'#B09588', marginBottom:4, fontWeight:700, textTransform:'uppercase' }}>
                  Cycle day {phase.day} · {phase.daysUntilNext > 0 ? `${phase.daysUntilNext}d to next period` : 'period due soon'}
                </p>
                <h3 style={{ fontFamily:FFH, fontSize:19, fontWeight:700, color:'#2B1F1A', fontStyle:'italic' }}>{phase.name}</h3>
              </div>
            </div>
            <p style={{ fontSize:14, fontStyle:'italic', color:phase.accent, marginBottom:10, lineHeight:1.5, fontFamily:FFH }}>{phase.tagline}</p>
            <p style={{ fontSize:13.5, color:'#6B5347', lineHeight:1.65, fontFamily:FF }}>{phase.desc}</p>
          </>
        ) : (
          <>
            <span style={{ fontSize:36 }}>🌙</span>
            <p style={{ fontSize:13.5, color:'#6B5347', lineHeight:1.65, fontFamily:FF, marginTop:10 }}>Sarah hasn't logged her cycle yet. Ask her to open TOTM and mark when her period starts.</p>
          </>
        )}
      </div>

      {/* Today's feelings */}
      {(todayLog.mood || todayLog.energy || todayLog.symptoms?.length > 0) ? (
        <Card title="How Sarah's feeling today">
          <div style={{ display:'flex', gap:9, marginBottom:10 }}>
            {todayLog.mood > 0 && <FeelBub ico={MOODS.find(m => m.v === todayLog.mood)?.e} lbl={`Mood: ${MOODS.find(m => m.v === todayLog.mood)?.l}`} />}
            {todayLog.energy > 0 && <FeelBub ico="⚡" lbl={`Energy: ${['','Very low','Low','Moderate','Good','High'][todayLog.energy]}`} />}
            {todayLog.flow && todayLog.flow !== 'None' && <FeelBub ico="🩸" lbl={`Flow: ${todayLog.flow}`} />}
          </div>
          {todayLog.symptoms?.length > 0 && (
            <>
              <p style={{ fontSize:10, color:'#B09588', marginBottom:7, fontFamily:FF, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>She's experiencing</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{todayLog.symptoms.map(s => <Tag key={s} label={s} />)}</div>
            </>
          )}
        </Card>
      ) : (
        <Card title="How Sarah's feeling today">
          <p style={{ color:'#B09588', fontStyle:'italic', fontSize:13.5, fontFamily:FF }}>She hasn't logged today yet — check back soon.</p>
        </Card>
      )}

      {/* Energy bar */}
      {phase && (
        <Card title="Her energy this phase">
          <EnergyDots value={phase.energy} color={phase.color} />
          <p style={{ fontSize:13, color:'#7A6055', lineHeight:1.65, fontStyle:'italic', fontFamily:FFH, marginTop:12 }}>{phase.moodNote}</p>
        </Card>
      )}

      {/* Islamic guidance */}
      {phase && <IslamCard title="Islamic Guidance" body={phase.intimacy} green />}

      {/* Upcoming */}
      {predictions.length > 0 && (
        <Card title="Sarah's upcoming periods">
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
      <Spacer />
    </Page>
  )
}

// ── Care Guide ─────────────────────────────────────────────────────────────
function CareGuide({ phase }) {
  const p    = phase?.phase || 'follicular'
  const care = CARE[p]
  const n    = NUTRITION[p]
  return (
    <Page>
      <Headline title="Care Guide" sub="How to show up for Sarah right now" />
      <Card title={`${phase?.emoji || '💛'} ${phase?.name || 'Right now'}`}>
        {care.map((t, i) => (
          <div key={i} style={{ paddingBottom:12, marginBottom:12, borderBottom: i < care.length - 1 ? '1px solid #EDE5DF' : 'none' }}>
            <p style={{ fontSize:14, color:'#6B5347', lineHeight:1.65, fontFamily:FF }}>{t}</p>
          </div>
        ))}
      </Card>
      <Card title="What would nourish her most">
        {n.meals.slice(0, 2).map((m, i) => (
          <div key={i} style={{ display:'flex', gap:13, alignItems:'flex-start', marginBottom: i === 0 ? 12 : 0 }}>
            <span style={{ fontSize:26 }}>{m.icon}</span>
            <div>
              <p style={{ fontFamily:FFH, fontSize:14, fontWeight:600, color:'#2B1F1A', marginBottom:3, fontStyle:'italic' }}>{m.title}</p>
              <p style={{ fontSize:13, color:'#7A6055', lineHeight:1.6, fontFamily:FF }}>{m.body}</p>
            </div>
          </div>
        ))}
      </Card>
      <BookCard text={n.bookMood} />
      <div style={{
        background:'linear-gradient(135deg,#EDE6F018,#E8D4C818)', border:'1px solid #D8C8E0',
        borderRadius:16, padding:'17px', marginBottom:14,
      }}>
        <p style={{ fontFamily:FFH, fontSize:14, color:'#6A5A80', marginBottom:8, fontWeight:600, fontStyle:'italic' }}>🤲 A note for you</p>
        <p style={{ fontSize:13, color:'#5A4A60', lineHeight:1.7, fontFamily:FF }}>
          Small consistent acts of love are more powerful than grand gestures. Showing up quietly and patiently, cycle after cycle, is one of the most beautiful forms of care.
        </p>
      </div>
      <Spacer />
    </Page>
  )
}

function FeelBub({ ico, lbl }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, background:'#F5EFE9', borderRadius:14, padding:'12px 8px' }}>
      <span style={{ fontSize:26 }}>{ico}</span>
      <span style={{ fontSize:11, color:'#9B8880', textAlign:'center', lineHeight:1.3, fontFamily:"'Nunito',sans-serif" }}>{lbl}</span>
    </div>
  )
}
