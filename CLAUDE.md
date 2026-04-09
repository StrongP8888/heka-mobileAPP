# HEKA Mobile APP — Project Guide for Claude Code

## Project Overview

**Product:** HEKA (家賀康) Smart Care Companion System — Mobile APP
**Company:** ZhiNao BioMedical Technology Co., Ltd. (智腦生醫科技), Kaohsiung, Taiwan
**CEO:** Peter Liao (廖翊翔)

HEKA is an AI virtual pet eldercare companion platform. The core system runs on a tablet in front of the elderly user (built with Unity, already complete) — the elder interacts with a 3D virtual penguin pet that provides cognitive training, rehabilitation exercises, and emotional companionship.

**This project is the mobile APP** — used by **family members** and **institutional caregivers** to monitor the elder's interaction data, manage health, set up communications, and talk to an AI assistant. The elder does NOT use this app; they use the tablet.

**Core tagline: "Let the cared-for become the caregiver."**
Elders unknowingly complete cognitive training, rehabilitation, and health education while caring for their virtual pet.

---

## System Architecture (Three Endpoints + Cloud)

```
┌──────────────────┐     ┌───────────────┐     ┌───────────────────┐
│  Tablet (Unity)   │     │   Cloud API   │     │ Mobile APP (yours) │
│  Elder uses this  │ ──→ │  JSON + binary│ ──→ │ Family/staff uses  │
│                   │     │               │     │                    │
│ • AI pet dialogue │     │ • Data storage│     │ • Home dashboard   │
│ • Cognitive games │     │ • AI analysis │     │ • Health management│
│ • Skeleton rehab  │     │ • Push notifs │     │ • AI assistant     │
│ • Voice interact  │     │               │     │ • Contact (remind) │
└──────────────────┘     └───────────────┘     └───────────────────┘
```

**Existing API format:** JSON + binary, maintained by backend engineer.
**Current dev phase: Use mock data for UI prototype.** No real API integration yet.

---

## AI Pet Expert Roles (Run on tablet, data shown in mobile APP)

The AI penguin pet operates in three expert personas, switched by schedule or context:

### Role 1: Happy Buddy (開心夥伴) — Emotional & Social
- Tells jokes, chats about daily life, reminiscence therapy, riddles, singing
- Goal: Make the elder want to open the tablet every day
- NOT therapy — it's "a fun penguin friend"
- **Output data:** Conversation text, audio files, emotion labels, session duration

### Role 2: Cognitive Coach (認知教練) — Training & Education
- Wraps cognitive games with warm-up dialogue and post-game encouragement + health education
- Can adjust game focus based on doctor's orders
- 6 cognitive games based on CASI assessment framework, 4 difficulty modes each (Tutorial/Easy/Medium/Hard)
- **Output data:** Game scores (per CASI dimension), course completion rate, health education completion, symptom mentions from dialogue

### Role 3: Rehab Coach (復健教練) — Exercise & Skeleton Detection
- Voice-guided rehabilitation exercises with real-time skeleton detection feedback (coming soon)
- **Output data:** Exercise completion rate, movement accuracy, activity duration

---

## APP Tab Architecture (V04 — Final)

### Bottom Navigation (5 tabs)

| Tab | Chinese | English | One-line definition |
|-----|---------|---------|-------------------|
| 1 | 首頁 | Home | "How is grandma doing today?" |
| 2 | 健康 | Health | "Manage grandma's health" |
| 3 | AI 助手 | AI Assistant | "I have a question" (center floating button) |
| 4 | 聯繫 | Contact | "Talk to grandma" |
| 5 | 更多 | More | "Settings & management" |

---

### Tab 1 — Home (Dashboard — merged Summary + AI Analysis)

Single scrollable page showing all elder status. Important info at top, detailed analysis below. Inspired by Apple Health summary page.

**Top section — Today's Snapshot (P1):**
- **Daily conversation summary** — AI-generated 2-3 sentence summary of what the elder talked about today
- **Emotion status** — Combined text + voice emotion analysis, today's curve + 7-day trend
- **Interaction activity** — Today's session count + total duration + 7-day mini trend bars
- **Course progress** — Ring progress chart (scheduled vs completed)
- **Medication progress** — Small ring "3/5 taken" + interaction warning badge if conflicts exist

