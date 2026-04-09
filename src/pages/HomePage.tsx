import { mockElder, mockDailySummary, mockEmotionData, mockActivityData, mockCourseProgress, mockMedicationProgress } from '../mock/data';
import DailySummaryCard from '../components/cards/DailySummaryCard';
import EmotionCard from '../components/cards/EmotionCard';
import ActivityCard from '../components/cards/ActivityCard';
import CourseProgressCard from '../components/cards/CourseProgressCard';
import MedicationProgressCard from '../components/cards/MedicationProgressCard';
import EmotionSection from '../components/analysis/EmotionSection';
import ConversationList from '../components/analysis/ConversationList';
import InstallBanner from '../components/shared/InstallBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] pb-2 px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <h1 className="text-base font-semibold text-heka-purple">首頁</h1>
        </div>
      </header>

      {/* Elder status bar */}
      <div className="mx-4 mb-4 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/60">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heka-purple/20 to-heka-purple/5 flex items-center justify-center text-lg">
          🐧
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-heka-text">{mockElder.name}</p>
          <p className="text-xs text-heka-text-secondary">{mockElder.age} 歲</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${mockElder.deviceStatus === 'online' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
          <span className="text-xs text-heka-text-secondary">
            {mockElder.deviceStatus === 'online' ? '平板在線' : '離線'}
          </span>
        </div>
      </div>

      {/* Install PWA banner */}
      <InstallBanner />

      {/* === Top: Today's Snapshot (5 cards) === */}
      <div className="px-4">
        <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide mb-2 px-1">今日概覽</h2>
      </div>
      <div className="px-4 space-y-3">
        <DailySummaryCard data={mockDailySummary} />
        <EmotionCard data={mockEmotionData} />
        <ActivityCard data={mockActivityData} />
        <CourseProgressCard data={mockCourseProgress} />
        <MedicationProgressCard data={mockMedicationProgress} />
      </div>

      {/* === Middle: Deep Analysis === */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide mb-2 px-1">深入分析</h2>
      </div>
      <div className="px-4 space-y-3">
        <EmotionSection />
        <ConversationList />
      </div>
    </div>
  );
}
