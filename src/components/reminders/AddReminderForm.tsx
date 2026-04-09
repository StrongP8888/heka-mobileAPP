import { useState, useRef } from 'react';
import type { Reminder } from '../../types';

interface Props {
  onSave: (reminder: Reminder) => void;
  onCancel: () => void;
}

const categories: Reminder['category'][] = ['生活健康', '日常娛樂', '關懷互動', '貼心提醒'];
const repeatOptions = ['不重複', '每天', '平日', '假日', '自訂'];
const aiTopics = ['健康關懷', '笑語逸事', '懷舊回憶', '生活衛教', '運動提醒'];

export default function AddReminderForm({ onSave, onCancel }: Props) {
  const [category, setCategory] = useState<Reminder['category']>('生活健康');
  const [date, setDate] = useState('2026-04-09');
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [repeat, setRepeat] = useState('不重複');
  const [mode, setMode] = useState<'ai' | 'message'>('ai');
  const [topic, setTopic] = useState('健康關懷');
  const [content, setContent] = useState('');
  const [notifyOnNoResponse, setNotifyOnNoResponse] = useState(false);
  const [showSender, setShowSender] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'photo' | 'video'; url: string; name: string }[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAttach = (files: FileList | null) => {
    if (!files) return;
    const newAttachments = Array.from(files).map((f) => ({
      type: (f.type.startsWith('video/') ? 'video' : 'photo') as 'photo' | 'video',
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = () => {
    const h24 = period === 'PM' && hour !== 12 ? hour + 12 : period === 'AM' && hour === 12 ? 0 : hour;
    const timeStr = `${h24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    onSave({
      id: `r-${Date.now()}`,
      category,
      time: timeStr,
      repeat,
      mode,
      topic,
      content: mode === 'message' ? content : undefined,
      enabled: true,
      pinned: false,
      notifyOnNoResponse,
      showSender,
    });
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日(週${weekdays[dt.getDay()]})`;
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-between py-3">
          <button onClick={onCancel} className="text-sm text-heka-purple font-medium cursor-pointer flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            提醒
          </button>
          <h1 className="text-base font-semibold text-heka-text">新增提醒</h1>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-heka-purple text-white text-sm font-medium cursor-pointer hover:bg-heka-purple-dark transition-colors"
          >
            儲存
          </button>
        </div>
      </header>

      <div className="px-4 space-y-3">
        {/* Category */}
        <FormRow label="類別">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Reminder['category'])}
            className="text-right text-sm text-heka-purple font-medium bg-transparent appearance-none cursor-pointer pr-5 outline-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237C3AED' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormRow>

        {/* Date + Time + Repeat group */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-heka-text">日期</span>
            <button className="text-sm text-heka-purple font-medium cursor-pointer">
              {formatDate(date)}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
              />
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-heka-text">時間</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPeriod(period === 'AM' ? 'PM' : 'AM')}
                className="text-sm text-heka-purple font-medium cursor-pointer px-2 py-1 rounded-md hover:bg-heka-purple/5"
              >
                {period === 'AM' ? '上午' : '下午'}
              </button>
              <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={hour}
                  onChange={(e) => setHour(Math.min(12, Math.max(1, Number(e.target.value))))}
                  className="w-10 text-center text-sm font-medium text-heka-purple bg-transparent outline-none py-1"
                />
                <span className="text-heka-text-secondary text-sm font-medium">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={minute.toString().padStart(2, '0')}
                  onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-10 text-center text-sm font-medium text-heka-purple bg-transparent outline-none py-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-heka-text">重複</span>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="text-right text-sm text-heka-purple font-medium bg-transparent appearance-none cursor-pointer pr-5 outline-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237C3AED' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
            >
              {repeatOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mode toggle + Topic */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-heka-text">模式</span>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setMode('ai')}
                className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  mode === 'ai'
                    ? 'bg-white text-heka-purple shadow-sm'
                    : 'text-heka-text-secondary'
                }`}
              >
                AI
              </button>
              <button
                onClick={() => setMode('message')}
                className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  mode === 'message'
                    ? 'bg-heka-purple text-white shadow-sm'
                    : 'text-heka-text-secondary'
                }`}
              >
                訊息
              </button>
            </div>
          </div>

          {mode === 'ai' ? (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-heka-text">主題</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-right text-sm text-heka-purple font-medium bg-transparent appearance-none cursor-pointer pr-5 outline-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237C3AED' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
              >
                {aiTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="px-4 py-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="輸入要傳達給長輩的訊息..."
                rows={3}
                className="w-full text-sm text-heka-text bg-gray-50/80 rounded-xl px-3 py-2.5 outline-none resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-heka-purple/20 transition-all"
              />
              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {attachments.map((att, i) => (
                    <div key={i} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      {att.type === 'photo' ? (
                        <img src={att.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" opacity={0.6}>
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(i)}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      {att.type === 'video' && (
                        <span className="absolute bottom-0.5 left-0.5 bg-black/50 rounded px-1 text-[7px] text-white">影片</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Attachment bar with real file inputs */}
              <input ref={photoInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleAttach(e.target.files)} />
              <input ref={videoInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleAttach(e.target.files)} />
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => photoInputRef.current?.click()} className="flex items-center gap-1 text-xs text-heka-text-secondary cursor-pointer hover:text-heka-purple transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  照片/影片
                </button>
                <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-1 text-xs text-heka-text-secondary cursor-pointer hover:text-heka-purple transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  拍攝
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-heka-text">未回應通知</span>
            <button
              onClick={() => setNotifyOnNoResponse(!notifyOnNoResponse)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                notifyOnNoResponse ? 'bg-heka-purple' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  notifyOnNoResponse ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-heka-text">顯示設定者</span>
            <button
              onClick={() => setShowSender(!showSender)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                showSender ? 'bg-heka-purple' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  showSender ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hint text */}
        <p className="text-xs text-heka-text-secondary text-center px-4 pt-1">
          {mode === 'ai'
            ? '小美會在指定時間，用自然對話的方式向長輩傳達這個提醒'
            : '你的訊息會由小美在指定時間轉達給長輩'}
        </p>
      </div>
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm px-4 py-3 flex items-center justify-between">
      <span className="text-sm text-heka-text">{label}</span>
      {children}
    </div>
  );
}
