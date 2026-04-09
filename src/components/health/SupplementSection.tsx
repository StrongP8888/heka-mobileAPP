import { useState, useRef } from 'react';
import type { Medication } from '../../types';

interface SupplementInfo {
  id: string;
  name: string;
  brand: string;
  ingredients: string[];
  effects: string[];
  dosage: string;
  interactions: { conflictWith: string; severity: 'high' | 'medium' | 'low'; description: string }[];
}

const knowledgeBase: SupplementInfo[] = [
  { id: 's1', name: '魚油 (Omega-3)', brand: 'NOW Foods', ingredients: ['EPA', 'DHA'],
    effects: ['降低三酸甘油脂', '抗發炎', '保護心血管'], dosage: '1000mg/日',
    interactions: [{ conflictWith: '阿斯匹靈', severity: 'medium', description: '兩者都有抗凝血作用，合併使用可能增加出血風險，建議間隔 2 小時' }] },
  { id: 's2', name: '葡萄糖胺', brand: 'Move Free', ingredients: ['葡萄糖胺鹽酸鹽', '軟骨素'],
    effects: ['關節保養', '減緩退化性關節炎', '修復軟骨'], dosage: '1500mg/日',
    interactions: [] },
  { id: 's3', name: '維生素 D3', brand: 'DHC', ingredients: ['膽鈣化醇'],
    effects: ['促進鈣吸收', '骨質保健', '免疫調節'], dosage: '1000-2000IU/日',
    interactions: [] },
  { id: 's4', name: '鈣片', brand: 'Caltrate', ingredients: ['碳酸鈣', '維生素D'],
    effects: ['骨質疏鬆預防', '補鈣'], dosage: '600mg/日',
    interactions: [{ conflictWith: '甲狀腺藥', severity: 'high', description: '鈣會嚴重影響甲狀腺藥吸收，必須間隔 4 小時' }] },
  { id: 's5', name: 'B群', brand: 'DHC', ingredients: ['B1', 'B2', 'B6', 'B12', '葉酸', '菸鹼酸'],
    effects: ['提振精神', '代謝輔助', '神經保健'], dosage: '1顆/日（早上）',
    interactions: [] },
  { id: 's6', name: '葉黃素', brand: 'FloraGLO', ingredients: ['葉黃素', '玉米黃素'],
    effects: ['護眼', '預防黃斑部病變', '抗藍光'], dosage: '10-20mg/日',
    interactions: [] },
  { id: 's7', name: '益生菌', brand: 'LP33', ingredients: ['副乾酪乳桿菌', '比菲德氏菌'],
    effects: ['腸道保健', '改善便秘', '增強免疫'], dosage: '1包/日（空腹）',
    interactions: [] },
  { id: 's8', name: '薑黃素', brand: 'Doctor\'s Best', ingredients: ['薑黃素', '黑胡椒萃取'],
    effects: ['抗發炎', '抗氧化', '關節保養', '護肝'], dosage: '500mg/日',
    interactions: [{ conflictWith: '抗凝血藥', severity: 'medium', description: '薑黃素有輕微抗凝血作用' }] },
];

const scenarios = [
  { label: '骨質保健', emoji: '🦴', ids: ['s4', 's3', 's2'] },
  { label: '心血管', emoji: '❤️', ids: ['s1', 's8'] },
  { label: '護眼', emoji: '👁', ids: ['s6', 's5'] },
  { label: '腸道健康', emoji: '🫁', ids: ['s7'] },
  { label: '提振精神', emoji: '⚡', ids: ['s5', 's3'] },
  { label: '關節保養', emoji: '🦵', ids: ['s2', 's8'] },
  { label: '改善睡眠', emoji: '😴', ids: ['s4'] },
];

interface Props {
  currentMeds: Medication[];
  onAddToMedList: (med: Medication) => void;
}

