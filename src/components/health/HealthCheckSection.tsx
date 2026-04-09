import { useState, useRef, useEffect } from 'react';
import MiniLineChart from '../charts/MiniLineChart';
import { recognizeImage, preprocessImage, type RecognitionResult } from '../../services/recognitionService';
import RecognitionConfirm from './RecognitionConfirm';

interface HealthMetric {
  id: string;
  name: string;
  unit: string;
  category: string;
  value: number | null;
  date: string;
  normalRange: { min: number; max: number };
  history: { date: string; value: number }[];
}

interface ExplainState {
  metricId: string;
  loading: boolean;
  text: string | null;
  errorMsg: string | null;
  retryAfter: number | null; // seconds countdown for rate limit
}

const LS_CACHE_KEY = 'heka-explain-cache';

function loadLsCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LS_CACHE_KEY) || '{}');
  } catch { return {}; }
}

function saveLsCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded — ignore */ }
}

// Simple request queue to avoid rate limits
let lastRequestTime = 0;
async function throttledFetch(url: string, init: RequestInit): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1200) {
    await new Promise((r) => setTimeout(r, 1200 - elapsed));
  }
  lastRequestTime = Date.now();
  return fetch(url, init);
}

const initialMetrics: HealthMetric[] = [
  // Blood Sugar
  { id: 'fasting-glucose', name: '空腹血糖', unit: 'mg/dL', category: '血糖',
    value: 98, date: '2026/04/01', normalRange: { min: 70, max: 100 },
    history: [{ date: '01/01', value: 102 }, { date: '02/01', value: 100 }, { date: '03/01', value: 96 }, { date: '04/01', value: 98 }] },
  { id: 'postmeal-glucose', name: '飯後血糖', unit: 'mg/dL', category: '血糖',
    value: 135, date: '2026/04/01', normalRange: { min: 80, max: 140 },
    history: [{ date: '01/01', value: 155 }, { date: '02/01', value: 148 }, { date: '03/01', value: 140 }, { date: '04/01', value: 135 }] },
  // Blood Pressure
  { id: 'systolic', name: '收縮壓(高壓)', unit: 'mmHg', category: '血壓',
    value: 118, date: '2026/04/09', normalRange: { min: 90, max: 130 },
    history: [{ date: '04/03', value: 125 }, { date: '04/05', value: 120 }, { date: '04/07', value: 122 }, { date: '04/09', value: 118 }] },
  { id: 'diastolic', name: '舒張壓(低壓)', unit: 'mmHg', category: '血壓',
    value: 87, date: '2026/04/09', normalRange: { min: 60, max: 85 },
    history: [{ date: '04/03', value: 90 }, { date: '04/05', value: 88 }, { date: '04/07', value: 85 }, { date: '04/09', value: 87 }] },
  { id: 'pulse', name: '脈搏', unit: '/min', category: '血壓',
    value: 71, date: '2026/04/09', normalRange: { min: 60, max: 100 },
    history: [{ date: '04/03', value: 75 }, { date: '04/05', value: 72 }, { date: '04/07', value: 68 }, { date: '04/09', value: 71 }] },
  // Cholesterol
  { id: 'total-chol', name: '總膽固醇', unit: 'mg/dL', category: '膽固醇',
    value: 195, date: '2026/03/15', normalRange: { min: 0, max: 200 },
    history: [{ date: '09/15', value: 220 }, { date: '12/15', value: 210 }, { date: '03/15', value: 195 }] },
  { id: 'hdl', name: 'HDL', unit: 'mg/dL', category: '膽固醇',
    value: 55, date: '2026/03/15', normalRange: { min: 40, max: 999 },
    history: [{ date: '09/15', value: 48 }, { date: '12/15', value: 52 }, { date: '03/15', value: 55 }] },
  { id: 'ldl', name: 'LDL', unit: 'mg/dL', category: '膽固醇',
    value: 118, date: '2026/03/15', normalRange: { min: 0, max: 130 },
    history: [{ date: '09/15', value: 145 }, { date: '12/15', value: 135 }, { date: '03/15', value: 118 }] },
  // Kidney
  { id: 'creatinine', name: '肌酸酐', unit: 'mg/dL', category: '腎功能',
    value: 0.9, date: '2026/03/15', normalRange: { min: 0.5, max: 1.2 },
    history: [{ date: '09/15', value: 1.0 }, { date: '12/15', value: 0.95 }, { date: '03/15', value: 0.9 }] },
  { id: 'egfr', name: 'eGFR', unit: 'mL/min', category: '腎功能',
    value: 78, date: '2026/03/15', normalRange: { min: 60, max: 999 },
    history: [{ date: '09/15', value: 72 }, { date: '12/15', value: 75 }, { date: '03/15', value: 78 }] },
  // Liver
  { id: 'got', name: 'GOT (AST)', unit: 'U/L', category: '肝功能',
    value: 28, date: '2026/03/15', normalRange: { min: 0, max: 40 },
    history: [{ date: '09/15', value: 35 }, { date: '12/15', value: 30 }, { date: '03/15', value: 28 }] },
  { id: 'gpt', name: 'GPT (ALT)', unit: 'U/L', category: '肝功能',
    value: 22, date: '2026/03/15', normalRange: { min: 0, max: 40 },
    history: [{ date: '09/15', value: 32 }, { date: '12/15', value: 26 }, { date: '03/15', value: 22 }] },
  // Blood
  { id: 'hemoglobin', name: '血紅素', unit: 'g/dL', category: '血液',
    value: 12.8, date: '2026/03/15', normalRange: { min: 12.0, max: 16.0 },
    history: [{ date: '09/15', value: 12.2 }, { date: '12/15', value: 12.5 }, { date: '03/15', value: 12.8 }] },
  // Diabetes
  { id: 'hba1c', name: 'HbA1c', unit: '%', category: '糖化血色素',
    value: 5.8, date: '2026/03/15', normalRange: { min: 0, max: 5.7 },
    history: [{ date: '09/15', value: 6.2 }, { date: '12/15', value: 6.0 }, { date: '03/15', value: 5.8 }] },
  // Body
  { id: 'bmi', name: 'BMI', unit: 'kg/m²', category: '體態',
    value: 23.5, date: '2026/04/01', normalRange: { min: 18.5, max: 24.0 },
    history: [{ date: '01/01', value: 24.2 }, { date: '02/01', value: 23.8 }, { date: '03/01', value: 23.6 }, { date: '04/01', value: 23.5 }] },
];

