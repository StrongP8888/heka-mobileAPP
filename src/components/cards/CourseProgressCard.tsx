import type { CourseProgress } from '../../types';
import CircleProgress from '../charts/CircleProgress';

interface Props {
  data: CourseProgress;
}

const difficultyLabel: Record<string, string> = {
  tutorial: '教學',
  easy: '簡單',
  medium: '中等',
  hard: '困難',
};

const difficultyColor: Record<string, string> = {
  tutorial: 'bg-gray-100 text-gray-600',
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-red-50 text-red-600',
};

export default function CourseProgressCard({ data }: Props) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-heka-text">今日課程進度</h3>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <CircleProgress completed={data.completed} total={data.scheduled} />
        <div className="flex-1">
          <p className="text-sm text-heka-text">
            已完成 <span className="font-bold text-heka-purple">{data.completed}</span> / {data.scheduled} 堂
          </p>
          <p className="text-xs text-heka-text-secondary mt-0.5">
            {data.completed === data.scheduled ? '太棒了，今天全部完成！' : `還剩 ${data.scheduled - data.completed} 堂課程`}
          </p>
        </div>
      </div>

      {/* Game list */}
      <div className="space-y-2">
        {data.games.map((game) => (
          <div key={game.name} className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-heka-text truncate">{game.name}</p>
              <p className="text-[10px] text-heka-text-secondary">{game.casiDimension}</p>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${difficultyColor[game.difficulty]}`}>
              {difficultyLabel[game.difficulty]}
            </span>
            <span className="text-sm font-bold text-heka-purple">{game.score}分</span>
          </div>
        ))}
      </div>
    </div>
  );
}
