# HEKA WebApp — Claude Code 專案指引

## 你是誰、你要做什麼

你是智腦生醫科技的 WebApp 開發工程師。你的任務是開發「家賀康 HEKA 智慧照護關懷系統」的 WebApp 版本，取代目前用 Unity 製作的手機端 APP。

HEKA 是一個 AI 電子寵物長照陪伴平台。核心系統運行在長輩面前的平板上（Unity 開發，已完成），長輩跟一隻 3D 虛擬寵物（企鵝）互動。你要開發的 WebApp 是給「家人」和「機構照服員」用的——他們透過手機或電腦查看長輩的互動數據、設定提醒、管理照護分工。

**核心標語：「讓被照顧者，成為照顧者」**
長輩在照顧虛擬寵物的過程中，不知不覺完成認知訓練、復健運動、健康衛教。

---

## 系統全貌（三端一雲）

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────┐
│   平板端 (Unity)  │     │   雲端 API    │     │  WebApp (你做的)   │
│   長輩直接使用     │ ──→ │  JSON + 二進位 │ ──→ │  家人/機構使用      │
│                  │     │              │     │                   │
│ • AI 寵物對話     │     │ • 資料儲存     │     │ • 摘要 Dashboard   │
│ • 認知訓練遊戲    │     │ • AI 分析     │     │ • 照護者分享       │
│ • 骨架偵測復健    │     │ • 推播通知     │     │ • AI 分析報告      │
│ • 語音互動       │     │              │     │ • 提醒/溝通設定    │
└─────────────────┘     └──────────────┘     └──────────────────┘
```

**現有 API 格式：** JSON + 二進位（binary），由後端工程師廖品全維護。
**WebApp 開發階段先用 mock data 建 UI prototype**，後續再串接實際 API。

---

## 平板端功能概述（你不開發這些，但你需要理解它們產出什麼數據）

平板端是長輩每天面對的介面，上面跑著一隻 3D AI 企鵝寵物。寵物會以三種「專家角色」切換運作：

### 角色 1：開心夥伴（情緒關懷 + 社交互動）
- 講笑話、聊八卦、懷舊治療引導、猜謎、唱歌
- 不做心理諮商，做的是「一隻有趣的寵物朋友」
- 目標：讓長輩每天願意打開平板
- **產出數據：** 對話文字紀錄、音檔、情緒標籤、互動時長

### 角色 2：認知教練（認知訓練引導 + 衛教）
- 認知遊戲的「前後包裝」——遊戲前暖身解說，遊戲後鼓勵 + 帶入衛教
- 可根據醫囑調整今日遊戲重點
- 平板端已有 6 款認知遊戲（基於 CASI 認知評估框架）
- 每款遊戲有 4 種模式：Tutorial（不限時教學）、Easy、Medium、Hard
- **產出數據：** 遊戲分數（各維度）、課程完成度、對話中的症狀自述

### 角色 3：復健教練（運動帶操 + 骨架偵測）
- 語音引導復健動作，搭配骨架偵測即時判斷正確性
- 骨架偵測功能即將上線
- **產出數據：** 運動完成度、動作正確率、活動時長

### 平板端其他功能
- 提醒接收：WebApp 端設定的提醒，會由 AI 寵物以自然對話方式傳達給長輩
- 相簿顯示：家人從 WebApp 傳的照片，會在平板端展示
- 感測器連接：門窗感測器、動作感測器（IoT）
- 血壓機數據：有介面但目前無實際硬體連接

---

## 現有手機 APP 截圖說明（附件）

現有 APP 用 Unity 開發，以下是各畫面的功能說明：

### 封面 / 啟動頁
- 標題：「家賀康 HEKA 智慧照護關懷系統」
- 副標題：「有溫度的 AI，讓陪伴變得更簡單」
- 吉祥物：3D 企鵝角色
- APP 版標示

### 底部導航結構（5 個 Tab）
1. **摘要**（♡ 圖示）— 目前顯示「敬請期待」，要做成 Apple Health 式 Dashboard
2. **分享**（👥 圖示）— 目前顯示「敬請期待」，要做成照護者數據分享
3. **中央浮動按鈕**（✦ 圖示）— AI 分析入口，帶有漸層圓形按鈕設計
4. **提醒**（🔔 圖示）— 已完成，功能完整
5. **瀏覽**（🖥 圖示）— 包含相簿、感測器、血壓機、帳號設定

### 提醒功能（已完成，遷移到 WebApp）
- **提醒列表頁**：按分類顯示（生活健康 / 日常娛樂 / 關懷互動 / 貼心提醒）
- 每條提醒顯示：時間、重複規則、開關 toggle、釘選
- **新增提醒頁**：
  - 類別：下拉選單
  - 日期 / 時間選擇器
  - 重複：不重複 / 每天 / 自訂
  - 模式：AI / 訊息（左右 toggle 切換）
  - 主題：健康關懷等下拉選單
  - 未回應通知：開關
  - 顯示設定者：開關

### 瀏覽功能
- **相簿**：相簿分類（Test01, Test02...）+ 照片牆（grid layout）
- **感測器**：
  - 門窗感測器：ON/OFF 狀態 + 電量
  - 動作感測器：觸發時間 + 電量
- **血壓機（生命徵象）**：高壓/低壓/脈搏數值顯示 + 測量時間
- **帳號設定**：語言切換（繁體中文）+ 登出按鈕

### AI 分析功能
- 標題：「AI 分析」
- Emotional curve 圖表（Happy 趨勢線，1 day 時間軸）
- 預設提問按鈕：「長輩最近談話關鍵字」「長輩的睡眠狀況」「長輩最近在想什麼」
- 底部：文字輸入框 + 語音輸入按鈕

### 後台管理端
- 機構端有管理後台，可管理多位住民的數據
- 後台 API 同樣使用 JSON + 二進位格式

---

## WebApp 設計規範

### 視覺風格
- **背景：** 淺藍綠 → 淡紫色漸層（延續現有 APP 風格）
- **主色調：** 紫色系（#7C3AED 為主 accent）
- **卡片：** 白色圓角卡片 + 淺灰邊框
- **底部導航：** 白色圓弧底欄 + 中央浮動圓形按鈕
- **整體調性：** 柔和、溫暖、不冰冷的科技感。這是給長輩的家人用的，不是給工程師用的
- **字體：** 繁體中文為主
- **設計品質標準：** 高標準，追求專業感而非「安全模板」

### 響應式設計
- 必須適配手機（375px）和平板（768px+）
- 優先設計手機版，平板版自適應

### 不要做的事
- 不需要 AI 寵物的 3D 渲染（寵物在平板端）
- 不要設計長輩操作的介面（長輩用平板端）
- 不要串接真實 API（先用 mock data）

---

## 開發優先級

### Phase 1（P1 — 先做這些）
1. **摘要頁**：4 張數據卡片（今日對話摘要、情緒狀態、互動活躍度、今日課程進度）
2. **提醒頁**：遷移現有功能（提醒列表 + 新增提醒表單）
3. **AI 分析頁**：情緒曲線 + 遊戲成績 + 角色排程
4. **瀏覽頁**：相簿 + 帳號設定

### Phase 2（P2 — 接著做）
5. **分享頁**：邀請照顧者 + 數據權限管理
6. 摘要頁新增卡片：認知雷達圖、關鍵字雲、症狀追蹤
7. 異常推播通知
8. 復健運動報告

### Phase 3（P3 — 未來）
9. 照護報告匯出 PDF
10. 認知語言指標
11. 語音健康指標追蹤

---

## Mock Data 結構建議

開發 UI 時使用以下 mock data 結構，未來接 API 時直接替換：

```typescript
// 長輩資料
interface Elder {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  deviceStatus: 'online' | 'offline';
}