**Middle section — Deep Analysis (P1):**
- **Emotion curve (full)** — Switchable 1-day / 7-day / 30-day view
- **Conversation log** — Filterable by role (Happy Buddy / Cognitive Coach / Rehab Coach) + timeline view

**Bottom section — Advanced Data (P2):**
- **CASI cognitive radar chart** — 6-dimension scores mapped to games
- **Game score trends** — Line charts per game
- **Role schedule manager** — Weekly calendar + time slot assignment
- **Keyword cloud** — Most mentioned words in past 7 days
- **Symptom tracking** — AI-extracted health mentions from dialogue ("knee pain", "no appetite"), shown as timeline

---

### Tab 2 — Health (Medication + Supplements + Education)

Three sub-tabs: 💊 Medication / 🧴 Supplements / 📋 Education

**💊 Medication (P1):**
- Prescription drug list — Build elder's current medication list
- Today's medication schedule — What to take, when, taken or not
- **Drug interaction checker** — Auto-scan medication vs supplement conflicts, red warnings (critical feature for medical partnerships)
- Adherence trend chart (weekly/monthly)
- Medication expiry / follow-up appointment reminders

**🧴 Supplements (P2):**
- Supplement item management — Elder's current supplement list
- AI scan recognition — Photo supplement packaging, AI auto-identifies and creates entry (SuppleMate technology)
- Knowledge base search — Search by name or effect
- Situational recommendations — Hangover recovery, sleep improvement, etc.

**📋 Education (P2):**
- AI pet education log — What health knowledge was taught today
- Body status tracking — Energy / sleep / digestion trends
- Health knowledge cards — Elder-appropriate educational content

**Technical note:** The Health tab integrates technology from SuppleMate (supplementmate.vercel.app), a separate supplement tracking app by the same team. The drug interaction engine and supplement knowledge base are reused here.

---

### Tab 3 — AI Assistant (Center Floating Button)

Conversational AI interface. Family/caregivers ask questions directly.

**P1:**
- Text + voice input
- Preset quick questions: "How is grandma today?", "Is she in a good mood?", "Did she take her medicine?"
- Smart summary push: "Today's highlight: Grandma mentioned knee pain, suggest follow-up"

**P2:**
- Action commands: "Set a medication reminder for tomorrow 3 PM"
- Drug queries: "Does grandma's calcium conflict with her blood pressure medication?"
- Voice conversation mode

---

### Tab 4 — Contact (Reminders + Media Sending)

Two sub-tabs: 📋 Reminders / 📸 Send

The concept is **"electronic answering machine"** — family/staff set messages, AI pet delivers them to the elder in natural conversation.

**📋 Reminders (P1):**
- Reminder list — Categorized (Daily Health / Entertainment / Care / Personal)
- **AI mode** — AI pet delivers reminder through natural conversation
- **Message mode** — Family records voice / types text / sends photo, AI pet relays it
- New reminder form — Category, date, time, repeat, mode (AI/Message), topic, no-response notification, show sender toggle
- **Auto-linked medication reminders** — Drug schedules from Health tab automatically appear here

**📸 Send (P1):**
- Photo album — Grid view + categories + "sent by" label
- Take/select photo — One-tap send to elder's tablet
- Voice message — Record audio, AI pet plays it for elder
- Video sending

**P2:**
- Good morning images / Holiday greetings — Template selection + custom text, scheduled delivery

---

### Tab 5 — More

- **Share management** — Invite caregivers (family/staff/doctor), set data visibility permissions per person
- Account settings — Profile, language switch (Traditional Chinese), logout
- Linked elder — Tablet connection status, device ID, last activity time
- Device management — Sensor pairing (door/motion sensors)
- Notification settings — Push preferences, anomaly alert toggles
- **Install to home screen** — PWA installation guide button
- About HEKA

---

## Data Flow

```
Tablet (Elder uses)
  AI pet conversations (3 roles) + cognitive games + skeleton detection
       ↓
  Conversation text + audio files + game scores + skeleton data
       ↓
Cloud Analysis Layer
  LLM summarization / emotion analysis / voice feature extraction / CASI mapping / drug interaction check
       ↓
  Structured data + analysis results
       ↓
Mobile APP (Family/staff uses)
  Home dashboard + Health management + AI assistant + Contact
```

