import type { Reminder } from '../../types';

interface Props {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onPin: (id: string) => void;
}

export default function ReminderCard({ reminder, onToggle, onPin }: Props) {
  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? '下午' : '上午';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${period} ${displayH}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`relative bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 border transition-all ${
        reminder.enabled
          ? 'border-white/60 shadow-sm'
          : 'border-gray-100 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Left: content */}
        <div className="flex-1 min-w-0">
          {/* Time + Repeat tags */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-heka-purple/8 text-xs font-medium text-heka-purple">
              {formatTime(reminder.time)}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs text-heka-text-secondary">
              {reminder.repeat}
            </span>
            {reminder.mode === 'message' && (
              <span className="inline-flex items-center gap-0.5 text-xs text-heka-purple">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#7C3AED" stroke="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
            )}
          </div>

          {/* Topic / Content */}
          <p className="text-sm text-heka-text truncate">
            {reminder.content || reminder.topic}
          </p>
        </div>

        {/* Right: pin + toggle */}
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <button
            onClick={() => onPin(reminder.id)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              reminder.pinned
                ? 'text-heka-purple bg-heka-purple/10'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={reminder.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 17v5M9 2h6l-1 7h4l-7 8 1-5H8l1-10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Toggle switch */}
          <button
            onClick={() => onToggle(reminder.id)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
              reminder.enabled ? 'bg-heka-purple' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                reminder.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
