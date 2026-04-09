import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

interface Props {
  onBack: () => void;
}

export default function InstallGuide({ onBack }: Props) {
  const [platform, setPlatform] = useState<Platform>('ios');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top,12px)] px-4">
        <div className="flex items-center py-3">
          <button onClick={onBack} className="text-heka-purple cursor-pointer flex items-center gap-1 text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回
          </button>
          <h1 className="text-base font-semibold text-heka-text absolute left-1/2 -translate-x-1/2">安裝到主畫面</h1>
        </div>
      </header>

      <div className="px-4 space-y-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-heka-purple/10 to-heka-purple/5 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl">
            🐧
          </div>
          <h2 className="text-base font-bold text-heka-text mb-1">HEKA 智慧照護</h2>
          <p className="text-xs text-heka-text-secondary">安裝後像原生 APP 一樣，全螢幕快速開啟</p>
        </div>

        {/* Platform tabs */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1">
          {(['ios', 'android'] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                platform === p ? 'bg-white text-heka-purple shadow-sm' : 'text-heka-text-secondary'
              }`}
            >
              {p === 'ios' ? ' iPhone / iPad' : ' Android'}
            </button>
          ))}
        </div>

        {/* Steps */}
        {platform === 'ios' ? (
          <div className="space-y-3">
            <StepCard
              num={1}
              title="用 Safari 開啟本頁面"
              description="確認是使用 Safari 瀏覽器（不是 Chrome 或 LINE 內建瀏覽器）"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
            />
            <StepCard
              num={2}
              title="點擊底部「分享」按鈕"
              description="螢幕最下方中間的方形 + 箭頭圖示"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              }
            />
            <StepCard
              num={3}
              title="選擇「加入主畫面」"
              description="往下滑動找到「加入主畫面」選項，點擊它"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              }
            />
            <StepCard
              num={4}
              title="點擊右上角「新增」"
              description="確認名稱後點擊新增，HEKA 圖示就會出現在你的主畫面！"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            <StepCard
              num={1}
              title="用 Chrome 開啟本頁面"
              description="確認是使用 Chrome 瀏覽器"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="21.17" y1="8" x2="12" y2="8" />
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                </svg>
              }
            />
            <StepCard
              num={2}
              title="點擊右上角「⋮」選單"
              description="瀏覽器右上角的三個點"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="5" r="1.5" fill="#6B7280" /><circle cx="12" cy="12" r="1.5" fill="#6B7280" /><circle cx="12" cy="19" r="1.5" fill="#6B7280" />
                </svg>
              }
            />
            <StepCard
              num={3}
              title="選擇「安裝應用程式」"
              description="或「加到主畫面」，視 Chrome 版本而定"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            />
            <StepCard
              num={4}
              title="點擊「安裝」"
              description="HEKA 圖示就會出現在你的主畫面！"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
          </div>
        )}

        {/* Tips */}
        <div className="bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
          <div className="flex items-start gap-2">
            <span className="text-sm mt-0.5">💡</span>
            <div className="text-xs text-amber-800 leading-relaxed space-y-1">
              <p className="font-medium">小提示</p>
              {platform === 'ios' ? (
                <>
                  <p>• 必須使用 Safari，從 LINE 或其他 APP 內開啟的網頁無法安裝</p>
                  <p>• 如果在 LINE 中開啟，請點右下角「⋯」→「在 Safari 中開啟」</p>
                </>
              ) : (
                <>
                  <p>• 建議使用 Chrome 瀏覽器</p>
                  <p>• 如果在 LINE 中開啟，請點右上角「⋯」→「在瀏覽器中開啟」</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ num, title, description, icon }: {
  num: number; title: string; description: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-4 shadow-sm border border-white/60 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-heka-purple text-white flex items-center justify-center text-sm font-bold shrink-0">
        {num}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-heka-text mb-0.5">{title}</p>
        <p className="text-xs text-heka-text-secondary leading-relaxed">{description}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  );
}
