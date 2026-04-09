import { useState } from 'react';
import EmotionSection from '../components/analysis/EmotionSection';
import ConversationList from '../components/analysis/ConversationList';
import GameScoresSection from '../components/analysis/GameScoresSection';
import RoleScheduleSection from '../components/analysis/RoleScheduleSection';
import AiChatBar from '../components/analysis/AiChatBar';

type Section = 'emotion' | 'conversations' | 'games' | 'schedule';

const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'emotion', label: '情緒', icon: '💛' },
  { id: 'conversations', label: '對話', icon: '💬' },
  { id: 'games', label: '遊戲', icon: '🎮' },
  { id: 'schedule', label: '排程', icon: '📅' },
];

export default function AnalysisPage() {
  const [activeSection, setActiveSection] = useState<Section>('emotion');

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] pb-1 px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h1 className="text-base font-semibold text-heka-purple">AI 分析</h1>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1.5 pb-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSection === s.id
                  ? 'bg-white/90 text-heka-purple shadow-sm border border-white/60'
                  : 'text-heka-text-secondary hover:bg-white/40'
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 space-y-4">
        {activeSection === 'emotion' && (
          <>
            <EmotionSection />
            <AiChatBar />
          </>
        )}
        {activeSection === 'conversations' && <ConversationList />}
        {activeSection === 'games' && <GameScoresSection />}
        {activeSection === 'schedule' && <RoleScheduleSection />}
      </div>
    </div>
  );
}
