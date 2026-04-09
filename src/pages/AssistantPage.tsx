import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

const presetQuestions = [
  '奶奶今天過得怎麼樣？',
  '她心情好嗎？',
  '今天有按時吃藥嗎？',
  '最近認知遊戲表現如何？',
  '奶奶最近常聊什麼話題？',
];

// Follow-up suggestions keyed by question keywords
const followUpMap: Record<string, string[]> = {
  '過得怎麼樣': ['查看詳細對話紀錄', '認知訓練成績如何？', '今天有按時吃藥嗎？', '她的膝蓋嚴重嗎？'],
  '心情': ['查看 7 日情緒趨勢', '奶奶今天聊了什麼？', '有什麼方法讓她更開心？', '最近有情緒低落的時候嗎？'],
  '吃藥': ['藥物交互作用有哪些？', '魚油和阿斯匹靈怎麼吃比較安全？', '設定用藥提醒', '本週服藥遵從度？'],
  '遊戲': ['哪個認知維度進步最多？', '要不要調整遊戲難度？', '查看 CASI 雷達圖', '奶奶最喜歡哪個遊戲？'],
  '話題': ['她想見孫子，要不要傳影片給她？', '幫我設一個關懷提醒', '最近有提到身體不舒服嗎？', '查看完整對話紀錄'],
};

const defaultFollowUps = ['奶奶今天過得怎麼樣？', '查看用藥狀況', '幫我設一個提醒', '認知訓練表現如何？'];

function getFollowUps(question: string): string[] {
  for (const [keyword, suggestions] of Object.entries(followUpMap)) {
    if (question.includes(keyword)) return suggestions;
  }
  return defaultFollowUps;
}

const mockResponses: Record<string, string> = {
  '奶奶今天過得怎麼樣？': '王奶奶今天整體狀態不錯！上午跟小美聊了菜市場的事，心情愉快。完成了 3 堂認知課程（財神金頭腦 80 分、記憶長河 72 分、神手抓福氣 88 分）。下午做了 10 分鐘的上肢伸展運動。不過她有提到膝蓋有點痠，建議留意。',
  '她心情好嗎？': '今日情緒分數平均 76 分，屬於「開心」等級 😊。上午 11 點和下午 4 點情緒最佳（80-82 分），下午 1-2 點稍低（60-65 分），可能是午休後比較疲倦。7 日趨勢穩定上升，整體很正向！',
  '今天有按時吃藥嗎？': '今天共 6 項用藥，已完成 3 項：\n✅ 阿斯匹靈 100mg（08:00）\n✅ 降血壓藥 5mg（08:00）\n✅ 鈣片 600mg（12:00）\n⏳ 維生素 D3 1000IU（12:00 待服用）\n⏳ 降血壓藥 5mg（20:00 晚間）\n⏳ 魚油 1000mg（20:00 晚間）\n\n⚠️ 提醒：阿斯匹靈和魚油建議間隔 2 小時服用，避免增加出血風險。',
  '最近認知遊戲表現如何？': '近 7 天認知遊戲表現穩定進步：\n\n📈 財神金頭腦（注意力）：65→80 分，進步 23%\n📈 柴神記憶長河（記憶力）：55→72 分，進步 31%\n📈 神手抓福氣（手眼協調）：70→88 分，進步 26%\n\nCASI 六維度中，記憶力提升最明顯，語言能力最穩定（82 分）。整體趨勢很好！',
  '奶奶最近常聊什麼話題？': '近 7 天高頻話題：\n\n🏪 菜市場（5 次）— 想去買菜，懷念以前賣菜的日子\n👶 孫子（4 次）— 想見孫子，問他什麼時候來\n🎵 唱歌（3 次）— 教小美唱歌，心情很好\n🦵 膝蓋（3 次）— 說有點痠，但不嚴重\n🏠 以前的家（6 次）— 懷舊回憶，情緒穩定\n\n建議：奶奶很想念家人，可以多打電話或傳影片給她。',
  '查看詳細對話紀錄': '今天共 5 段對話：\n\n🕗 08:15 開心夥伴（12 分鐘）\n聊到以前在市場賣菜的日子，心情很好\n\n🕤 09:30 認知教練（8 分鐘）\n財神金頭腦中等難度，正確率 80%\n\n🕥 10:45 開心夥伴（15 分鐘）\n講了三個笑話，主動聊到孫子\n\n🕑 14:00 認知教練（10 分鐘）\n柴神記憶長河順向記憶，完成 3 關\n\n🕞 15:30 復健教練（12 分鐘）\n上肢伸展運動，動作完成度 85%',
  '藥物交互作用有哪些？': '目前偵測到 2 組交互作用：\n\n⚠️ 阿斯匹靈 ✕ 魚油\n風險：中等 — 兩者都有抗凝血作用，合併使用可能增加出血風險\n建議：間隔至少 2 小時服用\n\n⚠️ 鈣片 ✕ 降血壓藥\n風險：低 — 鈣可能輕微降低藥效\n建議：間隔 2 小時即可\n\n✅ 其餘藥物組合無交互作用風險',
  '她的膝蓋嚴重嗎？': '根據近 7 天的對話紀錄，奶奶提到膝蓋痠共 3 次，主要在上午對話時提及。描述為「有點痠」但「還好」，未表達嚴重疼痛。\n\n建議：\n1. 持續觀察，如果頻率增加或描述加重就要注意\n2. 下次回診時可以向醫師反映\n3. 復健教練的運動課程已避開膝蓋負重動作',
  '查看 7 日情緒趨勢': '近 7 日情緒平均分數：\n\n04/03  65 分 😐\n04/04  70 分 😊\n04/05  62 分 😐（較低，當天較少互動）\n04/06  75 分 😊\n04/07  68 分 😐\n04/08  73 分 😊\n04/09  76 分 😊（今天）\n\n整體趨勢：穩定上升 📈\n本週最高：今天 76 分\n本週最低：04/05 62 分（互動時間僅 28 分鐘）',
  '設定用藥提醒': '好的！你可以到「聯繫」頁面的提醒功能，新增用藥提醒：\n\n1. 選擇「生活健康」分類\n2. 選擇 AI 模式（小美會用對話方式提醒奶奶吃藥）\n3. 設定時間和重複規則\n\n💡 在「健康」頁面新增藥物時，也可以自動產生用藥提醒喔！',
  '幫我設一個提醒': '好的！你想設什麼提醒呢？\n\n常見的提醒類型：\n💊 用藥提醒 — 定時提醒奶奶吃藥\n💪 運動提醒 — 提醒做復健運動\n💬 關懷提醒 — 傳達家人的問候\n🎵 娛樂提醒 — 提醒聽音樂或做喜歡的事\n\n你可以到「聯繫 → 提醒」直接新增，或告訴我你想設什麼內容！',
  '幫我設一個關懷提醒': '你可以到「聯繫 → 提醒」新增關懷提醒！\n\n建議設定：\n📋 分類：關懷互動\n⏰ 時間：下午 3:00（奶奶通常午休後精神好）\n🔄 重複：每天\n💬 模式：訊息模式 — 錄一段語音或寫一段文字\n\n小美會在指定時間把你的訊息轉達給奶奶 🐧',
};

