# ✦ TOTM — Halal Cycle Tracker

A private, beautiful web app for Sarah and her husband. Tracks Sarah's cycle phases, daily wellness, and gives her husband a gentle guide on how to show up for her. Fully halal-conscious with Islamic guidance throughout.

**Stack:** React + Vite · Supabase (free PostgreSQL + real-time) · Netlify (free hosting)

---

## 🚀 Deploy in ~15 minutes

### Step 1 — Create your Supabase database (free)

1. Go to **https://supabase.com** → Sign up (free) → **New project**
2. Give it a name (e.g. `totm-app`), choose a region close to you, set a DB password → **Create project**
3. Once ready, go to the **SQL Editor** (left sidebar) and run this SQL to create all tables:

```sql
-- Profile (single shared row)
create table totm_profile (
  id                text primary key,
  avg_cycle_length  int  not null default 28,
  avg_period_length int  not null default 6,
  onboarded         bool not null default false,
  updated_at        timestamptz default now()
);

-- Cycles
create table totm_cycles (
  id         uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date   date,
  created_at timestamptz default now()
);

-- Daily logs
create table totm_logs (
  id        uuid primary key default gen_random_uuid(),
  log_date  date unique not null,
  flow      text,
  mood      int,
  energy    int,
  symptoms  text[],
  notes     text,
  updated_at timestamptz default now()
);

-- Shared notes thread
create table totm_notes (
  id         uuid primary key default gen_random_uuid(),
  author     text not null,
  text       text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (but allow all reads/writes — it's a private shared app)
alter table totm_profile enable row level security;
alter table totm_cycles  enable row level security;
alter table totm_logs    enable row level security;
alter table totm_notes   enable row level security;

create policy "allow_all" on totm_profile for all using (true) with check (true);
create policy "allow_all" on totm_cycles  for all using (true) with check (true);
create policy "allow_all" on totm_logs    for all using (true) with check (true);
create policy "allow_all" on totm_notes   for all using (true) with check (true);

-- Enable real-time for all tables
alter publication supabase_realtime add table totm_profile;
alter publication supabase_realtime add table totm_cycles;
alter publication supabase_realtime add table totm_logs;
alter publication supabase_realtime add table totm_notes;
```

4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long JWT string)

---

### Step 2 — Add your keys

Open `src/lib/supabase.js` and paste your values:

```js
const SUPABASE_URL  = 'https://YOUR-PROJECT.supabase.co'
const SUPABASE_ANON = 'YOUR-ANON-KEY'
```

Or use environment variables (recommended for GitHub):

Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON=YOUR-ANON-KEY
```

---

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "TOTM initial commit"
git remote add origin https://github.com/YOUR-USERNAME/totm-app.git
git push -u origin main
```

---

### Step 4 — Deploy to Netlify (free)

1. Go to **https://netlify.com** → Sign up / Log in
2. Click **Add new site → Import an existing project → GitHub**
3. Select your `totm-app` repo
4. Build settings are auto-detected from `netlify.toml`. Just confirm:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Before deploying**, add environment variables:
   - Go to **Site settings → Environment variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON` with your values
6. Click **Deploy site** — done in ~60 seconds

Netlify gives you a free URL like `https://totm-app.netlify.app`. You can customise the subdomain in site settings.

---

### Step 5 — Share the link

Send the Netlify URL to Sarah. Bookmark it on both your Android and her iPhone. Add it to your home screens:

- **iPhone (Safari):** Open URL → Share button → "Add to Home Screen"
- **Android (Chrome):** Open URL → Menu (⋮) → "Add to Home Screen"

It will appear as an app icon. Real-time sync means you both always see the same data instantly — no refresh needed.

---

## 📁 Project structure

```
totm/
├── src/
│   ├── lib/
│   │   ├── supabase.js     ← Supabase client (add your keys here)
│   │   ├── db.js           ← All database read/write functions
│   │   └── cycle.js        ← Phase engine, predictions, all content
│   ├── hooks/
│   │   └── useTOTM.js      ← Central data hook with real-time subscription
│   ├── components/
│   │   ├── ui.jsx          ← Shared UI components
│   │   ├── Onboarding.jsx  ← First-time setup flow
│   │   ├── WifeView.jsx    ← Sarah's tabs (Home, Log, Cycle, Wellness, Notes)
│   │   └── HusbandView.jsx ← Husband tabs (Dashboard, Care Guide, Notes)
│   ├── App.jsx             ← Root: header, view switcher, sync indicator
│   └── main.jsx            ← React entry point
├── index.html
├── vite.config.js
├── netlify.toml            ← Redirect rule for React Router
├── package.json
└── README.md
```

---

## 🔒 Privacy

This app has no user accounts or passwords by design — it's meant for just the two of you sharing a private link. If you want to add password protection:

**Option A (simplest) — Netlify password protection:**
Site settings → Access control → Set a site password. Anyone visiting needs to enter it.

**Option B — Add Supabase Auth:**
Add email/password login using `supabase.auth`. Happy to build this on request.

---

## ✦ Features

- **Sarah's view:** Home with phase card + period start/end/undo, daily log (flow, mood, energy, symptoms, private notes), cycle history with predictions, wellness & nutrition by phase, shared notes thread
- **Husband's view:** Dashboard with phase summary, Sarah's daily feelings, energy indicator, Islamic intimacy guidance, upcoming period predictions, care guide by phase, shared notes thread
- **Real-time sync:** Supabase websockets — both devices update instantly
- **Phase engine:** Menstrual · Follicular · Ovulation · Luteal — auto-calculated
- **Halal content:** Islamic guidance throughout, haidh rules, ghusl reminders, spiritual notes per phase
- **Vegan nutrition:** All food suggestions are plant-based, phase-appropriate, indulgence-friendly
- **Book mood card:** Reading suggestions tailored to her phase energy

---

## 🛠️ Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

*Built with love. May it bring you both closer, insha'Allah.*
