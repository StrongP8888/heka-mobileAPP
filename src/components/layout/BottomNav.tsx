import type { TabId } from '../../types';

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'summary',
    label: '摘要',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#7C3AED' : 'none'} stroke={active ? '#7C3AED' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'share',
    label: '分享',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7C3AED' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'analysis',
    label: '',
    icon: () => <span />, // Placeholder — rendered as floating button
  },
  {
    id: 'reminders',
    label: '提醒',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7C3AED' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'browse',
    label: '瀏覽',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7C3AED' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      {/* Curved white background */}
      <div className="relative">
        {/* Floating center button */}
        <button
          onClick={() => onTabChange('analysis')}
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer border-4 border-white"
          style={{
            background: 'linear-gradient(135deg, #60E0D0 0%, #A78BFA 50%, #7C3AED 100%)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        <div className="bg-white/95 backdrop-blur-lg rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
          <div className="flex items-center justify-around h-14">
            {tabs.map((tab) => {
              if (tab.id === 'analysis') {
                return <div key={tab.id} className="w-16" />;
              }
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'bg-heka-purple/10' : ''
                  }`}
                >
                  {tab.icon(isActive)}
                  <span className={`text-[10px] font-medium ${isActive ? 'text-heka-purple' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
