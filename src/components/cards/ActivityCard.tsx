import type { ActivityData } from '../../types';
import MiniLineChart from '../charts/MiniLineChart';

interface Props {
  data: ActivityData;
}

export default function ActivityCard({ data }: Props) {
  const weekAvg = Math.round(
    data.weeklyTrend.reduce((sum, d) => sum + d.minutes, 0) / data.weeklyTrend.length
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-heka-text">互動活躍度</h3>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <div>
          <span className="text-3xl font-bold text-heka-text">{data.totalMinutes}</span>
          <span className="text-sm text-heka-text-secondary ml-1">分鐘</span>
        </div>
        <div className="flex flex-col text-xs text-heka-text-secondary mb-1">
          <span>{data.sessionCount} 次對話</span>
          <span>週均 {weekAvg} 分鐘</span>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="flex items-end gap-1.5 h-10 mb-1">
        {data.weeklyTrend.map((d, i) => {
          const maxMin = Math.max(...data.weeklyTrend.map((t) => t.minutes));
          const heightPct = (d.minutes / maxMin) * 100;
          const isToday = i === data.weeklyTrend.length - 1;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t-sm transition-all ${isToday ? 'bg-heka-purple' : 'bg-heka-purple/20'}`}
                style={{ height: `${heightPct}%`, minHeight: 4 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {data.weeklyTrend.map((d, i) => (
          <span key={d.date} className={`flex-1 text-center text-[9px] ${i === data.weeklyTrend.length - 1 ? 'text-heka-purple font-semibold' : 'text-gray-400'}`}>
            {d.date.split('/')[1]}
          </span>
        ))}
      </div>

      {/* Trend sparkline */}
      <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-heka-text-secondary">7 日趨勢</span>
        <MiniLineChart
          data={data.weeklyTrend.map((d) => d.minutes)}
          color="#3B82F6"
          width={100}
          height={28}
        />
      </div>
    </div>
  );
}
