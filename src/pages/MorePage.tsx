import { useState } from 'react';
import type { Caregiver } from '../types';
import { mockCaregivers } from '../mock/data';
import CaregiverCard from '../components/share/CaregiverCard';
import InviteForm from '../components/share/InviteForm';
import PermissionEditor from '../components/share/PermissionEditor';
import AccountSettings from '../components/browse/AccountSettings';

type View = 'menu' | 'share' | 'invite' | 'permissions' | 'account';

export default function MorePage() {
  const [view, setView] = useState<View>('menu');
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

  if (view === 'account') {
    return (
      <div className="min-h-screen pb-24 pt-[env(safe-area-inset-top,12px)] px-4">
        <AccountSettings onBack={() => setView('menu')} />
      </div>
    );
  }

  if (view === 'invite') {
    return (
      <InviteForm
        onInvite={(cg) => { setCaregivers((prev) => [...prev, cg]); setView('share'); }}
        onCancel={() => setView('share')}
      />
    );
  }

  if (view === 'permissions' && editingId) {
    const cg = caregivers.find((c) => c.id === editingId);
    if (cg) {
      return (
        <PermissionEditor
          caregiver={cg}
          onUpdate={(updated) => setCaregivers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))}
          onBack={() => { setView('share'); setEditingId(null); }}
        />
      );
    }
  }

  if (view === 'share') {
    const active = caregivers.filter((c) => c.status === 'active');
    const pending = caregivers.filter((c) => c.status === 'pending');

    return (
      <div className="flex flex-col min-h-screen pb-24">
        <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
          <div className="flex items-center py-3">
            <button onClick={() => setView('menu')} className="text-heka-purple cursor-pointer flex items-center gap-1 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              返回
            </button>
            <h1 className="text-base font-semibold text-heka-text absolute left-1/2 -translate-x-1/2">分享管理</h1>
          </div>
        </header>

        <div className="px-4 mb-4">
          <button
            onClick={() => setView('invite')}
            className="w-full py-3 rounded-2xl bg-heka-purple text-white flex items-center justify-center gap-2 text-sm font-medium shadow-sm cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            邀請照顧者
          </button>
        </div>

        <div className="px-4 space-y-5">
          {active.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="text-xs font-semibold text-heka-text-secondary">已加入</h2>
                <span className="text-[10px] text-gray-400 ml-auto">{active.length} 人</span>
              </div>
              <div className="space-y-2">
                {active.map((cg) => (
                  <CaregiverCard key={cg.id} caregiver={cg}
                    onManage={(id) => { setEditingId(id); setView('permissions'); }}
                    onRemove={(id) => setRemoveConfirmId(id)}
                  />
                ))}
              </div>
            </div>
          )}
          {pending.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xs font-semibold text-heka-text-secondary">等待中</h2>
              </div>
              <div className="space-y-2">
                {pending.map((cg) => (
                  <CaregiverCard key={cg.id} caregiver={cg}
                    onManage={(id) => { setEditingId(id); setView('permissions'); }}
                    onRemove={(id) => setRemoveConfirmId(id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {removeConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 mx-8 shadow-xl max-w-[300px] w-full">
              <p className="text-sm font-semibold text-heka-text text-center mb-2">確定要移除嗎？</p>
              <p className="text-xs text-heka-text-secondary text-center mb-5">移除後對方將無法查看長輩資料</p>
              <div className="flex gap-3">
                <button onClick={() => setRemoveConfirmId(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-heka-text cursor-pointer">取消</button>
                <button onClick={() => { setCaregivers((prev) => prev.filter((c) => c.id !== removeConfirmId)); setRemoveConfirmId(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white cursor-pointer">移除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main menu
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
          </svg>
          <h1 className="text-base font-semibold text-heka-purple">更多</h1>
        </div>
      </header>

      <div className="px-4 space-y-2">
        <MenuItem
          icon="👥" label="分享管理"
          sublabel={`${caregivers.length} 位照顧者`}
          onClick={() => setView('share')}
        />
        <MenuItem icon="⚙️" label="帳號設定" sublabel="個人資料・語言・登出" onClick={() => setView('account')} />
        <MenuItem icon="🐧" label="連結的長輩" sublabel="王奶奶 ・ 平板在線" />
        <MenuItem icon="📡" label="裝置管理" sublabel="感測器配對" badge="P2" />
        <MenuItem icon="🔔" label="通知設定" sublabel="推播偏好・異常警示" badge="P2" />
        <MenuItem icon="📲" label="安裝到主畫面" sublabel="像原生 APP 一樣使用" badge="PWA" />
        <MenuItem icon="ℹ️" label="關於 HEKA" sublabel="v1.0.0 — 智腦生醫科技" />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, sublabel, onClick, badge }: {
  icon: string; label: string; sublabel: string; onClick?: () => void; badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-sm border border-white/60 cursor-pointer hover:bg-white transition-colors text-left"
    >
      <span className="w-9 h-9 rounded-full bg-heka-purple/10 flex items-center justify-center text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-heka-text">{label}</p>
        <p className="text-[10px] text-heka-text-secondary">{sublabel}</p>
      </div>
      {badge && (
        <span className="shrink-0 px-2 py-0.5 rounded-full bg-heka-purple/10 text-[9px] font-medium text-heka-purple">{badge}</span>
      )}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
