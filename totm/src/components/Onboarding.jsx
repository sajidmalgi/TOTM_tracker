import { useState } from 'react'
import { Btn } from './ui'
import { tod } from '../lib/cycle'

const FF  = "'Nunito', sans-serif"
const FFH = "'Playfair Display', serif"

export default function Onboarding({ onComplete }) {
  const [step,      setStep]      = useState(0)
  const [avgC,      setAvgC]      = useState(28)
  const [avgP,      setAvgP]      = useState(6)
  const [lastStart, setLastStart] = useState('')

  const finish = () => onComplete(avgC, avgP, lastStart || null)

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, background:'radial-gradient(ellipse 80% 60% at 20% 0%,#F8DDD848,transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%,#D4E8D030,transparent 60%), #FBF6F1',
    }}>
      <div style={{
        background:'rgba(255,255,255,.92)', backdropFilter:'blur(20px)',
        borderRadius:26, border:'1px solid #EDE5DF',
        padding:'34px 26px', maxWidth:420, width:'100%',
        textAlign:'center', animation:'fadeUp .5s ease both',
        boxShadow:'0 8px 40px rgba(0,0,0,.08)',
      }}>
        {step === 0 && (
          <>
            <div style={{ fontSize:58, marginBottom:18 }}>🌸</div>
            <h1 style={{ fontFamily:FFH, fontSize:30, fontWeight:700, color:'#2B1F1A', marginBottom:12, fontStyle:'italic' }}>Welcome to TOTM</h1>
            <p style={{ fontSize:15, color:'#7A6055', lineHeight:1.75, marginBottom:28, fontFamily:"'Nunito',sans-serif" }}>
              A gentle, private space for Sarah's cycle — and a guide for you both to stay close and connected through every phase.
            </p>
            <Btn label="Let's begin →" onClick={() => setStep(1)} />
          </>
        )}
        {step === 1 && (
          <>
            <div style={{ fontSize:46, marginBottom:16 }}>📅</div>
            <h2 style={{ fontFamily:FFH, fontSize:24, fontWeight:700, color:'#2B1F1A', marginBottom:10, fontStyle:'italic' }}>Sarah's rhythm</h2>
            <p style={{ fontSize:14, color:'#9B8880', lineHeight:1.65, marginBottom:24, fontFamily:FF }}>Set her average cycle and period lengths. You can adjust these anytime.</p>

            <Field label="Average cycle length">
              <SliderRow value={avgC} min={21} max={40} onChange={setAvgC} unit="days" />
            </Field>
            <Field label="Average period length">
              <SliderRow value={avgP} min={2} max={10} onChange={setAvgP} unit="days" />
            </Field>
            <Field label="When did her last period start? (optional)">
              <input type="date" max={tod()} value={lastStart} onChange={e => setLastStart(e.target.value)}
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #DDD5CC', background:'rgba(255,255,255,.7)', fontFamily:FF, fontSize:14, color:'#2B1F1A', textAlign:'left' }}
              />
            </Field>
            <Btn label="Open TOTM ✦" onClick={finish} />
          </>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ textAlign:'left', marginBottom:20 }}>
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, letterSpacing:2, color:'#B09588', marginBottom:8, fontWeight:700, textTransform:'uppercase' }}>{label}</p>
      {children}
    </div>
  )
}

function SliderRow({ value, min, max, onChange, unit }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} style={{ flex:1 }} />
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#2B1F1A', minWidth:55 }}>{value} {unit}</span>
    </div>
  )
}
