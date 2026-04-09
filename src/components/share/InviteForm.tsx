import { useState } from 'react';
import type { Caregiver, SharePermission } from '../../types';
import { allShareCards } from '../../mock/data';

interface Props {
  onInvite: (caregiver: Caregiver) => void;
  onCancel: () => void;
}

const roles: Caregiver['role'][] = ['家人', '照服員', '醫師', '其他'];

export default function InviteForm({ onInvite, onCancel }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Caregiver['role']>('家人');
  const [permissions, setPermissions] = useState<SharePermission[]>(
    allShareCards.map((p) => ({ ...p, enabled: true }))
  );

  const togglePermission = (cardId: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.cardId === cardId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    onInvite({
      id: `cg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'pending',
      permissions,
      joinedAt: new Date().toISOString().slice(0, 10),
    });
  };

  const enabledCount = permissions.filter((p) => p.enabled).length;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-between py-3">
          <button onClick={onCancel} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回
          </button>
          <h1 className="text-base font-semibold text-heka-text">邀請照顧者</h1>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim()}
            className="px-4 py-1.5 rounded-lg bg-heka-purple text-white text-sm font-medium cursor-pointer hover:bg-heka-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            發送邀請
          </button>
        </div>
      </header>

      <div className="px-4 space-y-3">
        {/* Basic info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入照顧者姓名"
              className="w-full mt-1 text-sm text-heka-text bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="px-4 py-3 border-b border-gray-50">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full mt-1 text-sm text-heka-text bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="px-4 py-3">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider mb-2 block">身份</label>
            <div className="flex gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    role === r
                      ? 'bg-heka-purple text-white shadow-sm'
                      : 'bg-gray-100 text-heka-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data permissions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-heka-text">數據分享權限</h3>
              <p className="text-[10px] text-heka-text-secondary mt-0.5">選擇要分享的摘要卡片</p>
            </div>
            <span className="text-xs text-heka-purple font-medium">{enabledCount}/{permissions.length}</span>
          </div>

          {permissions.map((perm, i) => (
            <div
              key={perm.cardId}
              className={`flex items-center justify-between px-4 py-3 ${
                i < permissions.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="text-sm text-heka-text">{perm.cardName}</span>
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

        {/* Hint */}
        <p className="text-xs text-heka-text-secondary text-center px-4 pt-1">
          對方會收到邀請通知，接受後即可查看你分享的數據
        </p>
      </div>
    </div>
  );
}