function getAiResponse(question: string): string {
  // Exact match
  if (mockResponses[question]) return mockResponses[question];
  // Partial match
  for (const [key, value] of Object.entries(mockResponses)) {
    if (question.includes(key.slice(0, 4)) || key.includes(question.slice(0, 4))) {
      return value;
    }
  }
  return `根據今天的互動數據分析：王奶奶今日情緒評分 76 分（開心），完成 3/5 堂認知課程，互動時長 47 分鐘。有提到膝蓋痠痛，建議持續關注。\n\n如果你有更具體的問題，可以試試問「奶奶今天過得怎麼樣？」或「今天有按時吃藥嗎？」`;
}

interface MessageWithFollowUps extends ChatMessage {
  followUps?: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<MessageWithFollowUps[]>([
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
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: MessageWithFollowUps = {
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
      const suggestions = getFollowUps(text);
      const aiMsg: MessageWithFollowUps = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        followUps: suggestions,
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
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

            {/* Follow-up suggestions after AI messages */}
            {msg.role === 'assistant' && msg.followUps && idx === messages.length - 1 && !isTyping && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
                {msg.followUps.map((fu) => (
                  <button
                    key={fu}
                    onClick={() => sendMessage(fu)}
                    className="px-3 py-1.5 rounded-full bg-heka-purple/8 text-xs text-heka-purple font-medium border border-heka-purple/15 cursor-pointer hover:bg-heka-purple/15 transition-colors"
                  >
                    {fu}
                  </button>
                ))}
              </div>
            )}
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

      {/* Preset questions — ALWAYS visible */}
      <div className="shrink-0 px-4 pb-2">
        <p className="text-[10px] text-heka-text-secondary mb-1.5">快速提問</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/80 text-xs text-heka-text border border-white/60 cursor-pointer hover:bg-heka-purple/5 hover:text-heka-purple transition-colors disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

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
            disabled={!input.trim() || isTyping}
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
