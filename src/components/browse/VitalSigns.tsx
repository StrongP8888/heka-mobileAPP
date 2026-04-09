interface Props {
  onBack: () => void;
}

export default function VitalSigns({ onBack }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-heka-purple cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-heka-text">生命徵象</h2>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60">
        {/* Title + time */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-heka-text">血壓</h3>
          <div className="text-right">
            <p className="text-[10px] text-heka-text-secondary">2026/04/09</p>
            <p className="text-[10px] text-heka-text-secondary">上午 10:22:50</p>
          </div>
        </div>

        {/* Readings */}
        <div className="space-y-4">
          <VitalRow label="高壓" unit="mmHg" value={118} color="#7C3AED" status="正常" />
          <VitalRow label="低壓" unit="mmHg" value={87} color="#7C3AED" status="偏高" statusColor="#F59E0B" />
          <VitalRow label="脈搏" unit="/MIN" value={71} color="#7C3AED" status="正常" />
        </div>

        {/* Status bar */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400" style={{ width: '45%' }} />
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-emerald-500">偏低</span>
            <span className="text-[9px] text-emerald-500">正常</span>
            <span className="text-[9px] text-amber-500">偏高</span>
            <span className="text-[9px] text-red-500">高</span>
          </div>
        </div>

        {/* Devices info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-heka-text-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
            <line x1="23" y1="13" x2="23" y2="11" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>藍牙血壓計尚未連接</span>
        </div>
      </div>
    </div>
  );
}

function VitalRow({ label, unit, value, color, status, statusColor }: {
  label: string;
  unit: string;
  value: number;
  color: string;
  status: string;
  statusColor?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="text-xs text-heka-text-secondary">{label}</p>
        <p className="text-[10px] text-gray-400">{unit}</p>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        <span
          className="text-[10px] font-medium mb-1.5 px-1.5 py-0.5 rounded"
          style={{
            color: statusColor || '#10B981',
            backgroundColor: statusColor ? `${statusColor}15` : '#10B98115',
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