---

## Design Specifications

### Visual Style
- **Background:** Light teal → light purple gradient (consistent with existing app)
- **Accent color:** Purple (#7C3AED primary)
- **Cards:** White with rounded corners + very subtle box-shadow
- **Bottom nav:** White curved bar + center floating circular button (purple→teal gradient)
- **Overall tone:** Warm, approachable, humane technology — NOT cold/clinical
- **Typography:** Traditional Chinese (繁體中文)
- **Transitions:** All interactions must have 200-300ms ease transitions
- **Quality bar:** High — founder's design idol is Palmer Luckey (Anduril). No generic templates.

### Responsive
- Mobile-first (375px), tablet auto-adapt
- Desktop: max-width: 480px + margin: 0 auto (constrain to phone-like experience)

### Do NOT
- Do NOT render AI pet 3D — pet lives on the tablet
- Do NOT design elder-facing interfaces — elders use the tablet
- Do NOT connect to real APIs — use mock data for now
- Do NOT use dark theme — the app uses light theme with gradient background

---

## Development Priority

### Phase 1 (Build first)
1. **Home** — Top section (5 summary cards) + middle section (emotion curve + conversation log)
2. **Contact** — Reminders (migrate existing functionality) + Send (album + photo capture)
3. **Health** — Medication (drug list + schedule + interaction checker)
4. **More** — Account settings + share management
5. **Bottom navigation** — 5 tabs with center floating button

### Phase 2 (Then)
6. **AI Assistant** — Conversational AI interface
7. **Health** — Supplements + Education sub-tabs
8. **Home** — Bottom section (radar chart + schedule + keyword cloud)
9. **Contact** — Good morning templates / holiday greetings

### Phase 3 (Future)
10. AI Assistant — Action commands + drug queries
11. Care report PDF export
12. Cognitive language indicators / voice health tracking

---

## Mock Data Types

```typescript
interface Elder {
  id: string;
  name: string;        // e.g. "王奶奶"
  age: number;
  avatar?: string;
  deviceStatus: 'online' | 'offline';
  lastActiveAt?: string;
}

interface DailySummary {
  date: string;
  summary: string;     // "今天跟小企鵝聊到想去菜市場，說膝蓋有點痠"
  keyTopics: string[];
  totalDuration: number; // minutes
  sessionCount: number;
}

interface EmotionData {
  date: string;
  hourly: { hour: number; score: number; label: 'happy' | 'neutral' | 'sad' }[];
  weeklyTrend: { date: string; avgScore: number }[];
}

interface CourseProgress {
  date: string;
  scheduled: number;
  completed: number;
  games: {
    name: string;      // e.g. "財神金頭腦", "柴神記憶長河"
    score: number;
    difficulty: 'tutorial' | 'easy' | 'medium' | 'hard';
    casiDimension: string; // '注意力' | '記憶力' | '語言' | '執行功能' | '空間感' | '定向力'
  }[];
}

interface Medication {
  id: string;
  name: string;         // Drug or supplement name
  brandName?: string;
  type: 'prescription' | 'supplement';
  category: string;     // e.g. "抗生素", "骨質疏鬆", "維生素"
  dosage: string;
  frequency: '每日' | '週期' | '需要時' | '訓練日';
  timeSlots: string[];  // e.g. ["08:00", "20:00"]
  takenToday: boolean;
  interactions: {
    conflictWith: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

interface MedicationProgress {
  date: string;
  scheduled: number;
  taken: number;
  hasWarnings: boolean;
}

interface Reminder {
  id: string;
  category: '生活健康' | '日常娛樂' | '關懷互動' | '貼心提醒';
  time: string;
  repeat: '不重複' | '每天' | string;
  mode: 'ai' | 'message';
  topic: string;
  content?: string;
  enabled: boolean;
  pinned: boolean;
  notifyOnNoResponse: boolean;
  showSender: boolean;
  linkedMedicationId?: string; // Auto-generated from Health tab
}

interface ConversationEntry {
  id: string;
  date: string;
  time: string;
  duration: number;     // minutes
  role: '開心夥伴' | '認知教練' | '復健教練';
  summary: string;      // e.g. "聊到以前在市場賣菜的日子，心情很好，還哼了一首歌"
  emotionLabel: 'happy' | 'neutral' | 'sad';
  symptoms?: string[];  // e.g. ["膝蓋痠", "沒胃口"]
}

interface RoleSchedule {
  dayOfWeek: number;    // 0=Sunday, 1=Monday...
  slots: {
    startTime: string;
    endTime: string;
    role: '開心夥伴' | '認知教練' | '復健教練';
  }[];
}

interface PhotoAlbum {
  id: string;
  name: string;         // e.g. "全家福", "日常生活"
  photoCount: number;
}

interface Photo {
  id: string;
  albumId: string;
  url: string;
  sentBy: string;       // e.g. "女兒 小明", "照服員 小華"
  sentAt: string;
  caption?: string;
}

interface CaregiverShare {
  id: string;
  name: string;
  role: '家人' | '照服員' | '醫師';
  email: string;
  status: 'active' | 'pending';
  visibleDataCount: number;
}
```

---

## Project Structure

```
heka-mobileAPP/
├── CLAUDE.md                          ← This file (project guide)
├── docs/
│   ├── HEKA_WEBAPP_PROJECT_BRIEF.md   ← Supplementary specs
│   ├── HEKA_MobileApp_V02.pdf         ← Current WebApp V02 screenshots
│   ├── HEKA_Tablet_Backend.pdf        ← Tablet + admin backend
│   └── SuppleMate_App.pdf             ← Supplement tracking app reference
├── public/
├── src/
│   ├── components/
│   │   ├── layout/        ← Bottom nav, page shell, tab container
│   │   ├── cards/         ← Home page summary cards
│   │   ├── charts/        ← Charts (emotion curve, radar, trends)
│   │   ├── health/        ← Health tab (medication/supplements/education)
│   │   ├── contact/       ← Contact tab (reminders/send)
│   │   ├── assistant/     ← AI assistant chat interface
│   │   └── shared/        ← Common components (buttons, toggles, etc.)
│   ├── pages/
│   │   ├── HomePage.tsx       ← Tab 1
│   │   ├── HealthPage.tsx     ← Tab 2
│   │   ├── AssistantPage.tsx  ← Tab 3
│   │   ├── ContactPage.tsx    ← Tab 4
│   │   └── MorePage.tsx       ← Tab 5
│   ├── mock/              ← Mock data files
│   ├── hooks/
│   ├── types/             ← TypeScript type definitions
│   └── styles/            ← Global styles, theme colors
├── package.json
└── tsconfig.json
```

---

## Existing V02 Progress (What's already built)

The following pages exist from V02 and need to be **restructured** into the V04 tab architecture:

- ✅ Share page (caregivers + permissions) → Move to **More** tab
- ✅ AI Analysis — Emotion tab (curve chart) → Move to **Home** middle section
- ✅ AI Analysis — Conversation tab (role filter + timeline) → Move to **Home** middle section
- ✅ AI Analysis — Game tab (CASI radar + trends) → Move to **Home** bottom section
- ✅ AI Analysis — Schedule tab (weekly role calendar) → Move to **Home** bottom section
- ✅ Reminders — List + new form (AI/message dual mode) → Keep in **Contact** tab
- ✅ Browse — Album (photo grid + categories) → Move to **Contact > Send** sub-tab
- ✅ Browse — Account settings → Move to **More** tab
- ✅ Browse — Blood pressure (vital signs) → Move to **Health** tab
- ❌ Home page — NOT YET BUILT (highest priority)
- ❌ Health tab — NOT YET BUILT
- ❌ AI Assistant — NOT YET BUILT

---

## Critical Reminders

1. This is a **warm, humane care product**, not a cold management dashboard. UI copy should feel caring.
2. Users are 50-year-old children or 30-year-old caregivers — **interactions must be intuitive**.
3. Home page is the soul — opening the app must instantly answer: "How is grandma doing today?"
4. The drug interaction checker in Health tab is the **key selling point** for medical partnerships (e.g., with Dr. Wang Yu-Jun at Kaohsiung Veterans General Hospital).
5. Contact tab unifies all elder communication — reminders, photos, voice messages — in one place.
6. AI Assistant is the **universal entry point** — don't know where a feature is? Ask the assistant.
7. All UI text should be in **Traditional Chinese** (繁體中文).
8. Design quality must be exceptionally high — no generic templates accepted.
