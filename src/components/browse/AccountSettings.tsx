import { useState } from 'react';

interface Props {
  onBack: () => void;
}

export default function AccountSettings({ onBack }: Props) {
  const [language, setLanguage] = useState('繁體中文');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-heka-purple cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-heka-text">帳號設定</h2>
      </div>

      <div className="space-y-3">
        {/* Profile card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-heka-purple/30 to-heka-purple/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-heka-text">王小明</p>
              <p className="text-xs text-heka-text-secondary">女兒 ・ 主要照顧者</p>
              <p className="text-[10px] text-gray-400 mt-0.5">xiaoming.wang@email.com</p>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-heka-text">語言</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-right text-sm text-heka-purple font-medium bg-transparent appearance-none cursor-pointer pr-5 outline-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237C3AED' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
              }}
            >
              <option value="繁體中文">繁體中文</option>
              <option value="English">English</option>
              <option value="日本語">日本語</option>
            </select>
          </div>
        </div>

        {/* Linked elder */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="px-4 py-3.5">
            <p className="text-xs text-heka-text-secondary mb-2">連結的長輩</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-heka-purple/10 flex items-center justify-center text-sm">
                🐧
              </div>
              <div>
                <p className="text-sm font-medium text-heka-text">王奶奶</p>
                <p className="text-[10px] text-heka-text-secondary">裝置 ID: HEKA-2026-001</p>
              </div>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-500">在線</span>
              </span>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <span className="text-sm text-heka-text">版本</span>
            <span className="text-sm text-heka-text-secondary">WebApp v1.0.0</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-heka-text">關於 HEKA</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          登出
        </button>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-8 shadow-xl max-w-[300px] w-full">
            <p className="text-sm font-semibold text-heka-text text-center mb-2">確定要登出嗎？</p>
            <p className="text-xs text-heka-text-secondary text-center mb-5">登出後需要重新登入才能查看長輩資料</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-heka-text cursor-pointer hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white cursor-pointer hover:bg-red-600 transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
