import { useState, useRef } from 'react';
import type { Medication } from '../../types';
import { recognizeImage, preprocessImage, type RecognitionResult } from '../../services/recognitionService';
import RecognitionConfirm from './RecognitionConfirm';

interface Props {
  onSave: (med: Medication) => void;
  onCancel: () => void;
}

type EntryMode = 'choose' | 'scan' | 'confirm' | 'manual';

const typeOptions: { value: Medication['type']; label: string }[] = [
  { value: 'prescription', label: '處方藥' },
  { value: 'supplement', label: '保健食品' },
];

const frequencyOptions: { value: Medication['frequency']; label: string }[] = [
  { value: '每日', label: '每日' },
  { value: '週期', label: '週期' },
  { value: '需要時', label: '需要時' },
  { value: '訓練日', label: '訓練日' },
];

const categorySuggestions = ['心血管', '骨質保健', '消化腸道', '護眼', '神經系統', '免疫', '抗生素', '維生素', '止痛', '其他'];

export default function AddMedicationForm({ onSave, onCancel }: Props) {
  const [mode, setMode] = useState<EntryMode>('choose');
  const [name, setName] = useState('');
  const [type, setType] = useState<Medication['type']>('prescription');
  const [category, setCategory] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<Medication['frequency']>('每日');
  const [timeSlots, setTimeSlots] = useState<string[]>(['08:00']);
  const [scanResult, setScanResult] = useState<{ name: string; dosage: string; category: string } | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | undefined>();

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleScan = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setMode('scan');
    setCapturedImageUrl(URL.createObjectURL(files[0]));
    const { base64, mediaType } = await preprocessImage(files[0]);
    const result = await recognizeImage(base64, mediaType, 'medication');
    setRecognitionResult(result);
    setMode('confirm');
  };

  const handleConfirm = (result: RecognitionResult) => {
    if (result.recognized && result.scene === 'medication') {
      setName(result.drugName.zh);
      setDosage(result.dosage.value);
      setCategory('心血管');
      setType(result.type === 'otc' ? 'supplement' : 'prescription');
      setScanResult({ name: result.drugName.zh, dosage: result.dosage.value, category: '心血管' });
    }
    setMode('manual');
  };

  const addTimeSlot = () => setTimeSlots((prev) => [...prev, '12:00']);
  const removeTimeSlot = (idx: number) => setTimeSlots((prev) => prev.filter((_, i) => i !== idx));
  const updateTimeSlot = (idx: number, val: string) => setTimeSlots((prev) => prev.map((t, i) => (i === idx ? val : t)));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: `med-${Date.now()}`,
      name: name.trim(),
      type,
      category: category || '其他',
      dosage: dosage || '—',
      frequency,
      timeSlots,
      takenToday: timeSlots.map(() => false),
      interactions: [],
    });
  };

  // === Choose mode ===
  if (mode === 'choose') {
    return (
      <div className="flex flex-col min-h-screen pb-24">
        <Header title="新增藥物" onCancel={onCancel} />
        <div className="px-4 space-y-3">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleScan(e.target.files)} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleScan(e.target.files)} />

          <button
            onClick={() => cameraRef.current?.click()}
            className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60 flex items-center gap-4 cursor-pointer hover:bg-white transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-heka-purple/10 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-heka-text">📸 拍照辨識</p>
              <p className="text-xs text-heka-text-secondary mt-0.5">拍攝藥品包裝，AI 自動辨識名稱和劑量</p>
            </div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60 flex items-center gap-4 cursor-pointer hover:bg-white transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-heka-text">🖼 從相簿選取</p>
              <p className="text-xs text-heka-text-secondary mt-0.5">選擇已有的藥品照片進行辨識</p>
            </div>
          </button>

          <button
            onClick={() => setMode('manual')}
            className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60 flex items-center gap-4 cursor-pointer hover:bg-white transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-heka-text">✏️ 手動輸入</p>
              <p className="text-xs text-heka-text-secondary mt-0.5">直接輸入藥品名稱、劑量和服用時間</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // === Scan loading ===
  if (mode === 'scan') {
    return (
      <div className="flex flex-col min-h-screen pb-24">
        <Header title="AI 辨識中" onCancel={onCancel} />
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center animate-pulse">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-sm text-heka-text font-medium">正在辨識藥品資訊...</p>
            <p className="text-xs text-heka-text-secondary mt-1">AI 正在分析照片中的文字</p>
          </div>
        </div>
      </div>
    );
  }

  // === Confirmation screen ===
  if (mode === 'confirm' && recognitionResult) {
    return (
      <RecognitionConfirm
        result={recognitionResult}
        imageUrl={capturedImageUrl}
        onConfirm={handleConfirm}
        onRetake={() => { setMode('choose'); setRecognitionResult(null); }}
        onCancel={onCancel}
      />
    );
  }

  // === Manual entry (also used after scan auto-fill) ===
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-between py-3">
          <button onClick={() => setMode('choose')} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回
          </button>
          <h1 className="text-base font-semibold text-heka-text">
            {scanResult ? 'AI 辨識結果' : '手動輸入'}
          </h1>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-1.5 rounded-lg bg-heka-purple text-white text-sm font-medium cursor-pointer disabled:opacity-40"
          >
            儲存
          </button>
        </div>
      </header>

      <div className="px-4 space-y-3">
        {scanResult && (
          <div className="bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100 flex items-center gap-2">
            <span className="text-sm">✅</span>
            <p className="text-xs text-emerald-700">AI 已辨識藥品資訊，請確認後儲存</p>
          </div>
        )}

        {/* Name */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm px-4 py-3">
          <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">藥品名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：阿斯匹靈、鈣片"
            className="w-full mt-1 text-sm text-heka-text bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Type */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm px-4 py-3">
          <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider mb-2 block">類型</label>
          <div className="flex gap-2">
            {typeOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => setType(o.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  type === o.value
                    ? o.value === 'prescription' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-heka-text-secondary'
                }`}
              >
                {o.value === 'prescription' ? '💊 ' : '🧴 '}{o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm px-4 py-3">
          <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">分類</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="例：心血管、骨質保健"
            className="w-full mt-1 text-sm text-heka-text bg-transparent outline-none placeholder:text-gray-300"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {categorySuggestions.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-colors ${
                  category === c ? 'bg-heka-purple text-white' : 'bg-gray-100 text-heka-text-secondary hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dosage + Frequency */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">劑量</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="例：100mg、600mg"
              className="w-full mt-1 text-sm text-heka-text bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="px-4 py-3">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider mb-2 block">頻率</label>
            <div className="flex gap-1.5">
              {frequencyOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setFrequency(o.value)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition-all ${
                    frequency === o.value ? 'bg-heka-purple text-white' : 'bg-gray-100 text-heka-text-secondary'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-heka-text-secondary uppercase tracking-wider">服用時間</label>
            <button onClick={addTimeSlot} className="text-xs text-heka-purple font-medium cursor-pointer">+ 新增時段</button>
          </div>
          <div className="space-y-2">
            {timeSlots.map((slot, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={slot}
                  onChange={(e) => updateTimeSlot(i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-sm text-heka-text outline-none"
                />
                {timeSlots.length > 1 && (
                  <button onClick={() => removeTimeSlot(i)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-heka-text-secondary text-center px-4 pt-1">
          儲存後會自動檢查藥物交互作用，並在「聯繫」頁產生用藥提醒
        </p>
      </div>
    </div>
  );
}

function Header({ title, onCancel }: { title: string; onCancel: () => void }) {
  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
      <div className="flex items-center justify-between py-3">
        <button onClick={onCancel} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <h1 className="text-base font-semibold text-heka-text">{title}</h1>
        <div className="w-12" />
      </div>
    </header>
  );
}
