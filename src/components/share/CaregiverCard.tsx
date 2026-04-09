import type { Caregiver } from '../../types';

interface Props {
  caregiver: Caregiver;
  onManage: (id: string) => void;
  onRemove: (id: string) => void;
}

const roleColor: Record<string, { bg: string; text: string }> = {
  '家人': { bg: 'bg-purple-100', text: 'text-purple-700' },
  '照服員': { bg: 'bg-teal-100', text: 'text-teal-700' },
  '醫師': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '其他': { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const roleEmoji: Record<string, string> = {
  '家人': '👨‍👩‍👧',
  '照服員': '🩺',
  '醫師': '👨‍⚕️',
  '其他': '👤',
};

export default function CaregiverCard({ caregiver, onManage, onRemove }: Props) {
  const style = roleColor[caregiver.role];
  const enabledCount = caregiver.permissions.filter((p) => p.enabled).length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-full ${style.bg} flex items-center justify-center text-lg shrink-0`}>
          {roleEmoji[caregiver.role]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-heka-text truncate">{caregiver.name}</p>
            {caregiver.status === 'pending' && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-medium text-amber-600">
                等待接受
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text}`}>
              {caregiver.role}
            </span>
            <span className="text-[10px] text-gray-400 truncate">{caregiver.email}</span>
          </div>
        </div>
      </div>

      {/* Permission summary */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs text-heka-text-secondary">
              可查看 <span className="font-semibold text-heka-purple">{enabledCount}</span> 項數據
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onManage(caregiver.id)}
              className="px-3 py-1.5 rounded-lg bg-heka-purple/10 text-xs font-medium text-heka-purple cursor-pointer hover:bg-heka-purple/20 transition-colors"
            >
              管理權限
            </button>
            <button
              onClick={() => onRemove(caregiver.id)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-500 cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              移除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
