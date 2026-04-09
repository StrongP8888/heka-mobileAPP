import { mockElder, mockDailySummary, mockEmotionData, mockActivityData, mockCourseProgress } from '../mock/data';
import DailySummaryCard from '../components/cards/DailySummaryCard';
import EmotionCard from '../components/cards/EmotionCard';
import ActivityCard from '../components/cards/ActivityCard';
import CourseProgressCard from '../components/cards/CourseProgressCard';
import PageHeader from '../components/layout/PageHeader';

export default function SummaryPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        }
        title="摘要"
      />

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

      {/* Cards */}
      <div className="px-4 space-y-4">
        <DailySummaryCard data={mockDailySummary} />
        <EmotionCard data={mockEmotionData} />
        <ActivityCard data={mockActivityData} />
        <CourseProgressCard data={mockCourseProgress} />
      </div>
    </div>
  );
}
