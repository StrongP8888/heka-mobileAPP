import { useState } from 'react';
import { mockRoleSchedule } from '../../mock/data';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const roleStyle: Record<string, { bg: string; border: string; text: string }> = {
  '開心夥伴': { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' },
  '認知教練': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  '復健教練': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
};

const roleEmoji: Record<string, string> = {
  '開心夥伴': '😊',
  '認知教練': '🧠',
  '復健教練': '💪',
};

export default function RoleScheduleSection() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);

  const schedule = mockRoleSchedule.find((s) => s.dayOfWeek === selectedDay);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <h3 className="text-sm font-semibold text-heka-text mb-3">角色排程</h3>

      {/* Day selector */}
      <div className="flex gap-1 mb-4">
        {weekdays.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedDay === i
                ? 'bg-heka-purple text-white shadow-sm'
                : i === today
                ? 'bg-heka-purple/10 text-heka-purple'
                : 'bg-gray-50 text-heka-text-secondary hover:bg-gray-100'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {schedule && schedule.slots.length > 0 ? (
        <div className="relative pl-4">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-3">
            {schedule.slots.map((slot, i) => {
              const style = roleStyle[slot.role];
              return (
                <div key={i} className="relative flex gap-3">
                  {/* Dot */}
                  <div className={`absolute -left-4 top-3 w-2.5 h-2.5 rounded-full border-2 ${style.border} ${style.bg}`} />

                  <div className={`flex-1 rounded-xl px-3 py-2.5 ${style.bg}/50 border ${style.border}/30`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{roleEmoji[slot.role]}</span>
                      <span className={`text-xs font-semibold ${style.text}`}>{slot.role}</span>
                      <span className="ml-auto text-[11px] text-heka-text-secondary font-medium">
                        {slot.startTime} — {slot.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-heka-text-secondary py-4">今日無排程</p>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
        {Object.entries(roleEmoji).map(([role, emoji]) => (
          <span key={role} className="flex items-center gap-1 text-[10px] text-heka-text-secondary">
            <span>{emoji}</span> {role}
          </span>
        ))}
      </div>
    </div>
  );
}