// 今日對話摘要
interface DailySummary {
  date: string;
  summary: string; // "今天跟小企鵝聊到想去菜市場，說膝蓋有點痠"
  keyTopics: string[];
  totalDuration: number; // 分鐘
  sessionCount: number;
}

// 情緒狀態
interface EmotionData {
  date: string;
  hourly: { hour: number; score: number; label: 'happy' | 'neutral' | 'sad' }[];
  weeklyTrend: { date: string; avgScore: number }[];
}

// 課程進度
interface CourseProgress {
  date: string;
  scheduled: number;
  completed: number;
  games: {
    name: string;
    score: number;
    difficulty: 'tutorial' | 'easy' | 'medium' | 'hard';
    casiDimension: string; // '注意力' | '記憶力' | '語言' | '執行功能' 等
  }[];
}

// 提醒
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
}

// 角色排程
interface RoleSchedule {
  dayOfWeek: number; // 0-6
  slots: {
    startTime: string;
    endTime: string;
    role: '開心夥伴' | '認知教練' | '復健教練';
  }[];
}
```

---

## 專案結構建議

```
heka-mobileAPP/
├── CLAUDE.md              ← 你正在讀的這份文件
├── public/
├── src/
│   ├── components/
│   │   ├── layout/        ← 底部導航、頁面殼
│   │   ├── cards/         ← 摘要頁的各種數據卡片
│   │   ├── charts/        ← 圖表元件（情緒曲線、雷達圖等）
│   │   ├── reminders/     ← 提醒相關元件
│   │   ├── analysis/      ← AI 分析頁元件
│   │   └── shared/        ← 通用元件（按鈕、卡片殼、toggle 等）
│   ├── pages/
│   │   ├── SummaryPage    ← Tab 1 摘要
│   │   ├── SharePage      ← Tab 2 分享
│   │   ├── AnalysisPage   ← Tab 3 AI 分析
│   │   ├── RemindersPage  ← Tab 4 提醒
│   │   └── BrowsePage     ← Tab 5 瀏覽
│   ├── mock/              ← Mock data
│   ├── hooks/             ← Custom hooks
│   ├── types/             ← TypeScript 型別定義
│   └── styles/            ← 全域樣式、主題色
├── package.json
└── tsconfig.json
```

---

## 關鍵提醒

1. 這是一個**有溫度的照護產品**，不是冰冷的管理系統。UI 語氣要溫暖。
2. 使用者可能是 50 歲以上的子女或 30 歲的照服員，**操作要直覺**。
3. 摘要頁是 WebApp 的靈魂——使用者打開 APP 第一眼要能回答：「我爸/媽今天過得怎麼樣？」
4. 提醒頁的「AI 模式 / 訊息模式」切換是核心互動，要做得順手。
5. 設計品質標準高，創辦人 Peter 的設計偶像是 Palmer Luckey（Anduril），不接受「安全模板」。
