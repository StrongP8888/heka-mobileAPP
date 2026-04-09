import { useState } from 'react';
import type { Reminder } from '../types';
import { mockReminders } from '../mock/data';
import PageHeader from '../components/layout/PageHeader';
import ReminderCard from '../components/reminders/ReminderCard';
import AddReminderForm from '../components/reminders/AddReminderForm';

const categoryOrder: Reminder['category'][] = ['生活健康', '日常娛樂', '關懷互動', '貼心提醒'];

const categoryIcon: Record<string, string> = {
  '生活健康': '💚',
  '日常娛樂': '🎵',
  '關懷互動': '💜',
  '貼心提醒': '🌟',
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [showAdd, setShowAdd] = useState(false);

  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handlePin = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r))
    );
  };

  const handleSave = (newReminder: Reminder) => {
    setReminders((prev) => [...prev, newReminder]);
    setShowAdd(false);
  };

  if (showAdd) {
    return <AddReminderForm onSave={handleSave} onCancel={() => setShowAdd(false)} />;
  }

  // Group by category
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: reminders.filter((r) => r.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        }
        title="提醒"
      />

      {/* Add button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-heka-text-secondary hover:bg-white hover:text-heka-purple transition-all cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新增提醒
        </button>
      </div>

      {/* Grouped reminder list */}
      <div className="px-4 space-y-5">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <span className="text-sm">{categoryIcon[group.category]}</span>
              <h2 className="text-xs font-semibold text-heka-text-secondary tracking-wide">
                {group.category}
              </h2>
              <span className="text-[10px] text-gray-400 ml-auto">
                {group.items.filter((r) => r.enabled).length}/{group.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {group.items.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={handleToggle}
                  onPin={handlePin}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {reminders.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-heka-purple/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-sm text-heka-text-secondary">還沒有提醒</p>
            <p className="text-xs text-gray-400 mt-1">點擊上方按鈕新增第一個提醒</p>
          </div>
        </div>
      )}
    </div>
  );
}
