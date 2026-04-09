export interface Elder {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  deviceStatus: 'online' | 'offline';
}

export interface DailySummary {
  date: string;
  summary: string;
  keyTopics: string[];
  totalDuration: number;
  sessionCount: number;
}

export interface EmotionData {
  date: string;
  hourly: { hour: number; score: number; label: 'happy' | 'neutral' | 'sad' }[];
  weeklyTrend: { date: string; avgScore: number }[];
}

export interface CourseProgress {
  date: string;
  scheduled: number;
  completed: number;
  games: {
    name: string;
    score: number;
    difficulty: 'tutorial' | 'easy' | 'medium' | 'hard';
    casiDimension: string;
  }[];
}

export interface ActivityData {
  date: string;
  sessionCount: number;
  totalMinutes: number;
  weeklyTrend: { date: string; minutes: number }[];
}

export interface Reminder {
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

export interface ConversationRecord {
  id: string;
  date: string;
  time: string;
  role: '開心夥伴' | '認知教練' | '復健教練';
  summary: string;
  duration: number;
  emotionLabel: 'happy' | 'neutral' | 'sad';
}

export interface GameScore {
  name: string;
  scores: { date: string; score: number }[];
  casiDimension: string;
}

export interface RoleScheduleSlot {
  startTime: string;
  endTime: string;
  role: '開心夥伴' | '認知教練' | '復健教練';
}

export interface RoleSchedule {
  dayOfWeek: number;
  slots: RoleScheduleSlot[];
}

export interface Caregiver {
  id: string;
  name: string;
  role: '家人' | '照服員' | '醫師' | '其他';
  email: string;
  avatar?: string;
  status: 'active' | 'pending';
  permissions: SharePermission[];
  joinedAt: string;
}

export interface SharePermission {
  cardId: string;
  cardName: string;
  enabled: boolean;
}

export type TabId = 'summary' | 'share' | 'analysis' | 'reminders' | 'browse';
