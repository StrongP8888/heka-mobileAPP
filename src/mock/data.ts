import type { Elder, DailySummary, EmotionData, CourseProgress, ActivityData, Reminder, ConversationRecord, GameScore, RoleSchedule, Caregiver, SharePermission, Medication, MedicationProgress } from '../types';

export const mockElder: Elder = {
  id: 'elder-001',
  name: '王奶奶',
  age: 78,
  avatar: undefined,
  deviceStatus: 'online',
};

export const mockDailySummary: DailySummary = {
  date: '2026-04-09',
  summary: '今天跟小美聊到想去菜市場買菜，說膝蓋有點痠但精神不錯。下午玩了記憶遊戲，還教小美唱了一首歌。',
  keyTopics: ['菜市場', '膝蓋痠', '唱歌', '記憶遊戲'],
  totalDuration: 47,
  sessionCount: 4,
};

export const mockEmotionData: EmotionData = {
  date: '2026-04-09',
  hourly: [
    { hour: 8, score: 72, label: 'happy' },
    { hour: 9, score: 68, label: 'neutral' },
    { hour: 10, score: 75, label: 'happy' },
    { hour: 11, score: 80, label: 'happy' },
    { hour: 13, score: 60, label: 'neutral' },
    { hour: 14, score: 65, label: 'neutral' },
    { hour: 15, score: 78, label: 'happy' },
    { hour: 16, score: 82, label: 'happy' },
  ],
  weeklyTrend: [
    { date: '04/03', avgScore: 65 },
    { date: '04/04', avgScore: 70 },
    { date: '04/05', avgScore: 62 },
    { date: '04/06', avgScore: 75 },
    { date: '04/07', avgScore: 68 },
    { date: '04/08', avgScore: 73 },
    { date: '04/09', avgScore: 76 },
  ],
};

export const mockCourseProgress: CourseProgress = {
  date: '2026-04-09',
  scheduled: 5,
  completed: 3,
  games: [
    { name: '財神金頭腦', score: 80, difficulty: 'medium', casiDimension: '注意力' },
    { name: '柴神記憶長河', score: 72, difficulty: 'easy', casiDimension: '記憶力' },
    { name: '神手抓福氣', score: 88, difficulty: 'medium', casiDimension: '手眼協調' },
  ],
};

export const mockActivityData: ActivityData = {
  date: '2026-04-09',
  sessionCount: 4,
  totalMinutes: 47,
  weeklyTrend: [
    { date: '04/03', minutes: 32 },
    { date: '04/04', minutes: 45 },
    { date: '04/05', minutes: 28 },
    { date: '04/06', minutes: 52 },
    { date: '04/07', minutes: 38 },
    { date: '04/08', minutes: 41 },
    { date: '04/09', minutes: 47 },
  ],
};

// === AI 分析頁 Mock Data ===

export const mockConversations: ConversationRecord[] = [
  { id: 'c1', date: '2026-04-09', time: '08:15', role: '開心夥伴', summary: '聊到以前在市場賣菜的日子，心情很好，還哼了一首歌', duration: 12, emotionLabel: 'happy' },
  { id: 'c2', date: '2026-04-09', time: '09:30', role: '認知教練', summary: '玩了財神金頭腦，九九乘法中等難度，正確率 80%', duration: 8, emotionLabel: 'neutral' },
  { id: 'c3', date: '2026-04-09', time: '10:45', role: '開心夥伴', summary: '講了三個笑話，奶奶笑得很開心，主動聊到孫子', duration: 15, emotionLabel: 'happy' },
  { id: 'c4', date: '2026-04-09', time: '14:00', role: '認知教練', summary: '柴神記憶長河順向記憶模式，完成 3 關', duration: 10, emotionLabel: 'neutral' },
  { id: 'c5', date: '2026-04-09', time: '15:30', role: '復健教練', summary: '上肢伸展運動 10 分鐘，動作完成度 85%', duration: 12, emotionLabel: 'happy' },
  { id: 'c6', date: '2026-04-08', time: '09:00', role: '開心夥伴', summary: '懷舊治療：聊到小時候過年的記憶，情緒穩定偏正向', duration: 18, emotionLabel: 'happy' },
  { id: 'c7', date: '2026-04-08', time: '11:00', role: '認知教練', summary: '神手抓福氣初階模式，福氣值 1200', duration: 7, emotionLabel: 'happy' },
  { id: 'c8', date: '2026-04-08', time: '14:30', role: '復健教練', summary: '坐姿有氧 15 分鐘，完成度 90%', duration: 15, emotionLabel: 'neutral' },
];

