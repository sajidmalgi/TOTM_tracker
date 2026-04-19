import { useState, useEffect } from 'react'

const FF  = "'Nunito', sans-serif"
const FFH = "'Playfair Display', serif"

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div style={{
      position:'fixed', top:70, left:'50%', transform:'translateX(-50%)',
      background:'#2B1F1A', color:'#FBF6F1', padding:'11px 22px',
      borderRadius:24, fontSize:13, fontFamily:FF, fontWeight:600,
      zIndex:9999, animation:'fadeIn .22s ease', whiteSpace:'nowrap',
      boxShadow:'0 6px 24px rgba(0,0,0,.22)', letterSpacing:.3,
    }}>{msg}</div>
  )
}

// ── Page wrapper ───────────────────────────────────────────────────────────
export function Page({ children }) {
  return <div style={{ padding:'20px 18px 0', maxWidth:480, margin:'0 auto' }}>{children}</div>
}

// ── Headline ───────────────────────────────────────────────────────────────
export function Headline({ title, sub }) {
  return (
    <div style={{ marginBottom:20, animation:'fadeUp .35s ease both' }}>
      <h2 style={{ fontFamily:FFH, fontSize:26, fontWeight:700, color:'#2B1F1A', marginBottom:3, fontStyle:'italic' }}>{title}</h2>
      {sub && <p style={{ fontSize:13, color:'#B09588', fontFamily:FF }}>{sub}</p>}
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background:'rgba(255,255,255,.82)', borderRadius:20,
      border:'1px solid #EDE5DF', padding:'16px 18px',
      marginBottom:14, animation:'fadeUp .38s ease both', ...style,
    }}>
      {title && <p style={{ fontFamily:FF, fontSize:10, letterSpacing:2.5, color:'#B09588', marginBottom:13, fontWeight:700, textTransform:'uppercase' }}>{title}</p>}
      {children}
    </div>
  )
}

// ── Chip ───────────────────────────────────────────────────────────────────
export function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'8px 15px', borderRadius:20,
      border:`1.5px solid ${active ? '#C2785F' : '#DDD5CC'}`,
      background: active ? '#C2785F' : 'transparent',
      color: active ? '#fff' : '#6B5347',
      fontSize:13, fontFamily:FF, fontWeight:600,
      cursor:'pointer', transition:'all .15s',
    }}>{label}</button>
  )
}

// ── Tag ────────────────────────────────────────────────────────────────────
export function Tag({ label }) {
  return (
    <span style={{
      display:'inline-block', padding:'5px 12px', borderRadius:10,
      background:'#EDE5DF', color:'#6B5347', fontSize:12, fontWeight:600,
      fontFamily:FF,
    }}>{label}</span>
  )
}

// ── Primary button ─────────────────────────────────────────────────────────
export function Btn({ label, onClick, color = '#C2785F', style = {} }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', padding:'15px', borderRadius:14, border:'none',
      background: color, color:'#fff', fontSize:15, fontFamily:FF,
      fontWeight:700, cursor:'pointer', transition:'background .25s',
      boxShadow:'0 4px 14px rgba(194,120,95,.25)', letterSpacing:.3, ...style,
    }}>{label}</button>
  )
}

// ── Phase hero card ────────────────────────────────────────────────────────
export function PhaseHero({ phase, children }) {
  const bg = phase
    ? `linear-gradient(145deg, ${phase.color}55 0%, ${phase.color}18 100%)`
    : 'linear-gradient(145deg, #F2C4BB33, #F2C4BB0A)'
  return (
    <div style={{
      borderRadius:22, border:`1.5px solid ${phase?.color || '#EDD8CF'}`,
      padding:'20px 18px', marginBottom:16, background: bg,
      animation:'fadeUp .4s ease both',
    }}>
      {phase ? (
        <>
          <div style={{ display:'flex', alignItems:'flex-start', gap:13, marginBottom:10 }}>
            <span style={{ fontSize:36, lineHeight:1 }}>{phase.emoji}</span>
            <div>
              <p style={{ fontFamily:FF, fontSize:9, letterSpacing:2.5, color:'#B09588', marginBottom:4, fontWeight:700, textTransform:'uppercase' }}>Cycle Day {phase.day}</p>
              <h3 style={{ fontFamily:FFH, fontSize:19, fontWeight:700, color:'#2B1F1A', fontStyle:'italic' }}>{phase.name}</h3>
            </div>
          </div>
          <p style={{ fontSize:14, fontStyle:'italic', color: phase.accent, marginBottom:10, lineHeight:1.5, fontFamily:FFH }}>{phase.tagline}</p>
          <p style={{ fontSize:13.5, color:'#6B5347', lineHeight:1.65, fontFamily:FF }}>{phase.desc}</p>
          {children}
        </>
      ) : (
        <>
          <span style={{ fontSize:36 }}>🌙</span>
          <h3 style={{ fontFamily:FFH, fontSize:19, fontWeight:700, color:'#2B1F1A', margin:'10px 0 8px', fontStyle:'italic' }}>Welcome to TOTM</h3>
          <p style={{ fontSize:13.5, color:'#6B5347', lineHeight:1.65, fontFamily:FF }}>Log your first period to begin tracking your cycle.</p>
        </>
      )}
    </div>
  )
}

