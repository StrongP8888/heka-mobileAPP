import type { DailySummary } from '../../types';

interface Props {
  data: DailySummary;
}

export default function DailySummaryCard({ data }: Props) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-heka-purple/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-heka-text">今日對話摘要</h3>
        <span className="ml-auto text-xs text-heka-text-secondary">{data.sessionCount} 次對話</span>
      </div>

      <p className="text-sm text-heka-text leading-relaxed mb-3">
        {data.summary}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {data.keyTopics.map((topic) => (
          <span
            key={topic}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-heka-purple/8 text-heka-purple"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-heka-text-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        總互動 {data.totalDuration} 分鐘
      </div>
    </div>
  );
}
