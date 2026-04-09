import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

const presetQuestions = [
  '奶奶今天過得怎麼樣？',
  '她心情好嗎？',
  '今天有按時吃藥嗎？',
  '最近認知遊戲表現如何？',
  '奶奶最近常聊什麼話題？',
];

const mockResponses: Record<string, string> = {
  '奶奶今天過得怎麼樣？': '王奶奶今天整體狀態不錯！上午跟小美聊了菜市場的事，心情愉快。完成了 3 堂認知課程（財神金頭腦 80 分、記憶長河 72 分、神手抓福氣 88 分）。下午做了 10 分鐘的上肢伸展運動。不過她有提到膝蓋有點痠，建議留意。',
  '她心情好嗎？': '今日情緒分數平均 76 分，屬於「開心」等級 😊。上午 11 點和下午 4 點情緒最佳（80-82 分），下午 1-2 點稍低（60-65 分），可能是午休後比較疲倦。7 日趨勢穩定上升，整體很正向！',
  '今天有按時吃藥嗎？': '今天共 6 項用藥，已完成 3 項：\n✅ 阿斯匹靈 100mg（08:00）\n✅ 降血壓藥 5mg（08:00）\n✅ 鈣片 600mg（12:00）\n⏳ 維生素 D3 1000IU（12:00 待服用）\n⏳ 降血壓藥 5mg（20:00 晚間）\n⏳ 魚油 1000mg（20:00 晚間）\n\n⚠️ 提醒：阿斯匹靈和魚油建議間隔 2 小時服用，避免增加出血風險。',
  '最近認知遊戲表現如何？': '近 7 天認知遊戲表現穩定進步：\n\n📈 財神金頭腦（注意力）：65→80 分，進步 23%\n📈 柴神記憶長河（記憶力）：55→72 分，進步 31%\n📈 神手抓福氣（手眼協調）：70→88 分，進步 26%\n\nCASI 六維度中，記憶力提升最明顯，語言能力最穩定（82 分）。整體趨勢很好！',
  '奶奶最近常聊什麼話題？': '近 7 天高頻話題：\n\n🏪 菜市場（5 次）— 想去買菜，懷念以前賣菜的日子\n👶 孫子（4 次）— 想見孫子，問他什麼時候來\n🎵 唱歌（3 次）— 教小美唱歌，心情很好\n🦵 膝蓋（3 次）— 說有點痠，但不嚴重\n🏠 以前的家（6 次）— 懷舊回憶，情緒穩定\n\n建議：奶奶很想念家人，可以多打電話或傳影片給她。',
};

function getAiResponse(question: string): string {
  for (const [key, value] of Object.entries(mockResponses)) {
    if (question.includes(key.slice(0, 4)) || key.includes(question.slice(0, 4))) {
      return value;
    }
  }
  return `根據今天的互動數據分析：王奶奶今日情緒評分 76 分（開心），完成 3/5 堂認知課程，互動時長 47 分鐘。有提到膝蓋痠痛，建議持續關注。\n\n如果你有更具體的問題，可以試試問「奶奶今天過得怎麼樣？」或「今天有按時吃藥嗎？」`;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是 HEKA AI 助手 🐧\n\n我可以幫你了解長輩的狀況——今天的心情、課程進度、用藥情況，都可以問我。\n\n你想了解什麼？',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAiResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="shrink-0 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h1 className="text-base font-semibold text-heka-purple">AI 助手</h1>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-heka-purple/20 to-heka-purple/5 flex items-center justify-center text-sm shrink-0 mr-2 mt-1">
                🐧
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-heka-purple text-white rounded-br-sm'
                  : 'bg-white/90 backdrop-blur-sm text-heka-text border border-white/60 shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-heka-purple/20 to-heka-purple/5 flex items-center justify-center text-sm shrink-0 mr-2 mt-1">
              🐧
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 border border-white/60 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset questions */}
      {messages.length <= 1 && (
        <div className="shrink-0 px-4 pb-2">
          <p className="text-xs text-heka-text-secondary mb-2">快速提問</p>
          <div className="flex flex-wrap gap-1.5">
            {presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full bg-white/80 text-xs text-heka-text border border-white/60 cursor-pointer hover:bg-heka-purple/5 hover:text-heka-purple transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-[calc(env(safe-area-inset-bottom,8px)+80px)]">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/60 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
            placeholder="問我關於長輩的任何事..."
            className="flex-1 bg-transparent text-sm text-heka-text outline-none placeholder:text-gray-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center text-heka-purple cursor-pointer hover:bg-heka-purple/10 rounded-lg transition-colors disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-heka-purple/10 text-heka-purple cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