export const mockGameScores: GameScore[] = [
  {
    name: '財神金頭腦',
    casiDimension: '注意力・計算力',
    scores: [
      { date: '04/03', score: 65 }, { date: '04/04', score: 70 },
      { date: '04/05', score: 68 }, { date: '04/06', score: 75 },
      { date: '04/07', score: 72 }, { date: '04/08', score: 78 },
      { date: '04/09', score: 80 },
    ],
  },
  {
    name: '柴神記憶長河',
    casiDimension: '短期記憶',
    scores: [
      { date: '04/03', score: 55 }, { date: '04/04', score: 58 },
      { date: '04/05', score: 60 }, { date: '04/06', score: 62 },
      { date: '04/07', score: 65 }, { date: '04/08', score: 68 },
      { date: '04/09', score: 72 },
    ],
  },
  {
    name: '神手抓福氣',
    casiDimension: '手眼協調',
    scores: [
      { date: '04/03', score: 70 }, { date: '04/04', score: 75 },
      { date: '04/05', score: 72 }, { date: '04/06', score: 80 },
      { date: '04/07', score: 82 }, { date: '04/08', score: 85 },
      { date: '04/09', score: 88 },
    ],
  },
];

export const mockCasiRadar = [
  { dimension: '注意力', score: 78, fullMark: 100 },
  { dimension: '記憶力', score: 65, fullMark: 100 },
  { dimension: '語言', score: 82, fullMark: 100 },
  { dimension: '執行功能', score: 60, fullMark: 100 },
  { dimension: '空間感', score: 70, fullMark: 100 },
  { dimension: '定向力', score: 75, fullMark: 100 },
];

export const mockWeeklyEmotion = [
  {
    date: '04/03',
    hourly: [
      { hour: 8, score: 65, label: 'neutral' as const }, { hour: 10, score: 70, label: 'happy' as const },
      { hour: 14, score: 55, label: 'sad' as const }, { hour: 16, score: 68, label: 'neutral' as const },
    ],
  },
  {
    date: '04/04',
    hourly: [
      { hour: 9, score: 72, label: 'happy' as const }, { hour: 11, score: 75, label: 'happy' as const },
      { hour: 14, score: 60, label: 'neutral' as const }, { hour: 16, score: 70, label: 'happy' as const },
    ],
  },
  {
    date: '04/05',
    hourly: [
      { hour: 8, score: 58, label: 'neutral' as const }, { hour: 10, score: 62, label: 'neutral' as const },
      { hour: 14, score: 55, label: 'sad' as const }, { hour: 16, score: 60, label: 'neutral' as const },
    ],
  },
  {
    date: '04/06',
    hourly: [
      { hour: 9, score: 75, label: 'happy' as const }, { hour: 11, score: 80, label: 'happy' as const },
      { hour: 14, score: 70, label: 'happy' as const }, { hour: 16, score: 72, label: 'happy' as const },
    ],
  },
  {
    date: '04/07',
    hourly: [
      { hour: 8, score: 62, label: 'neutral' as const }, { hour: 10, score: 68, label: 'neutral' as const },
      { hour: 14, score: 65, label: 'neutral' as const }, { hour: 16, score: 70, label: 'happy' as const },
    ],
  },
  {
    date: '04/08',
    hourly: [
      { hour: 9, score: 70, label: 'happy' as const }, { hour: 11, score: 75, label: 'happy' as const },
      { hour: 14, score: 68, label: 'neutral' as const }, { hour: 16, score: 73, label: 'happy' as const },
    ],
  },
  {
    date: '04/09',
    hourly: [
      { hour: 8, score: 72, label: 'happy' as const }, { hour: 10, score: 75, label: 'happy' as const },
      { hour: 14, score: 65, label: 'neutral' as const }, { hour: 16, score: 82, label: 'happy' as const },
    ],
  },
];

