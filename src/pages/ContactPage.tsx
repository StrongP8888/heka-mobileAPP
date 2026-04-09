import { useState } from 'react';
import type { Reminder } from '../types';
import { mockReminders } from '../mock/data';
import ReminderCard from '../components/reminders/ReminderCard';
import AddReminderForm from '../components/reminders/AddReminderForm';
import PhotoAlbum from '../components/browse/PhotoAlbum';

type SubTab = 'reminders' | 'send';
type View = 'list' | 'add';

const categoryOrder: Reminder['category'][] = ['生活健康', '日常娛樂', '關懷互動', '貼心提醒'];
const categoryIcon: Record<string, string> = {
  '生活健康': '💚', '日常娛樂': '🎵', '關懷互動': '💜', '貼心提醒': '🌟',
};

export default function ContactPage() {
  const [subTab, setSubTab] = useState<SubTab>('reminders');
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [view, setView] = useState<View>('list');

  const handleToggle = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };
  const handlePin = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r)));
  };
  const handleSave = (newReminder: Reminder) => {
    setReminders((prev) => [...prev, newReminder]);
    setView('list');
  };

  if (view === 'add') {
    return <AddReminderForm onSave={handleSave} onCancel={() => setView('list')} />;
  }

  const grouped = categoryOrder
    .map((cat) => ({ category: cat, items: reminders.filter((r) => r.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h1 className="text-base font-semibold text-heka-purple">聯繫</h1>
        </div>

        {/* Sub-tabs */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 mb-2">
          <button
            onClick={() => setSubTab('reminders')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              subTab === 'reminders' ? 'bg-white text-heka-purple shadow-sm' : 'text-heka-text-secondary'
            }`}
          >
            📋 提醒
          </button>
          <button
            onClick={() => setSubTab('send')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              subTab === 'send' ? 'bg-white text-heka-purple shadow-sm' : 'text-heka-text-secondary'
            }`}
          >
            📸 傳送
          </button>
        </div>
      </header>

      {subTab === 'reminders' && (
        <>
          {/* Add button */}
          <div className="px-4 mb-4">
            <button
              onClick={() => setView('add')}
              className="w-full py-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-heka-text-secondary hover:bg-white hover:text-heka-purple transition-all cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              新增提醒
            </button>
          </div>

          {/* Grouped list */}
          <div className="px-4 space-y-5">
            {grouped.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className="text-sm">{categoryIcon[group.category]}</span>
                  <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide">{group.category}</h2>
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {group.items.filter((r) => r.enabled).length}/{group.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.items.map((reminder) => (
                    <ReminderCard key={reminder.id} reminder={reminder} onToggle={handleToggle} onPin={handlePin} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subTab === 'send' && (
        <div className="px-4">
          <PhotoAlbum onBack={() => setSubTab('reminders')} />
        </div>
      )}
    </div>
  );
}
