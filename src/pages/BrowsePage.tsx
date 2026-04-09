import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import PhotoAlbum from '../components/browse/PhotoAlbum';
import SensorStatus from '../components/browse/SensorStatus';
import VitalSigns from '../components/browse/VitalSigns';
import AccountSettings from '../components/browse/AccountSettings';

type SubPage = null | 'album' | 'sensor' | 'vitals' | 'account';

const menuItems: { id: SubPage & string; label: string; icon: React.ReactNode }[] = [
  {
    id: 'album',
    label: '相簿',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'sensor',
    label: '感測器',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'vitals',
    label: '血壓機',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function BrowsePage() {
  const [subPage, setSubPage] = useState<SubPage>(null);

  if (subPage === 'album') return <div className="min-h-screen pb-24 pt-[env(safe-area-inset-top,12px)] px-4"><PhotoAlbum onBack={() => setSubPage(null)} /></div>;
  if (subPage === 'sensor') return <div className="min-h-screen pb-24 pt-[env(safe-area-inset-top,12px)] px-4"><SensorStatus onBack={() => setSubPage(null)} /></div>;
  if (subPage === 'vitals') return <div className="min-h-screen pb-24 pt-[env(safe-area-inset-top,12px)] px-4"><VitalSigns onBack={() => setSubPage(null)} /></div>;
  if (subPage === 'account') return <div className="min-h-screen pb-24 pt-[env(safe-area-inset-top,12px)] px-4"><AccountSettings onBack={() => setSubPage(null)} /></div>;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        }
        title="瀏覽"
        rightAction={
          <button onClick={() => setSubPage('account')} className="w-9 h-9 rounded-full bg-heka-purple flex items-center justify-center cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        }
      />

      {/* Menu items */}
      <div className="px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSubPage(item.id as SubPage)}
            className="w-full flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-sm border border-white/60 cursor-pointer hover:bg-white transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-heka-purple/10 flex items-center justify-center shrink-0">
              {item.icon}
            </span>
            <span className="text-sm font-medium text-heka-text">{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