export const mockRoleSchedule: RoleSchedule[] = [
  { dayOfWeek: 0, slots: [
    { startTime: '08:00', endTime: '10:00', role: '開心夥伴' },
    { startTime: '10:00', endTime: '12:00', role: '認知教練' },
    { startTime: '14:00', endTime: '16:00', role: '復健教練' },
  ]},
  { dayOfWeek: 1, slots: [
    { startTime: '08:00', endTime: '10:00', role: '開心夥伴' },
    { startTime: '10:00', endTime: '11:30', role: '認知教練' },
    { startTime: '14:00', endTime: '15:00', role: '開心夥伴' },
    { startTime: '15:00', endTime: '16:00', role: '復健教練' },
  ]},
  { dayOfWeek: 2, slots: [
    { startTime: '09:00', endTime: '10:30', role: '認知教練' },
    { startTime: '10:30', endTime: '12:00', role: '開心夥伴' },
    { startTime: '14:00', endTime: '16:00', role: '復健教練' },
  ]},
  { dayOfWeek: 3, slots: [
    { startTime: '08:00', endTime: '10:00', role: '開心夥伴' },
    { startTime: '10:00', endTime: '12:00', role: '認知教練' },
    { startTime: '14:00', endTime: '15:30', role: '復健教練' },
  ]},
  { dayOfWeek: 4, slots: [
    { startTime: '09:00', endTime: '11:00', role: '開心夥伴' },
    { startTime: '11:00', endTime: '12:00', role: '認知教練' },
    { startTime: '14:00', endTime: '16:00', role: '開心夥伴' },
  ]},
  { dayOfWeek: 5, slots: [
    { startTime: '08:00', endTime: '10:00', role: '認知教練' },
    { startTime: '10:00', endTime: '12:00', role: '開心夥伴' },
    { startTime: '14:00', endTime: '15:30', role: '復健教練' },
  ]},
  { dayOfWeek: 6, slots: [
    { startTime: '09:00', endTime: '11:00', role: '開心夥伴' },
    { startTime: '14:00', endTime: '15:00', role: '開心夥伴' },
  ]},
];

// === 分享頁 Mock Data ===

const defaultPermissions: SharePermission[] = [
  { cardId: 'daily-summary', cardName: '今日對話摘要', enabled: true },
  { cardId: 'emotion', cardName: '情緒狀態', enabled: true },
  { cardId: 'activity', cardName: '互動活躍度', enabled: true },
  { cardId: 'course', cardName: '課程進度', enabled: true },
  { cardId: 'conversation', cardName: '對話紀錄', enabled: false },
  { cardId: 'game-scores', cardName: '遊戲成績', enabled: true },
  { cardId: 'role-schedule', cardName: '角色排程', enabled: false },
];

export const mockCaregivers: Caregiver[] = [
  {
    id: 'cg1',
    name: '王大明',
    role: '家人',
    email: 'daming.wang@email.com',
    status: 'active',
    permissions: defaultPermissions.map((p) => ({ ...p })),
    joinedAt: '2026-03-15',
  },
  {
    id: 'cg2',
    name: '陳小華',
    role: '照服員',
    email: 'xiaohua.chen@care.org',
    status: 'active',
    permissions: defaultPermissions.map((p) => ({ ...p, enabled: ['daily-summary', 'course', 'activity'].includes(p.cardId) })),
    joinedAt: '2026-03-20',
  },
  {
    id: 'cg3',
    name: '王郁鈞 醫師',
    role: '醫師',
    email: 'dr.wang@kvgh.gov.tw',
    status: 'pending',
    permissions: defaultPermissions.map((p) => ({ ...p })),
    joinedAt: '2026-04-08',
  },
];

export const allShareCards: SharePermission[] = defaultPermissions;

// === 健康 Tab Mock Data ===

// Start with empty medication list — user adds via scan or manual entry
export const mockMedications: Medication[] = [];

export const mockMedicationProgress: MedicationProgress = {
  date: '2026-04-09',
  scheduled: 0,
  taken: 0,
  hasWarnings: false,
};

export const mockAdherenceTrend = [
  { date: '04/03', rate: 80 }, { date: '04/04', rate: 100 },
  { date: '04/05', rate: 67 }, { date: '04/06', rate: 83 },
  { date: '04/07', rate: 100 }, { date: '04/08', rate: 83 },
  { date: '04/09', rate: 50 },
];

export const mockReminders: Reminder[] = [
  {
    id: 'r1',
    category: '生活健康',
    time: '08:00',
    repeat: '每天',
    mode: 'ai',
    topic: '健康關懷',
    content: '提醒奶奶量血壓',
    enabled: true,
    pinned: true,
    notifyOnNoResponse: true,
    showSender: false,
  },
  {
    id: 'r2',
    category: '日常娛樂',
    time: '10:00',
    repeat: '每天',
    mode: 'ai',
    topic: '笑語逸事',
    enabled: true,
    pinned: false,
    notifyOnNoResponse: false,
    showSender: false,
  },
  {
    id: 'r3',
    category: '關懷互動',
    time: '16:00',
    repeat: '每天',
    mode: 'message',
    topic: '用藥提醒',
    content: '奶奶，記得吃下午的藥喔！愛你～',
    enabled: true,
    pinned: false,
    notifyOnNoResponse: true,
    showSender: true,
  },
  {
    id: 'r4',
    category: '貼心提醒',
    time: '20:00',
    repeat: '不重複',
    mode: 'message',
    topic: '晚安關懷',
    content: '奶奶晚安，明天我會去看你喔',
    enabled: false,
    pinned: false,
    notifyOnNoResponse: false,
    showSender: true,
  },
];
