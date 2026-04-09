import { useState } from 'react';
import type { Caregiver } from '../types';
import { mockCaregivers } from '../mock/data';
import PageHeader from '../components/layout/PageHeader';
import CaregiverCard from '../components/share/CaregiverCard';
import InviteForm from '../components/share/InviteForm';
import PermissionEditor from '../components/share/PermissionEditor';

type View = 'list' | 'invite' | 'permissions';

export default function SharePage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(mockCaregivers);
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

  const handleInvite = (newCg: Caregiver) => {
    setCaregivers((prev) => [...prev, newCg]);
    setView('list');
  };

  const handleManage = (id: string) => {
    setEditingId(id);
    setView('permissions');
  };

  const handleUpdatePermissions = (updated: Caregiver) => {
    setCaregivers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleRemove = (id: string) => {
    setCaregivers((prev) => prev.filter((c) => c.id !== id));
    setRemoveConfirmId(null);
  };

  if (view === 'invite') {
    return <InviteForm onInvite={handleInvite} onCancel={() => setView('list')} />;
  }

  if (view === 'permissions' && editingId) {
    const cg = caregivers.find((c) => c.id === editingId);
    if (cg) {
      return (
        <PermissionEditor
          caregiver={cg}
          onUpdate={handleUpdatePermissions}
          onBack={() => { setView('list'); setEditingId(null); }}
        />
      );
    }
  }

  const active = caregivers.filter((c) => c.status === 'active');
  const pending = caregivers.filter((c) => c.status === 'pending');

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        title="分享"
      />

      {/* Info banner */}
      <div className="mx-4 mb-4 bg-heka-purple/5 rounded-2xl px-4 py-3 border border-heka-purple/10">
        <div className="flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs text-heka-text leading-relaxed">
            邀請家人、照服員或醫師查看長輩的互動數據。你可以精確控制每個人能看到哪些項目。
          </p>
        </div>
      </div>

      {/* Invite button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setView('invite')}
          className="w-full py-3 rounded-2xl bg-heka-purple text-white flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:bg-heka-purple-dark transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          邀請照顧者
        </button>
      </div>

      {/* Caregiver list */}
      <div className="px-4 space-y-5">
        {active.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide">已加入</h2>
              <span className="text-[10px] text-gray-400 ml-auto">{active.length} 人</span>
            </div>
            <div className="space-y-2">
              {active.map((cg) => (
                <CaregiverCard
                  key={cg.id}
                  caregiver={cg}
                  onManage={handleManage}
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
              <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide">等待中</h2>
              <span className="text-[10px] text-gray-400 ml-auto">{pending.length} 人</span>
            </div>
            <div className="space-y-2">
              {pending.map((cg) => (
                <CaregiverCard
                  key={cg.id}
                  caregiver={cg}
                  onManage={handleManage}
                  onRemove={(id) => setRemoveConfirmId(id)}
                />
              ))}
            </div>
          </div>
        )}

        {caregivers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <p className="text-sm text-heka-text-secondary">還沒有照顧者</p>
            <p className="text-xs text-gray-400 mt-1">點擊上方按鈕邀請家人一起關心長輩</p>
          </div>
        )}
      </div>

      {/* Remove confirmation modal */}
      {removeConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-8 shadow-xl max-w-[300px] w-full">
            <p className="text-sm font-semibold text-heka-text text-center mb-2">確定要移除嗎？</p>
            <p className="text-xs text-heka-text-secondary text-center mb-5">
              移除後對方將無法查看{' '}
              {caregivers.find((c) => c.id === removeConfirmId)?.name} 的長輩資料
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRemoveConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-heka-text cursor-pointer hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleRemove(removeConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white cursor-pointer hover:bg-red-600 transition-colors"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
