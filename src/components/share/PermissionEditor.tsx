import type { Caregiver } from '../../types';

interface Props {
  caregiver: Caregiver;
  onUpdate: (updated: Caregiver) => void;
  onBack: () => void;
}

const roleEmoji: Record<string, string> = {
  '家人': '👨‍👩‍👧',
  '照服員': '🩺',
  '醫師': '👨‍⚕️',
  '其他': '👤',
};

export default function PermissionEditor({ caregiver, onUpdate, onBack }: Props) {
  const togglePermission = (cardId: string) => {
    const updated = {
      ...caregiver,
      permissions: caregiver.permissions.map((p) =>
        p.cardId === cardId ? { ...p, enabled: !p.enabled } : p
      ),
    };
    onUpdate(updated);
  };

  const toggleAll = (enabled: boolean) => {
    onUpdate({
      ...caregiver,
      permissions: caregiver.permissions.map((p) => ({ ...p, enabled })),
    });
  };

  const enabledCount = caregiver.permissions.filter((p) => p.enabled).length;
  const allEnabled = enabledCount === caregiver.permissions.length;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-between py-3">
          <button onClick={onBack} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回
          </button>
          <h1 className="text-base font-semibold text-heka-text">管理權限</h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="px-4 space-y-3">
        {/* Caregiver info header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-heka-purple/10 flex items-center justify-center text-xl">
            {roleEmoji[caregiver.role]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-heka-text">{caregiver.name}</p>
            <p className="text-xs text-heka-text-secondary">{caregiver.role} ・ {caregiver.email}</p>
          </div>
        </div>

        {/* Toggle all */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-semibold text-heka-text">分享所有數據</h3>
              <p className="text-[10px] text-heka-text-secondary mt-0.5">一鍵開啟或關閉全部</p>
            </div>
            <button
              onClick={() => toggleAll(!allEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                allEnabled ? 'bg-heka-purple' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  allEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Individual toggles */}
          {caregiver.permissions.map((perm, i) => (
            <div
              key={perm.cardId}
              className={`flex items-center justify-between px-4 py-3 ${
                i < caregiver.permissions.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${perm.enabled ? 'bg-heka-purple' : 'bg-gray-300'}`} />
                <span className="text-sm text-heka-text">{perm.cardName}</span>
              </div>
              <button
                onClick={() => togglePermission(perm.cardId)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  perm.enabled ? 'bg-heka-purple' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    perm.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-heka-purple/5 rounded-2xl px-4 py-3 border border-heka-purple/10">
          <p className="text-xs text-heka-text leading-relaxed">
            <span className="font-semibold text-heka-purple">{caregiver.name}</span> 目前可查看{' '}
            <span className="font-semibold text-heka-purple">{enabledCount}</span> 項數據。
            {enabledCount === 0 && ' 對方將無法看到任何長輩資料。'}
          </p>
        </div>
      </div>
    </div>
  );
}
