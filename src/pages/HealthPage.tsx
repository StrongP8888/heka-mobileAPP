import { useState } from 'react';
import type { Medication } from '../types';
import { mockMedications, mockAdherenceTrend } from '../mock/data';


type SubTab = 'medication' | 'supplements' | 'education';

export default function HealthPage() {
  const [subTab, setSubTab] = useState<SubTab>('medication');
  const [medications, setMedications] = useState<Medication[]>(mockMedications);

  const toggleTaken = (medId: string, slotIdx: number) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, takenToday: m.takenToday.map((t, i) => (i === slotIdx ? !t : t)) }
          : m
      )
    );
  };

  // Collect all interactions
  const allInteractions = medications.flatMap((m) =>
    m.interactions.map((int) => ({ ...int, from: m.name }))
  );
  const uniqueWarnings = allInteractions.filter(
    (w, i, arr) => arr.findIndex((x) => x.from === w.from && x.conflictWith === w.conflictWith) === i
  );

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <span className="text-lg">💊</span>
          <h1 className="text-base font-semibold text-heka-purple">健康</h1>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 mb-2">
          {([
            { id: 'medication' as SubTab, label: '💊 用藥', p1: true },
            { id: 'supplements' as SubTab, label: '🧴 保健', p1: false },
            { id: 'education' as SubTab, label: '📋 衛教', p1: false },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                subTab === t.id
                  ? 'bg-white text-heka-purple shadow-sm'
                  : 'text-heka-text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {subTab === 'medication' && (
        <div className="px-4 space-y-4">
          {/* Drug interaction warnings */}
          {uniqueWarnings.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h3 className="text-sm font-semibold text-red-600">藥物交互作用提醒</h3>
              </div>
              <div className="space-y-2">
                {uniqueWarnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                      w.severity === 'high' ? 'bg-red-500' : w.severity === 'medium' ? 'bg-amber-500' : 'bg-yellow-400'
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-red-700">
                        {w.from} ✕ {w.conflictWith}
                      </p>
                      <p className="text-[10px] text-red-600/80">{w.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's schedule */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
            <h3 className="text-sm font-semibold text-heka-text mb-3">今日服藥時程</h3>
            <div className="space-y-2">
              {medications.map((med) =>
                med.timeSlots.map((slot, slotIdx) => (
                  <div
                    key={`${med.id}-${slotIdx}`}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      med.takenToday[slotIdx] ? 'bg-emerald-50/80' : 'bg-gray-50/80'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaken(med.id, slotIdx)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                        med.takenToday[slotIdx]
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 hover:border-heka-purple'
                      }`}
                    >
                      {med.takenToday[slotIdx] && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${med.takenToday[slotIdx] ? 'text-emerald-700 line-through' : 'text-heka-text'}`}>
                        {med.name}
                      </p>
                      <p className="text-[10px] text-heka-text-secondary">{med.dosage} ・ {med.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-heka-purple font-medium">{slot}</span>
                      {med.interactions.length > 0 && (
                        <p className="text-[8px] text-amber-500">⚠ 有交互</p>
                      )}
                    </div>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium ${
                      med.type === 'prescription' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {med.type === 'prescription' ? '處方' : '保健'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Adherence trend */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-heka-text">服藥遵從度</h3>
              <span className="text-xs text-heka-text-secondary">近 7 日</span>
            </div>
            <div className="flex items-end gap-1.5 h-16 mb-1">
              {mockAdherenceTrend.map((d, i) => {
                const isToday = i === mockAdherenceTrend.length - 1;
                const color = d.rate >= 80 ? 'bg-emerald-400' : d.rate >= 60 ? 'bg-amber-400' : 'bg-red-400';
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-[8px] text-heka-text-secondary">{d.rate}%</span>
                    <div
                      className={`w-full rounded-t-sm transition-all ${isToday ? color : `${color}/60`}`}
                      style={{ height: `${d.rate * 0.6}%`, minHeight: 4 }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1.5">
              {mockAdherenceTrend.map((d, i) => (
                <span key={d.date} className={`flex-1 text-center text-[9px] ${i === mockAdherenceTrend.length - 1 ? 'text-heka-purple font-semibold' : 'text-gray-400'}`}>
                  {d.date.split('/')[1]}
                </span>
              ))}
            </div>
          </div>

          {/* Medication list summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
            <h3 className="text-sm font-semibold text-heka-text mb-2">藥物清單</h3>
            <div className="flex gap-3 text-center mb-3">
              <div className="flex-1 bg-blue-50 rounded-xl py-2">
                <p className="text-lg font-bold text-blue-600">{medications.filter((m) => m.type === 'prescription').length}</p>
                <p className="text-[10px] text-blue-500">處方藥</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl py-2">
                <p className="text-lg font-bold text-green-600">{medications.filter((m) => m.type === 'supplement').length}</p>
                <p className="text-[10px] text-green-500">保健食品</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-xl py-2">
                <p className="text-lg font-bold text-red-500">{uniqueWarnings.length}</p>
                <p className="text-[10px] text-red-400">交互警告</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'supplements' && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center text-2xl">🧴</div>
            <p className="text-sm text-heka-text-secondary">保健食品管理</p>
            <p className="text-xs text-gray-400 mt-1">AI 辨識・知識庫搜尋・情境建議</p>
            <p className="text-[10px] text-heka-purple mt-2">P2 開發中</p>
          </div>
        </div>
      )}

      {subTab === 'education' && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center text-2xl">📋</div>
            <p className="text-sm text-heka-text-secondary">健康衛教</p>
            <p className="text-xs text-gray-400 mt-1">衛教紀錄・身體追蹤・知識卡片</p>
            <p className="text-[10px] text-heka-purple mt-2">P2 開發中</p>
          </div>
        </div>
      )}
    </div>
  );
}
