// ── DATE UTILS ────────────────────────────────────────────────────
export const tod = () => new Date().toISOString().split('T')[0]
export const addD = (d, n) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().split('T')[0] }
export const diffD = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000)
export const fmtShort = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
export const fmtLong  = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
export const fmtTime  = iso => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
export const fmtDay   = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
export const nowISO   = () => new Date().toISOString()
export const timeOfDay = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening' }

// ── PHASE ENGINE ──────────────────────────────────────────────────
export function calcPhase(lastStart, avgCycle, avgPeriod) {
  if (!lastStart) return null
  const t   = tod()
  const day = diffD(lastStart, t) + 1
  if (day < 1 || day > avgCycle + 10) return null

  const ov          = Math.round(avgCycle / 2)
  const nextPeriod  = addD(lastStart, avgCycle)
  const daysUntilNext = diffD(t, nextPeriod)

  const map = {
    menstrual: {
      color:'#F2C4BB', accent:'#B85C4A', emoji:'🌙', name:'Rest & Renewal',
      tagline:'Your body is releasing — give it grace.',
      desc:'The uterine lining is shedding. Energy turns inward; warmth, stillness and gentle nourishment matter most.',
      moodNote:'Sarah may feel tender, introspective, or emotionally raw. Your calm, unhurried presence is everything right now.',
      intimacy:'Intimacy is not permissible during haidh. This is a sacred time of rest — a mercy granted, not a restriction.',
      energy:2
    },
    follicular: {
      color:'#B8D4B0', accent:'#4A7E43', emoji:'🌿', name:'Rising Light',
      tagline:'Energy is returning — something quietly blooming.',
      desc:'Estrogen is climbing, mood is brightening, creativity surges. A wonderful time to start new things and reconnect.',
      moodNote:"Sarah's likely feeling lighter, more talkative and optimistic. She's at her most open — lean in.",
      intimacy:'Intimacy is permissible. Ensure ghusl has been performed after haidh fully ended.',
      energy:4
    },
    ovulation: {
      color:'#F5D98B', accent:'#A8820A', emoji:'✨', name:'Peak Bloom',
      tagline:"She's at her most vibrant — soak it in together.",
      desc:'Peak fertility and confidence. Energy and sociability are at their highest. She feels most herself.',
      moodNote:'Radiant and expressive. Sarah may want to connect deeply — match her energy, be fully present.',
      intimacy:'Intimacy is permissible. This is the fertile window — ideal if you are trying to conceive.',
      energy:5
    },
    luteal: {
      color:'#C9BAE0', accent:'#6A4F9A', emoji:'🌸', name:'Soft Turning',
      tagline:'The tide is slowing — tenderness is the key.',
      desc:'Progesterone rises then falls. PMS symptoms may arrive toward the end. She needs more from you, not less.',
      moodNote:'Sarah may feel more sensitive, overwhelmed, or emotionally heightened. Small kindnesses carry huge weight.',
      intimacy:'Intimacy is permissible. As this phase progresses Sarah may prefer calm, pressure-free evenings.',
      energy:3
    },
  }

  let key
  if (day >= 1 && day <= avgPeriod) key = 'menstrual'
  else if (day > avgPeriod && day < ov - 4) key = 'follicular'
  else if (day >= ov - 4 && day <= ov + 1) key = 'ovulation'
  else key = 'luteal'

  return { ...map[key], phase: key, day, daysUntilNext, nextPeriod, avgCycle }
}

// ── PREDICTIONS ───────────────────────────────────────────────────
export function getPredictions(lastStart, avgCycle, avgPeriod) {
  if (!lastStart) return []
  return [1, 2, 3].map(n => {
    const start = addD(lastStart, avgCycle * n)
    const end   = addD(start, avgPeriod - 1)
    return { start, end }
  })
}

