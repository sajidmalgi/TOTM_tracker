import { useState } from 'react'
import { useTOTM } from './hooks/useTOTM'
import Onboarding from './components/Onboarding'
import WifeView   from './components/WifeView'
import HusbandView from './components/HusbandView'
import { Toast } from './components/ui'
import { fmtTime } from './lib/cycle'

const FF  = "'Nunito', sans-serif"
const FFH = "'Playfair Display', serif"

export default function App() {
  const totm = useTOTM()
  const [view,  setView]  = useState('wife')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  if (totm.loading) return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#FBF6F1', gap:18,
    }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#F2C4BB,#C9BAE0)', animation:'pulse 2s ease-in-out infinite' }} />
      <p style={{ fontFamily:FFH, fontSize:28, color:'#C2785F', letterSpacing:4, fontStyle:'italic' }}>totm</p>
    </div>
  )

  if (totm.error) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', padding:30, textAlign:'center' }}>
      <p style={{ fontFamily:FF, fontSize:16, color:'#B85C4A', marginBottom:12 }}>⚠️ Could not connect to the database.</p>
      <p style={{ fontFamily:FF, fontSize:13, color:'#9B8880', lineHeight:1.7 }}>
        Please check your Supabase keys in <code>src/lib/supabase.js</code> and ensure the tables exist. See the README for setup instructions.
      </p>
    </div>
  )

  if (!totm.profile?.onboarded) return (
    <Onboarding onComplete={totm.completeOnboarding} />
  )

  // Bundle everything views need
  const viewData = {
    ...totm,
    showToast,
  }

  return (
    <div style={{ fontFamily:FF, minHeight:'100vh', background:'#FBF6F1', color:'#2B1F1A', overflowX:'hidden', position:'relative' }}>
      {/* Background blobs */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 55% at 15% 0%,#F8DDD840,transparent 60%), radial-gradient(ellipse 60% 45% at 85% 100%,#D4E8D028,transparent 60%)' }} />

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Header */}
      <header style={{
        position:'sticky', top:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'13px 20px',
        background:'rgba(251,246,241,.9)', backdropFilter:'blur(18px)',
        borderBottom:'1px solid #EDE5DF',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:16, color:'#C2785F' }}>✦</span>
          <span style={{ fontFamily:FFH, fontSize:22, fontWeight:700, color:'#2B1F1A', letterSpacing:2, fontStyle:'italic' }}>totm</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Sync indicator */}
          <button onClick={() => { totm.refresh(); showToast('Synced ✓') }} style={{
            background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5,
            color:'#B09588', fontFamily:FF, padding:'4px 6px',
          }}>
            <span style={{ fontSize:17, display:'inline-block', animation: totm.syncing ? 'spin .8s linear infinite' : 'none' }}>↻</span>
            {totm.lastSync && <span style={{ fontSize:10, color:'#C0ADA6', letterSpacing:.3 }}>{fmtTime(totm.lastSync)}</span>}
          </button>

          {/* View toggle */}
          <div style={{ display:'flex', background:'#EDE5DF', borderRadius:22, padding:3, gap:2 }}>
            {['wife','husband'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:'6px 14px', borderRadius:18, border:'none',
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? '#2B1F1A' : '#9B8880',
                fontSize:13, fontFamily:FF, cursor:'pointer', fontWeight: view === v ? 700 : 500,
                boxShadow: view === v ? '0 1px 6px rgba(0,0,0,.1)' : 'none',
                transition:'all .2s',
              }}>{v === 'wife' ? 'Sarah' : 'You'}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ position:'relative', zIndex:1 }}>
        {view === 'wife'
          ? <WifeView    data={viewData} />
          : <HusbandView data={viewData} />
        }
      </main>
    </div>
  )
}