// ── Energy dots ────────────────────────────────────────────────────────────
export function EnergyDots({ value, onChange, color = '#C2785F' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange && onChange(n)} style={{
          width:30, height:30, borderRadius:'50%', border:'none',
          background: n <= value ? color : '#EAE2DC',
          transform: n <= value ? 'scale(1.12)' : 'scale(1)',
          transition:'all .18s', fontSize:14, fontFamily:FF,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: n <= value ? '#fff' : '#C0ADA6', cursor: onChange ? 'pointer' : 'default',
        }}>●</button>
      ))}
      <span style={{ fontSize:12, color:'#B09588', fontStyle:'italic', fontFamily:FF }}>
        {['','Very low','Low','Moderate','Good','High'][value] || 'tap to set'}
      </span>
    </div>
  )
}

// ── Book card ──────────────────────────────────────────────────────────────
export function BookCard({ text }) {
  return (
    <div style={{
      background:'linear-gradient(135deg, #FDF4E7, #FAF0DE)',
      border:'1px solid #ECCF8A', borderRadius:16, padding:'16px', marginBottom:14,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <span style={{ fontSize:20 }}>📖</span>
        <p style={{ fontFamily:FF, fontSize:9.5, letterSpacing:2.5, color:'#A07820', fontWeight:700, textTransform:'uppercase' }}>Reading Mood</p>
      </div>
      <p style={{ fontSize:13, color:'#7A6020', lineHeight:1.65, fontStyle:'italic', fontFamily:FFH }}>{text}</p>
    </div>
  )
}

// ── Islam card ─────────────────────────────────────────────────────────────
export function IslamCard({ title, body, green = false }) {
  return (
    <div style={{
      background: green ? 'linear-gradient(135deg, #E8F0E622, #EEF5EC18)' : 'linear-gradient(135deg, #EDE6F018, #E8D4C818)',
      border:`1px solid ${green ? '#C8DCC4' : '#D8C8E0'}`,
      borderRadius:16, padding:'17px', marginBottom:14,
    }}>
      <p style={{ fontFamily:FFH, fontSize:14, color: green ? '#4D7A4A' : '#6A5A80', marginBottom:8, fontWeight:600, fontStyle:'italic' }}>
        🤲 {title}
      </p>
      <p style={{ fontSize:13, color: green ? '#4D5E4A' : '#5A4A60', lineHeight:1.7, fontFamily:FF }}>{body}</p>
    </div>
  )
}

// ── Nav bar ────────────────────────────────────────────────────────────────
export function NavBar({ tabs, active, setActive }) {
  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:100,
      display:'flex', background:'rgba(251,246,241,.96)',
      backdropFilter:'blur(18px)', borderTop:'1px solid #EDE5DF',
      paddingBottom:'env(safe-area-inset-bottom, 6px)',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          flex:1, display:'flex', flexDirection:'column', alignItems:'center',
          gap:2, border:'none', background:'transparent',
          color: active === t.id ? '#C2785F' : '#C0ADA6',
          padding:'10px 0', cursor:'pointer', fontFamily:FF,
          transition:'color .2s',
        }}>
          <span style={{ fontSize:18 }}>{t.ico}</span>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:.3 }}>{t.lbl}</span>
        </button>
      ))}
    </nav>
  )
}

export const Spacer = () => <div style={{ height:100 }} />
