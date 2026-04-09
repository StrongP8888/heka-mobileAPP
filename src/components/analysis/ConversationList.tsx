import { useState } from 'react';
import type { ConversationRecord } from '../../types';
import { mockConversations } from '../../mock/data';

const roleColor: Record<string, { bg: string; text: string; dot: string }> = {
  '開心夥伴': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  '認知教練': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
  '復健教練': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
};

const roleIcon: Record<string, string> = {
  '開心夥伴': '😊',
  '認知教練': '🧠',
  '復健教練': '💪',
};

type RoleFilter = '全部' | '開心夥伴' | '認知教練' | '復健教練';

export default function ConversationList() {
  const [filter, setFilter] = useState<RoleFilter>('全部');

  const filtered = filter === '全部'
    ? mockConversations
    : mockConversations.filter((c) => c.role === filter);

  // Group by date
  const grouped = filtered.reduce<Record<string, ConversationRecord[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <h3 className="text-sm font-semibold text-heka-text mb-3">對話紀錄</h3>

      {/* Role filter */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {(['全部', '開心夥伴', '認知教練', '復健教練'] as RoleFilter[]).map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === r
                ? 'bg-heka-purple text-white'
                : 'bg-gray-100 text-heka-text-secondary hover:bg-gray-200'
            }`}
          >
            {r !== '全部' && <span className="mr-1">{roleIcon[r]}</span>}
            {r}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {dates.map((date) => (
          <div key={date}>
            <p className="text-xs text-heka-text-secondary mb-2 font-medium">
              {date === '2026-04-09' ? '今天' : date === '2026-04-08' ? '昨天' : date}
            </p>
            <div className="space-y-2">
              {grouped[date].map((c) => {
                const style = roleColor[c.role];
                return (
                  <div key={c.id} className={`rounded-xl px-3 py-2.5 ${style.bg} border border-transparent`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-medium ${style.text}`}>{c.role}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{c.time}</span>
                      <span className="text-[10px] text-gray-400">{c.duration}分鐘</span>
                    </div>
                    <p className="text-xs text-heka-text leading-relaxed pl-3.5">{c.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
