interface Props {
  onBack: () => void;
}

export default function SensorStatus({ onBack }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-heka-purple cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-heka-text">安全感測器</h2>
      </div>

      <div className="space-y-3">
        {/* Door sensor */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-heka-text">門窗感測器</h3>
            <span className="px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-500">
              OFF
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-heka-text-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
              <line x1="23" y1="13" x2="23" y2="11" />
            </svg>
            100%
          </div>
        </div>

        {/* Motion sensor */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-heka-text">動作感測器</h3>
            <div className="text-right">
              <p className="text-[10px] text-heka-text-secondary">最後觸發時間</p>
              <p className="text-sm font-semibold text-heka-purple">2026/04/09</p>
              <p className="text-xs text-heka-purple">上午 09:44:55</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-heka-text-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
              <line x1="23" y1="13" x2="23" y2="11" />
            </svg>
            100%
          </div>
        </div>
      </div>
    </div>
  );
}
