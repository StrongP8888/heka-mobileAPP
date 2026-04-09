import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'standalone' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone);
  if (isStandalone) return 'standalone';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

const STORAGE_KEY = 'heka-install-banner-dismissed';

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const p = detectPlatform();
    setPlatform(p);
    if (!dismissed && p !== 'standalone' && p !== 'desktop') {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mx-4 mb-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-heka-purple/15 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-heka-purple/20 to-heka-purple/5 flex items-center justify-center text-lg shrink-0">
          🐧
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-heka-text">安裝 HEKA 到主畫面</p>
          <p className="text-[10px] text-heka-text-secondary">像原生 APP 一樣快速開啟</p>
        </div>
        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Steps */}
      <div className="px-4 pb-4">
        {platform === 'ios' ? (
          <div className="space-y-2.5 mt-1">
            <Step num={1} icon={<ShareIcon />} text="點擊 Safari 底部的「分享」按鈕" />
            <Step num={2} icon={<PlusSquareIcon />} text="往下滑，點擊「加入主畫面」" />
            <Step num={3} icon={<CheckIcon />} text="點擊右上角「新增」，完成！" />
          </div>
        ) : (
          <div className="space-y-2.5 mt-1">
            <Step num={1} icon={<DotsIcon />} text="點擊瀏覽器右上角「⋮」選單" />
            <Step num={2} icon={<PlusSquareIcon />} text="選擇「安裝應用程式」或「加到主畫面」" />
            <Step num={3} icon={<CheckIcon />} text="點擊「安裝」，完成！" />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 bg-heka-purple/5 rounded-xl px-3 py-2">
          <span className="text-xs">💡</span>
          <p className="text-[10px] text-heka-text-secondary leading-relaxed">
            安裝後可以全螢幕使用，不用每次打開瀏覽器找網址
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({ num, icon, text }: { num: number; icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-heka-purple/10 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-heka-purple">{num}</span>
      </div>
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-xs text-heka-text">{text}</p>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );
}
