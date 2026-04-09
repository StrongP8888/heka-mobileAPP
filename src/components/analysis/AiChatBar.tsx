import { useState } from 'react';

const presetQuestions = [
  '長輩最近談話關鍵字。',
  '長輩的睡眠狀況。',
  '長輩最近在想什麼。',
  '認知遊戲的進步趨勢？',
  '最近有提到身體不舒服嗎？',
];

export default function AiChatBar() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = (question: string) => {
    setInput('');
    // Mock AI response
    const responses: Record<string, string> = {
      '長輩最近談話關鍵字。': '近 7 天高頻詞彙：菜市場（5次）、膝蓋（3次）、孫子（4次）、唱歌（3次）、以前（6次）。主要話題圍繞在懷舊回憶和家人，顯示社交需求活躍。',
      '長輩的睡眠狀況。': '根據近期對話分析，奶奶提到「昨晚睡得不錯」共 4 次，但有 2 次提到半夜醒來。整體睡眠品質評估為中等偏好。建議持續關注。',
      '長輩最近在想什麼。': '最近對話中，奶奶經常提到想去菜市場和想見孫子。情緒上偏正向，但偶爾流露出對過去生活的懷念。認知教練互動時表現積極。',
    };
    setResponse(responses[question] || '基於近 7 天的互動數據分析，奶奶整體狀況穩定，情緒正向為主。認知訓練參與度良好，遊戲分數呈上升趨勢。建議持續鼓勵互動。');
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <h3 className="text-sm font-semibold text-heka-text mb-2">你想問什麼？</h3>

      {/* Preset questions */}
      <div className="space-y-2 mb-4">
        {presetQuestions.slice(0, 3).map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50/80 text-xs text-heka-text-secondary hover:bg-heka-purple/5 hover:text-heka-purple transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* AI Response */}
      {response && (
        <div className="mb-4 p-3 rounded-xl bg-heka-purple/5 border border-heka-purple/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs">✨</span>
            <span className="text-xs font-medium text-heka-purple">AI 分析回覆</span>
          </div>
          <p className="text-xs text-heka-text leading-relaxed">{response}</p>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) handleAsk(input); }}
          placeholder="輸入你的問題..."
          className="flex-1 bg-transparent text-sm text-heka-text outline-none placeholder:text-gray-400"
        />
        <button
          onClick={() => { if (input.trim()) handleAsk(input); }}
          className="w-8 h-8 flex items-center justify-center text-heka-purple cursor-pointer hover:bg-heka-purple/10 rounded-lg transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-heka-purple/10 text-heka-purple cursor-pointer hover:bg-heka-purple/20 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>
    </div>
  );
}