function getStatus(value: number, range: { min: number; max: number }): { label: string; color: string; bg: string } {
  if (value < range.min) return { label: '偏低', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (value > range.max) return { label: '偏高', color: 'text-red-500', bg: 'bg-red-50' };
  return { label: '正常', color: 'text-emerald-600', bg: 'bg-emerald-50' };
}

const categories = ['全部', '血壓', '血糖', '膽固醇', '肝功能', '腎功能', '血液', '糖化血色素', '體態'];

interface Props {
  onAskAssistant?: (prefill: string) => void;
}

export default function HealthCheckSection({ onAskAssistant }: Props) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [filter, setFilter] = useState('全部');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | undefined>();
  const [explain, setExplain] = useState<ExplainState | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const explainCache = useRef<Record<string, string>>(loadLsCache());
  const scanCameraRef = useRef<HTMLInputElement>(null);
  const scanAlbumRef = useRef<HTMLInputElement>(null);

  // Countdown timer for rate limit
  useEffect(() => {
    if (retryCountdown <= 0) return;
    const t = setTimeout(() => setRetryCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [retryCountdown]);

  const requestExplain = async (m: HealthMetric) => {
    const cacheKey = `${m.id}-${m.value}`;

    // Check localStorage cache first
    if (explainCache.current[cacheKey]) {
      console.log(`[AI 解讀] Cache hit: ${m.name}`);
      setExplain({ metricId: m.id, loading: false, text: explainCache.current[cacheKey], errorMsg: null, retryAfter: null });
      return;
    }

    console.log(`[AI 解讀] Requesting: ${m.name} = ${m.value} ${m.unit}`);
    setExplain({ metricId: m.id, loading: true, text: null, errorMsg: null, retryAfter: null });

    const related = metrics
      .filter((rm) => rm.category === m.category && rm.id !== m.id && rm.value !== null)
      .map((rm) => ({
        name: rm.name,
        value: rm.value,
        unit: rm.unit,
        status: getStatus(rm.value!, rm.normalRange).label === '正常' ? 'normal' : getStatus(rm.value!, rm.normalRange).label === '偏高' ? 'high' : 'low',
      }));

    try {
      const res = await throttledFetch('/api/explain-metric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metricName: m.name,
          value: m.value,
          unit: m.unit,
          normalRange: m.normalRange,
          status: getStatus(m.value!, m.normalRange).label === '正常' ? 'normal' : getStatus(m.value!, m.normalRange).label === '偏高' ? 'high' : 'low',
          elderAge: 78,
          relatedMetrics: related,
        }),
      });

      console.log(`[AI 解讀] Response status: ${res.status}`);
      const data = await res.json();

      if (res.ok && data.explanation) {
        console.log(`[AI 解讀] Success: ${m.name}, ${data.explanation.length} chars`);
        explainCache.current[cacheKey] = data.explanation;
        saveLsCache(explainCache.current);
        setExplain({ metricId: m.id, loading: false, text: data.explanation, errorMsg: null, retryAfter: null });
      } else if (res.status === 429) {
        const wait = data.retryAfter || 30;
        console.warn(`[AI 解讀] Rate limited, retry after ${wait}s`);
        setRetryCountdown(wait);
        setExplain({ metricId: m.id, loading: false, text: null, errorMsg: `請求太頻繁，請等待 ${wait} 秒後重試`, retryAfter: wait });
      } else if (res.status === 401) {
        console.error(`[AI 解讀] Auth error`);
        setExplain({ metricId: m.id, loading: false, text: null, errorMsg: 'API 金鑰問題，請聯繫管理員', retryAfter: null });
      } else {
        console.error(`[AI 解讀] Error ${res.status}: ${data.error}`);
        setExplain({ metricId: m.id, loading: false, text: null, errorMsg: data.error || `伺服器錯誤 (${res.status})`, retryAfter: null });
      }
    } catch (err: any) {
      const msg = err?.message || '未知錯誤';
      console.error(`[AI 解讀] Network error: ${msg}`);
      if (msg.includes('timeout') || msg.includes('abort')) {
        setExplain({ metricId: m.id, loading: false, text: null, errorMsg: '網路逾時，請檢查網路連線後重試', retryAfter: null });
      } else {
        setExplain({ metricId: m.id, loading: false, text: null, errorMsg: `網路錯誤：${msg}`, retryAfter: null });
      }
    }
  };

  const handleScanFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setScanLoading(true);
    setCapturedImageUrl(URL.createObjectURL(files[0]));
    const { base64, mediaType } = await preprocessImage(files[0]);
    const result = await recognizeImage(base64, mediaType, 'healthcheck');
    setRecognitionResult(result);
    setScanLoading(false);
  };

  const handleConfirmScan = (result: RecognitionResult) => {
    if (result.recognized && result.scene === 'healthcheck') {
      // Merge recognized metrics into existing metrics
      const date = result.reportDate || new Date().toISOString().slice(0, 10);
      const dateLabel = date.slice(5).replace('-', '/');
      setMetrics((prev) => {
        const updated = [...prev];
        for (const rm of result.metrics) {
          const existing = updated.find((m) => m.name.includes(rm.name) || rm.name.includes(m.name));
          if (existing) {
            existing.value = rm.value;
            existing.date = date.replace(/-/g, '/');
            existing.history = [...existing.history, { date: dateLabel, value: rm.value }];
          }
        }
        return updated;
      });
    }
    setRecognitionResult(null);
  };

  const filtered = filter === '全部' ? metrics : metrics.filter((m) => m.category === filter);

  const startEdit = (m: HealthMetric) => {
    setEditingId(m.id);
    setEditValue(m.value?.toString() ?? '');
    setEditDate(new Date().toISOString().slice(0, 10));
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (isNaN(val)) { setEditingId(null); return; }
    const dateLabel = editDate.slice(5).replace('-', '/');
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, value: val, date: editDate.replace(/-/g, '/'), history: [...m.history, { date: dateLabel, value: val }] }
          : m
      )
    );
    setEditingId(null);
  };

  // Scan confirmation
  if (recognitionResult) {
    return (
      <RecognitionConfirm
        result={recognitionResult}
        imageUrl={capturedImageUrl}
        onConfirm={handleConfirmScan}
        onRetake={() => { setRecognitionResult(null); scanCameraRef.current?.click(); }}
        onCancel={() => setRecognitionResult(null)}
      />
    );
  }

  if (scanLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center animate-pulse"><span className="text-2xl">🔍</span></div>
          <p className="text-sm text-heka-text">正在辨識健檢報告...</p>
          <p className="text-xs text-heka-text-secondary mt-1">AI 正在讀取數值</p>
        </div>
      </div>
    );
  }

  // Count statuses
  const abnormalCount = metrics.filter((m) => m.value !== null && (m.value < m.normalRange.min || m.value > m.normalRange.max)).length;

  return (
    <div className="space-y-4">
      {/* Hidden scan inputs */}
      <input ref={scanCameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleScanFiles(e.target.files)} />
      <input ref={scanAlbumRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleScanFiles(e.target.files)} />

      {/* Scan buttons */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <p className="text-sm font-semibold text-heka-text mb-2">📸 拍照匯入健檢報告</p>
        <p className="text-xs text-heka-text-secondary mb-3">拍攝健檢報告，AI 自動讀取數值</p>
        <div className="flex gap-2">
          <button onClick={() => scanCameraRef.current?.click()} className="flex-1 py-2.5 rounded-xl bg-heka-purple text-white text-xs font-medium cursor-pointer hover:bg-heka-purple-dark transition-colors">
            📸 拍照辨識
          </button>
          <button onClick={() => scanAlbumRef.current?.click()} className="flex-1 py-2.5 rounded-xl bg-heka-purple/10 text-heka-purple text-xs font-medium cursor-pointer hover:bg-heka-purple/20 transition-colors">
            🖼 從相簿選取
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <div className="flex gap-3 text-center">
          <div className="flex-1 bg-emerald-50 rounded-xl py-2.5">
            <p className="text-lg font-bold text-emerald-600">{metrics.length - abnormalCount}</p>
            <p className="text-[10px] text-emerald-500">正常</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl py-2.5">
            <p className="text-lg font-bold text-red-500">{abnormalCount}</p>
            <p className="text-[10px] text-red-400">需注意</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl py-2.5">
            <p className="text-lg font-bold text-heka-text">{metrics.length}</p>
            <p className="text-[10px] text-heka-text-secondary">追蹤項目</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === c
                ? 'bg-heka-purple text-white'
                : 'bg-white/80 text-heka-text-secondary border border-white/60'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      {filtered.map((m) => {
        const status = m.value !== null ? getStatus(m.value, m.normalRange) : null;
        const trendColor = status?.label === '正常' ? '#10B981' : status?.label === '偏高' ? '#EF4444' : '#3B82F6';
        const isEditing = editingId === m.id;

        return (
          <div key={m.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-heka-text">{m.name}</p>
                <p className="text-[10px] text-heka-text-secondary">{m.category} ・ {m.date}</p>
              </div>
              {status && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color} ${status.bg}`}>
                  {status.label}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-heka-text">{m.value}</span>
                <span className="text-xs text-heka-text-secondary mb-0.5">{m.unit}</span>
              </div>
              {m.history.length >= 2 && (
                <MiniLineChart
                  data={m.history.map((h) => h.value)}
                  color={trendColor}
                  width={90}
                  height={28}
                />
              )}
            </div>

            {/* Normal range bar */}
            <div className="mt-2 text-[9px] text-heka-text-secondary">
              正常範圍：{m.normalRange.min === 0 ? '<' : `${m.normalRange.min} —`} {m.normalRange.max === 999 ? `>${m.normalRange.min}` : m.normalRange.max} {m.unit}
            </div>

            {/* Edit or Update */}
            {isEditing ? (
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="數值"
                  autoFocus
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-sm text-heka-text outline-none"
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-gray-50 text-xs text-heka-text outline-none"
                />
                <button
                  onClick={() => saveEdit(m.id)}
                  className="px-3 py-2 rounded-xl bg-heka-purple text-white text-xs font-medium cursor-pointer"
                >
                  存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-2 rounded-xl bg-gray-100 text-xs text-heka-text cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => startEdit(m)}
                  className="flex-1 py-2 rounded-xl bg-gray-50 text-xs text-heka-text-secondary font-medium cursor-pointer hover:bg-heka-purple/5 hover:text-heka-purple transition-colors"
                >
                  更新數值
                </button>
                <button
                  onClick={() => requestExplain(m)}
                  className="flex-1 py-2 rounded-xl bg-heka-purple/8 text-xs text-heka-purple font-medium cursor-pointer hover:bg-heka-purple/15 transition-colors"
                >
                  🤖 AI 解讀
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* AI Education log */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60 mt-4">
        <h3 className="text-sm font-semibold text-heka-text mb-3">🐧 今日 AI 衛教紀錄</h3>
        <div className="space-y-2">
          {[
            { time: '10:30', topic: '高血壓飲食注意', content: '小美向奶奶解說了少鹽飲食的重要性，建議每日鈉攝取量不超過 2000mg' },
            { time: '14:15', topic: '膝蓋保養小知識', content: '提醒奶奶久坐後要適度活動膝蓋，做簡單的伸展運動' },
          ].map((log) => (
            <div key={log.time} className="bg-gray-50/80 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-heka-purple font-medium">{log.time}</span>
                <span className="text-xs font-medium text-heka-text">{log.topic}</span>
              </div>
              <p className="text-[11px] text-heka-text-secondary leading-relaxed">{log.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health knowledge cards */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <h3 className="text-sm font-semibold text-heka-text mb-3">📖 健康知識卡</h3>
        <div className="space-y-2">
          {[
            { emoji: '🩸', title: '什麼是 HbA1c？', content: '糖化血色素反映過去 2-3 個月的平均血糖值，比單次血糖測量更能反映長期控制狀況。正常值 < 5.7%。' },
            { emoji: '🦴', title: '長輩補鈣小撇步', content: '鈣片建議隨餐或飯後服用，搭配維生素 D 可提升吸收率。避免與咖啡、茶同時服用。' },
            { emoji: '💊', title: '為什麼要定時量血壓？', content: '每天固定時間量血壓能準確追蹤趨勢。建議早上起床後和睡前各量一次，安靜坐 5 分鐘後再測量。' },
          ].map((card) => (
            <div key={card.title} className="bg-heka-purple/5 rounded-xl px-3 py-3 border border-heka-purple/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{card.emoji}</span>
                <p className="text-xs font-semibold text-heka-text">{card.title}</p>
              </div>
              <p className="text-[11px] text-heka-text-secondary leading-relaxed">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
      {/* AI Explanation bottom sheet */}
      {explain && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setExplain(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[430px] bg-white rounded-t-3xl pb-[env(safe-area-inset-bottom,16px)] max-h-[80vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mt-3 mb-2 shrink-0" />

            <div className="px-5 pb-2 shrink-0 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-heka-text">
                🤖 AI 健檢解讀
              </h3>
              <button onClick={() => setExplain(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {explain.loading && (
                <div className="flex flex-col items-center py-8">
                  <div className="w-12 h-12 rounded-full bg-heka-purple/10 flex items-center justify-center animate-pulse mb-3">
                    <span className="text-xl">🤖</span>
                  </div>
                  <p className="text-sm text-heka-text-secondary">AI 正在分析你的數值...</p>
                </div>
              )}

              {explain.errorMsg && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl mx-auto mb-3">⚠️</div>
                  <p className="text-sm text-red-500 mb-1">解讀失敗</p>
                  <p className="text-xs text-heka-text-secondary mb-4 px-4">{explain.errorMsg}</p>
                  {explain.retryAfter && retryCountdown > 0 ? (
                    <p className="text-xs text-amber-500">⏳ {retryCountdown} 秒後可重試</p>
                  ) : (
                    <button
                      onClick={() => {
                        const m = metrics.find((x) => x.id === explain.metricId);
                        if (m) requestExplain(m);
                      }}
                      className="px-6 py-2 rounded-xl bg-heka-purple text-white text-sm font-medium cursor-pointer hover:bg-heka-purple-dark transition-colors"
                    >
                      🔄 重試
                    </button>
                  )}
                </div>
              )}

              {explain.text && (
                <>
                  {/* Metric badge */}
                  {(() => {
                    const m = metrics.find((x) => x.id === explain.metricId);
                    if (!m || m.value === null) return null;
                    const st = getStatus(m.value, m.normalRange);
                    return (
                      <div className="flex items-center gap-3 mb-4 bg-gray-50/80 rounded-xl px-3 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-heka-text">{m.name}</p>
                          <p className="text-[10px] text-heka-text-secondary">{m.category}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <span className="text-lg font-bold text-heka-text">{m.value}</span>
                          <span className="text-xs text-heka-text-secondary ml-1">{m.unit}</span>
                          <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-medium ${st.color} ${st.bg}`}>{st.label}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-sm text-heka-text leading-relaxed whitespace-pre-line">
                    {explain.text}
                  </div>

                  <p className="mt-4 text-[10px] text-gray-400 leading-relaxed">
                    以上為 AI 健康知識說明，不構成醫療建議。如有疑問請諮詢醫師。
                  </p>

                  {/* Ask AI Assistant */}
                  {onAskAssistant && (
                    <button
                      onClick={() => {
                        const m = metrics.find((x) => x.id === explain.metricId);
                        if (m) {
                          setExplain(null);
                          onAskAssistant(`我的健檢報告顯示${m.name} ${m.value} ${m.unit}，想了解更多`);
                        }
                      }}
                      className="mt-3 w-full py-3 rounded-xl bg-heka-purple/10 text-sm font-medium text-heka-purple cursor-pointer hover:bg-heka-purple/20 transition-colors flex items-center justify-center gap-2"
                    >
                      💬 繼續問 AI 助手
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