export default function SupplementSection({ currentMeds, onAddToMedList }: Props) {
  const [search, setSearch] = useState('');
  const [selectedSupplement, setSelectedSupplement] = useState<SupplementInfo | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    setScanLoading(true);
    setTimeout(() => {
      setScanLoading(false);
      setSelectedSupplement(knowledgeBase[1]); // mock: 葡萄糖胺
    }, 1500);
  };

  const elderSupplements = currentMeds.filter((m) => m.type === 'supplement');

  const searchResults = search.trim()
    ? knowledgeBase.filter((s) =>
        s.name.includes(search) || s.effects.some((e) => e.includes(search)) || s.ingredients.some((i) => i.includes(search))
      )
    : [];

  const scenarioItems = activeScenario
    ? knowledgeBase.filter((s) => scenarios.find((sc) => sc.label === activeScenario)?.ids.includes(s.id))
    : [];

  const addToMedList = (supp: SupplementInfo) => {
    onAddToMedList({
      id: `med-${Date.now()}`,
      name: supp.name,
      brandName: supp.brand,
      type: 'supplement',
      category: supp.effects[0] || '保健食品',
      dosage: supp.dosage,
      frequency: '每日',
      timeSlots: ['12:00'],
      takenToday: [false],
      interactions: supp.interactions,
    });
    setSelectedSupplement(null);
  };

  // Detail view
  if (selectedSupplement) {
    const supp = selectedSupplement;
    const alreadyAdded = elderSupplements.some((m) => m.name === supp.name);
    return (
      <div className="space-y-3">
        <button onClick={() => setSelectedSupplement(null)} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          返回搜尋
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60">
          <h3 className="text-base font-bold text-heka-text mb-1">{supp.name}</h3>
          <p className="text-xs text-heka-text-secondary mb-3">{supp.brand}</p>

          <div className="space-y-3">
            <InfoRow label="主要成分" value={supp.ingredients.join('、')} />
            <InfoRow label="建議劑量" value={supp.dosage} />
            <div>
              <p className="text-[10px] text-heka-text-secondary mb-1">功效</p>
              <div className="flex flex-wrap gap-1.5">
                {supp.effects.map((e) => (
                  <span key={e} className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-600 font-medium">{e}</span>
                ))}
              </div>
            </div>
          </div>

          {supp.interactions.length > 0 && (
            <div className="mt-4 bg-red-50 rounded-xl p-3 border border-red-100">
              <p className="text-xs font-semibold text-red-600 mb-1.5">⚠️ 交互作用警告</p>
              {supp.interactions.map((int, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`shrink-0 mt-1 w-2 h-2 rounded-full ${int.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div>
                    <p className="text-xs font-medium text-red-700">{supp.name} ✕ {int.conflictWith}</p>
                    <p className="text-[10px] text-red-600/80">{int.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => addToMedList(supp)}
            disabled={alreadyAdded}
            className={`w-full mt-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
              alreadyAdded
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-heka-purple text-white hover:bg-heka-purple-dark'
            }`}
          >
            {alreadyAdded ? '✅ 已在用藥清單中' : '加入用藥清單'}
          </button>
        </div>
      </div>
    );
  }

  if (scanLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center animate-pulse"><span className="text-2xl">🔍</span></div>
          <p className="text-sm text-heka-text">正在辨識保健食品...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hidden inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleScan()} />
      <input ref={albumRef} type="file" accept="image/*" className="hidden" onChange={() => handleScan()} />

      {/* Search + scan */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋保健食品名稱或功效..."
            className="flex-1 bg-transparent text-sm text-heka-text outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => cameraRef.current?.click()} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-heka-purple/10 text-xs font-medium text-heka-purple cursor-pointer hover:bg-heka-purple/20 transition-colors">
            📸 拍照辨識
          </button>
          <button onClick={() => albumRef.current?.click()} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-xs font-medium text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
            🖼 從相簿
          </button>
        </div>
      </div>

      {/* Search results */}
      {search.trim() && (
        <div>
          <p className="text-xs text-heka-text-secondary mb-2 px-1">搜尋結果 ({searchResults.length})</p>
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((s) => (
                <button key={s.id} onClick={() => setSelectedSupplement(s)} className="w-full bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60 text-left cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-heka-text">{s.name}</p>
                      <p className="text-[10px] text-heka-text-secondary">{s.brand} ・ {s.effects.slice(0, 2).join('、')}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">找不到「{search}」相關的保健食品</p>
          )}
        </div>
      )}

      {/* Scenario recommendations */}
      {!search.trim() && (
        <>
          <div>
            <p className="text-xs font-semibold text-heka-text-secondary mb-2 px-1">情境推薦</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {scenarios.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setActiveScenario(activeScenario === s.label ? null : s.label)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    activeScenario === s.label
                      ? 'bg-heka-purple text-white'
                      : 'bg-white/80 text-heka-text-secondary border border-white/60 hover:bg-white'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {activeScenario && scenarioItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-heka-text-secondary px-1">適合「{activeScenario}」的保健食品</p>
              {scenarioItems.map((s) => (
                <button key={s.id} onClick={() => setSelectedSupplement(s)} className="w-full bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60 text-left cursor-pointer hover:bg-white transition-colors">
                  <p className="text-sm font-medium text-heka-text">{s.name}</p>
                  <p className="text-[10px] text-heka-text-secondary">{s.effects.join('、')}</p>
                </button>
              ))}
            </div>
          )}

          {/* Elder's current supplements */}
          <div>
            <p className="text-xs font-semibold text-heka-text-secondary mb-2 px-1">
              長輩目前的保健食品 ({elderSupplements.length})
            </p>
            {elderSupplements.length > 0 ? (
              <div className="space-y-2">
                {elderSupplements.map((m) => (
                  <div key={m.id} className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-heka-text">{m.name}</p>
                        <p className="text-[10px] text-heka-text-secondary">{m.dosage} ・ {m.category}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-medium text-green-600">服用中</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">尚未加入保健食品</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-heka-text-secondary">{label}</p>
      <p className="text-sm text-heka-text">{value}</p>
    </div>
  );
}
