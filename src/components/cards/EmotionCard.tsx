import type { EmotionData } from '../../types';
import EmotionCurve from '../charts/EmotionCurve';
import MiniLineChart from '../charts/MiniLineChart';

interface Props {
  data: EmotionData;
}

const emotionLabel = {
  happy: '開心',
  neutral: '平靜',
  sad: '低落',
};

const emotionEmoji = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
};

const emotionColor = {
  happy: 'text-emerald-500',
  neutral: 'text-amber-500',
  sad: 'text-red-500',
};

export default function EmotionCard({ data }: Props) {
  const latest = data.hourly[data.hourly.length - 1];
  const avgScore = Math.round(data.hourly.reduce((sum, d) => sum + d.score, 0) / data.hourly.length);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
          <span className="text-base">{emotionEmoji[latest.label]}</span>
        </div>
        <h3 className="text-sm font-semibold text-heka-text">情緒狀態</h3>
        <div className="ml-auto flex items-center gap-1">
          <span className={`text-lg font-bold ${emotionColor[latest.label]}`}>{latest.score}</span>
          <span className="text-xs text-heka-text-secondary">/ 100</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${emotionColor[latest.label]}`}>
          {emotionLabel[latest.label]}
        </span>
        <span className="text-xs text-heka-text-secondary">
          今日平均 {avgScore} 分
        </span>
      </div>

      {/* Today's emotion curve */}
      <div className="mb-3">
        <EmotionCurve data={data.hourly} />
      </div>

      {/* 7-day trend */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-heka-text-secondary">7 日趨勢</span>
        <MiniLineChart
          data={data.weeklyTrend.map((d) => d.avgScore)}
          color="#10B981"
          width={100}
          height={28}
        />
      </div>
    </div>
  );
}
