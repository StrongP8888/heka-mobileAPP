import type { MedicationProgress } from '../../types';
import CircleProgress from '../charts/CircleProgress';

interface Props {
  data: MedicationProgress;
}

export default function MedicationProgressCard({ data }: Props) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center">
          <span className="text-base">💊</span>
        </div>
        <h3 className="text-sm font-semibold text-heka-text">今日用藥進度</h3>
        {data.hasWarnings && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-red-50 text-[10px] font-medium text-red-500 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            交互作用
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <CircleProgress completed={data.taken} total={data.scheduled} />
        <div className="flex-1">
          <p className="text-sm text-heka-text">
            已服用 <span className="font-bold text-heka-purple">{data.taken}</span> / {data.scheduled} 項
          </p>
          <p className="text-xs text-heka-text-secondary mt-0.5">
            {data.taken === data.scheduled
              ? '太棒了，今天都按時服藥！'
              : `還有 ${data.scheduled - data.taken} 項待服用`}
          </p>
          {data.hasWarnings && (
            <p className="text-[10px] text-red-500 mt-1">
              有 1 組藥物交互作用需注意 →
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
