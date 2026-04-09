import { useState } from 'react';
import type { RecognitionResult, Confidence } from '../../services/recognitionService';

interface Props {
  result: RecognitionResult;
  imageUrl?: string;
  onConfirm: (result: RecognitionResult) => void;
  onRetake: () => void;
  onCancel: () => void;
}

const confidenceBadge: Record<Confidence, { icon: string; label: string; cls: string }> = {
  high:   { icon: '✅', label: '高信心', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { icon: '⚠️', label: '請確認', cls: 'bg-amber-50 text-amber-600' },
  low:    { icon: '❌', label: '未辨識', cls: 'bg-red-50 text-red-500' },
};

export default function RecognitionConfirm({ result, imageUrl, onConfirm, onRetake, onCancel }: Props) {
  const [editMode, setEditMode] = useState(false);

  if (!result.recognized) {
    return (
      <div className="flex flex-col min-h-screen pb-24">
        <Header onCancel={onCancel} title="辨識失敗" />
        <div className="px-4 flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-4">❌</div>
          <p className="text-sm font-medium text-heka-text mb-1">無法辨識此圖片</p>
          <p className="text-xs text-heka-text-secondary text-center mb-6">{result.reason_zh}</p>
          <div className="flex gap-3 w-full max-w-[280px]">
            <button onClick={onRetake} className="flex-1 py-2.5 rounded-xl bg-heka-purple text-white text-sm font-medium cursor-pointer">重新拍照</button>
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-heka-text cursor-pointer">手動輸入</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <Header onCancel={onCancel} title="辨識結果" />

      <div className="px-4 space-y-3">
        {/* Overall confidence */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60">
          <span className="text-sm font-semibold text-heka-text">整體信心度</span>
          <ConfBadge conf={result.overallConfidence} />
        </div>

        {/* Thumbnail */}
        {imageUrl && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-white/60">
            <img src={imageUrl} alt="captured" className="w-full h-32 object-cover rounded-xl" />
          </div>
        )}

        {/* Scene-specific fields */}
        {result.scene === 'medication' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
            <FieldRow label="藥品名稱" value={result.drugName.zh} conf={result.drugName.confidence} editable={editMode} />
            <FieldRow label="英文名稱" value={result.drugName.en} conf={result.drugName.confidence} editable={editMode} />
            <FieldRow label="劑量" value={result.dosage.value} conf={result.dosage.confidence} editable={editMode} />
            <FieldRow label="用法用量" value={result.frequency.value} conf={result.frequency.confidence} editable={editMode} />
            {result.indication && <FieldRow label="適應症" value={result.indication.value} conf={result.indication.confidence} editable={editMode} />}
            {result.sideEffects && <FieldRow label="副作用" value={result.sideEffects.value} conf={result.sideEffects.confidence} editable={editMode} last />}
          </div>
        )}

        {result.scene === 'supplement' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
            <FieldRow label="產品名稱" value={result.productName.zh} conf={result.productName.confidence} editable={editMode} />
            <FieldRow label="品牌" value={result.brand.value} conf={result.brand.confidence} editable={editMode} />
            <FieldRow label="建議用量" value={result.recommendedDosage.value} conf={result.recommendedDosage.confidence} editable={editMode} />
            <div className="px-4 py-3 border-b border-gray-50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-heka-text-secondary">主要成分</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.keyIngredients.map((ing) => (
                  <span key={ing.name} className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600">
                    {ing.name} {ing.amount}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <span className="text-xs text-heka-text-secondary block mb-1.5">保健功效</span>
              <div className="flex flex-wrap gap-1.5">
                {result.healthClaims.map((c) => (
                  <span key={c} className="px-2.5 py-0.5 rounded-full bg-heka-purple/8 text-xs text-heka-purple">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {result.scene === 'healthcheck' && (
          <>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-heka-text-secondary">報告日期</p>
                <p className="text-sm font-medium text-heka-text">{result.reportDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-heka-text-secondary">醫療機構</p>
                <p className="text-sm font-medium text-heka-text">{result.institution}</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100">
                <p className="text-xs font-semibold text-heka-text-secondary">辨識到 {result.metrics.length} 項指標</p>
              </div>
              {result.metrics.map((m, i) => {
                const statusStyle = m.status === 'normal'
                  ? 'bg-emerald-50 text-emerald-600'
                  : m.status === 'high'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-blue-50 text-blue-600';
                const statusLabel = m.status === 'normal' ? '正常' : m.status === 'high' ? '偏高' : '偏低';
                return (
                  <div key={m.name} className={`flex items-center justify-between px-4 py-2.5 ${i < result.metrics.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-heka-text">{m.name}</p>
                      <p className="text-[9px] text-gray-400">{m.category} ・ 參考 {m.referenceRange}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-heka-text">{m.value}</span>
                      <span className="text-[9px] text-gray-400">{m.unit}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${statusStyle}`}>{statusLabel}</span>
                      <ConfBadge conf={m.confidence} small />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 text-center px-4">
          AI 辨識結果僅供參考，請核對後再儲存。用藥相關問題請諮詢醫師或藥師。
        </p>

        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onConfirm(result)}
            className="w-full py-3 rounded-xl bg-heka-purple text-white text-sm font-medium cursor-pointer hover:bg-heka-purple-dark transition-colors"
          >
            ✅ 確認並加入
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex-1 py-2.5 rounded-xl bg-white/90 border border-white/60 text-sm font-medium text-heka-text cursor-pointer hover:bg-gray-50 transition-colors"
            >
              ✏️ {editMode ? '完成修改' : '修改辨識結果'}
            </button>
            <button
              onClick={onRetake}
              className="flex-1 py-2.5 rounded-xl bg-white/90 border border-white/60 text-sm font-medium text-heka-text cursor-pointer hover:bg-gray-50 transition-colors"
            >
              📸 重新拍照
            </button>
          </div>
        </div>
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

function FieldRow({ label, value, conf, editable, last }: {
  label: string; value: string; conf: Confidence; editable?: boolean; last?: boolean;
}) {
  const [editVal, setEditVal] = useState(value);
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${last ? '' : 'border-b border-gray-50'}`}>
      <span className="text-xs text-heka-text-secondary shrink-0 w-16">{label}</span>
      {editable ? (
        <input
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          className="flex-1 mx-2 text-sm text-heka-text bg-gray-50 rounded-lg px-2 py-1 outline-none text-right"
        />
      ) : (
        <span className="flex-1 text-sm text-heka-text text-right truncate mx-2">{value}</span>
      )}
      <ConfBadge conf={conf} small />
    </div>
  );
}

function ConfBadge({ conf, small }: { conf: Confidence; small?: boolean }) {
  const b = confidenceBadge[conf];
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-medium ${b.cls} ${small ? 'text-[8px]' : 'text-[10px]'}`}>
      <span className={small ? 'text-[8px]' : 'text-[10px]'}>{b.icon}</span>
      {!small && b.label}
    </span>
  );
}