// ── CONTENT ───────────────────────────────────────────────────────
export const NUTRITION = {
  menstrual: {
    meals: [
      { icon:'🫖', title:'Spiced golden latte',     body:'Turmeric, ginger & oat milk with black pepper. Anti-inflammatory magic in a mug.' },
      { icon:'🥬', title:'Iron-rich lentil soup',   body:'Puy lentils, wilted spinach, cumin — squeeze of lemon to boost iron absorption.' },
      { icon:'🍫', title:'70%+ dark chocolate',     body:'Magnesium eases cramps. A square or two is genuinely nourishing — no guilt at all.' },
      { icon:'🍠', title:'Roasted sweet potato bowl', body:'Comforting, grounding, rich in B6. Drizzle with tahini and toasted seeds.' },
    ],
    bookMood: 'Something gentle and familiar — poetry, a short story collection, or rereading a favourite. Nothing that demands too much.',
    islamNote: "You are excused from salah and fasting — this is Allah's mercy, not a burden. Rest is sacred. Continue dhikr and du'a. Ghusl is required once bleeding fully stops.",
  },
  follicular: {
    meals: [
      { icon:'🥗', title:'Vibrant rainbow bowl',    body:'Mixed greens, pomegranate, walnuts, roasted chickpeas — oestrogen loves these nutrients.' },
      { icon:'🫐', title:'Antioxidant smoothie',    body:'Frozen blueberries, banana, flaxseed, oat milk. Supports follicle development beautifully.' },
      { icon:'🌾', title:'Overnight oats',          body:'Slow-release energy for her rising vitality. Maple, chia seeds, fresh berries on top.' },
      { icon:'🍋', title:'Fermented foods',         body:'Kombucha or coconut yoghurt — gut health shines as oestrogen climbs.' },
    ],
    bookMood: 'A compelling novel she has been meaning to start — her focus and imagination are sharp right now.',
    islamNote: 'A great time to make up missed fasts. Her energy is on her side, and spiritual momentum pairs beautifully with her rising mood.',
  },
  ovulation: {
    meals: [
      { icon:'🥦', title:'Cruciferous stir-fry',    body:'Broccoli, bok choy, edamame, tamari — helps metabolise peak oestrogen cleanly.' },
      { icon:'🥑', title:'Avocado on sourdough',    body:'Healthy fats support hormone signalling. Perfectly seasoned — savour it fully.' },
      { icon:'🌱', title:'Zinc-rich seeds',          body:'Pumpkin and hemp seeds on everything — support peak ovarian health.' },
      { icon:'🍓', title:'Treat yourself freely',   body:'This is her highest-energy phase. That vegan dessert she has been eyeing? Today.' },
    ],
    bookMood: 'Something bold and ambitious — a long novel, non-fiction she is curious about, or something that challenges her beautifully.',
    islamNote: 'A wonderful time for acts requiring sustained energy — night prayers, long Quran sessions, or meaningful acts of service.',
  },
  luteal: {
    meals: [
      { icon:'🍫', title:'Vegan chocolate mousse',  body:'Silken tofu, cocoa, maple, vanilla — rich, satisfying and actually nourishing.' },
      { icon:'🥜', title:'Magnesium-rich snacks',   body:'Almond butter on rice cakes, cashews, banana — reduces irritability and bloating.' },
      { icon:'🍲', title:'Warming lentil dal',      body:'Complex carbs stabilise serotonin. A generous pot of dal is grounding and comforting.' },
      { icon:'🫘', title:'Calcium for mood',        body:'Fortified oat milk, tahini, edamame — calcium dramatically reduces PMS mood symptoms.' },
    ],
    bookMood: 'Cosy and comforting — a familiar author, a gentle memoir, or warm literary fiction she can sink into without pressure.',
    islamNote: 'This phase rewards consistency — short surahs, a few minutes of dhikr, gentle routine. Small and steady carries more barakah.',
  },
}

export const CARE = {
  menstrual: [
    '☕  Make her a warm oat milk latte or ginger tea without being asked',
    '🛋️  Offer the heating pad quietly, without making it a moment',
    '📚  Ask what Sarah is reading. Let her drift into her book without interruption',
    '🚫  No expectations on her energy, output, or social availability today',
    "🤲  She is excused from salah — remind her gently that this is mercy, not a shortcoming",
  ],
  follicular: [
    "🌿  She's more energised — plan something you'll both genuinely enjoy",
    "💬  Conversations feel lighter right now — a good time to really check in",
    "📖  Ask what Sarah's been reading or thinking about — she'll light up",
    "🎯  Support a goal she is working on; her focus and creativity are at their sharpest",
  ],
  ovulation: [
    "✨  Tell her she is radiant — she'll feel you mean it right now",
    '🌹  A small, thoughtful gesture goes further than grand plans',
    "💬  She's at her most expressive — have the meaningful conversations today",
    '🍽️  Suggest trying a new vegan restaurant or cook something adventurous together',
  ],
  luteal: [
    "💛  More patience is needed — she's carrying more, not being more difficult",
    "🍫  Stock the fridge with her favourite vegan treats before she has to ask",
    "📱  Phone down when you're together — undivided attention is the real gift",
    "🛁  A quiet evening with her book and a candle may be her perfect night — offer it",
    '🤗  A long hug without agenda says more than any words right now',
  ],
}

export const MOODS    = [{v:1,l:'Low',e:'😔'},{v:2,l:'Tired',e:'😴'},{v:3,l:'Okay',e:'😐'},{v:4,l:'Good',e:'🙂'},{v:5,l:'Great',e:'😊'}]
export const FLOWS    = ['None','Spotting','Light','Medium','Heavy']
export const SYMPTOMS = ['Cramps','Headache','Bloating','Fatigue','Back pain','Nausea','Tender','Spotting','Mood swings','Cravings','Brain fog','Insomnia']
