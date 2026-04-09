import { useState, useRef } from 'react';

type MediaType = 'photo' | 'video';

interface MediaItem {
  id: string;
  type: MediaType;
  url: string;          // objectURL or placeholder color
  thumbnail?: string;   // for video: captured poster frame
  fileName: string;
  uploadedBy: string;
  date: string;
  isPlaceholder?: boolean;
}

interface Album {
  id: string;
  name: string;
  coverUrl?: string;
  coverColor: string;
  items: MediaItem[];
}

// Seed some placeholder items
function makePlaceholders(): MediaItem[] {
  const colors = [
    '#F9A8D4', '#A78BFA', '#6EE7B7', '#FDE68A', '#93C5FD', '#FCA5A5',
    '#C4B5FD', '#99F6E4', '#FDBA74', '#86EFAC', '#D8B4FE', '#FDA4AF',
  ];
  return colors.map((c, i) => ({
    id: `placeholder-${i}`,
    type: 'photo',
    url: c,
    fileName: `photo_${i + 1}.jpg`,
    uploadedBy: ['女兒', '兒子', '照服員 小陳'][i % 3],
    date: `2026/04/${String(9 - Math.floor(i / 4)).padStart(2, '0')}`,
    isPlaceholder: true,
  }));
}

const initialAlbums: Album[] = [
  { id: 'a1', name: '全家福', coverColor: '#E9D5FF', items: [] },
  { id: 'a2', name: '日常生活', coverColor: '#CCFBF1', items: [] },
  { id: 'a3', name: '節日回憶', coverColor: '#FDE68A', items: [] },
];

interface Props {
  onBack: () => void;
}

export default function PhotoAlbum({ onBack }: Props) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [allMedia, setAllMedia] = useState<MediaItem[]>(makePlaceholders);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  // Hidden file inputs
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraPhotoRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLInputElement>(null);

  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: MediaItem[] = [];

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      const item: MediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: isVideo ? 'video' : 'photo',
        url,
        fileName: file.name,
        uploadedBy: '我',
        date: now(),
      };

      // For video, generate a thumbnail from the first frame
      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        video.onloadeddata = () => {
          video.currentTime = 0.5;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0);
          item.thumbnail = canvas.toDataURL('image/jpeg', 0.6);
          setAllMedia((prev) => [...prev]); // trigger re-render
        };
      }

      newItems.push(item);

      // If an album is selected, also add to that album
      if (selectedAlbum) {
        setAlbums((prev) =>
          prev.map((a) =>
            a.id === selectedAlbum
              ? { ...a, items: [item, ...a.items], coverUrl: !isVideo ? url : a.coverUrl }
              : a
          )
        );
      }
    });

    setAllMedia((prev) => [...newItems, ...prev]);
    setShowUploadMenu(false);
  };

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return;
    const colors = ['#FECACA', '#BBF7D0', '#BFDBFE', '#FDE68A', '#DDD6FE', '#FBCFE8'];
    setAlbums((prev) => [
      ...prev,
      {
        id: `album-${Date.now()}`,
        name: newAlbumName.trim(),
        coverColor: colors[prev.length % colors.length],
        items: [],
      },
    ]);
    setNewAlbumName('');
    setShowNewAlbum(false);
  };

  const displayMedia = selectedAlbum
    ? albums.find((a) => a.id === selectedAlbum)?.items ?? []
    : allMedia;

  return (
    <div className="relative">
      {/* Hidden file inputs — different accept/capture combos for iOS/Android */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraPhotoRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraVideoRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-heka-purple cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-heka-text">
          {selectedAlbum ? albums.find((a) => a.id === selectedAlbum)?.name ?? '相簿' : '相簿'}
        </h2>
        {selectedAlbum && (
          <button
            onClick={() => setSelectedAlbum(null)}
            className="text-xs text-heka-purple cursor-pointer"
          >
            全部
          </button>
        )}
        <button
          onClick={() => setShowUploadMenu(true)}
          className="ml-auto w-8 h-8 rounded-full bg-heka-purple flex items-center justify-center cursor-pointer hover:bg-heka-purple-dark transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Albums row */}
      {!selectedAlbum && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-heka-text-secondary">相簿</h3>
            <button
              onClick={() => setShowNewAlbum(true)}
              className="text-xs text-heka-purple font-medium cursor-pointer"
            >
              + 新增相簿
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album.id)}
                className="shrink-0 w-20 cursor-pointer transition-all hover:scale-95"
              >
                <div
                  className="w-20 h-20 rounded-xl mb-1 shadow-sm border border-white/60 overflow-hidden"
                  style={{ backgroundColor: album.coverColor }}
                >
                  {album.coverUrl ? (
                    <img src={album.coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : album.items.length > 0 && !album.items[0].isPlaceholder ? (
                    <img src={album.items[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-heka-text truncate text-center">{album.name}</p>
                <p className="text-[9px] text-gray-400 text-center">{album.items.length} 項</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-heka-text-secondary">
            照片與影片
            <span className="text-gray-400 font-normal ml-1">({displayMedia.length})</span>
          </h3>
        </div>

        {displayMedia.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-xs text-heka-text-secondary">這個相簿還沒有內容</p>
            <button
              onClick={() => setShowUploadMenu(true)}
              className="mt-2 text-xs text-heka-purple font-medium cursor-pointer"
            >
              新增照片或影片
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {displayMedia.map((item) => (
              <button
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="aspect-square rounded-xl relative overflow-hidden group cursor-pointer"
                style={item.isPlaceholder ? { backgroundColor: item.url } : undefined}
              >
                {/* Real image */}
                {!item.isPlaceholder && item.type === 'photo' && (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}

                {/* Real video thumbnail */}
                {!item.isPlaceholder && item.type === 'video' && (
                  <>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" opacity={0.5}>
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </>
                )}

                {/* Video badge */}
                {item.type === 'video' && (
                  <div className="absolute top-1.5 right-1.5 bg-black/50 rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="text-[8px] text-white font-medium">影片</span>
                  </div>
                )}

                {/* Placeholder icon */}
                {item.isPlaceholder && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.4}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}

                {/* Hover info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div>
                    <p className="text-[9px] text-white/90 font-medium">{item.uploadedBy}</p>
                    <p className="text-[8px] text-white/70">{item.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== Upload action sheet ===== */}
      {showUploadMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowUploadMenu(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[430px] bg-white rounded-t-3xl pb-[env(safe-area-inset-bottom,16px)] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mt-3 mb-4" />

            <div className="px-4 pb-2">
              <h3 className="text-sm font-semibold text-heka-text mb-4 text-center">新增照片或影片</h3>

              <div className="space-y-1">
                <ActionButton
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  }
                  label="拍照"
                  sublabel="使用相機拍攝照片"
                  onClick={() => cameraPhotoRef.current?.click()}
                />
                <ActionButton
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  }
                  label="錄影"
                  sublabel="使用相機錄製影片"
                  onClick={() => cameraVideoRef.current?.click()}
                />
                <ActionButton
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  }
                  label="從相簿選取"
                  sublabel="選擇手機裡的照片或影片"
                  onClick={() => galleryRef.current?.click()}
                />
              </div>

              <button
                onClick={() => setShowUploadMenu(false)}
                className="w-full mt-3 py-3 rounded-2xl bg-gray-100 text-sm font-medium text-heka-text-secondary cursor-pointer hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Full preview modal ===== */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={() => setPreviewItem(null)}>
          {/* Close button */}
          <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top,12px)] py-3">
            <button className="text-white/80 cursor-pointer" onClick={() => setPreviewItem(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-xs text-white/60">{previewItem.uploadedBy}</p>
              <p className="text-[10px] text-white/40">{previewItem.date}</p>
            </div>
            <div className="w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            {previewItem.isPlaceholder ? (
              <div
                className="w-64 h-64 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: previewItem.url }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity={0.3}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            ) : previewItem.type === 'photo' ? (
              <img
                src={previewItem.url}
                alt=""
                className="max-w-full max-h-[70vh] rounded-lg object-contain"
              />
            ) : (
              <video
                src={previewItem.url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[70vh] rounded-lg"
              />
            )}
          </div>

          {/* File name */}
          <div className="text-center pb-[env(safe-area-inset-bottom,16px)] py-3">
            <p className="text-xs text-white/40">{previewItem.fileName}</p>
          </div>
        </div>
      )}

      {/* ===== New album modal ===== */}
      {showNewAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-8 shadow-xl max-w-[300px] w-full">
            <h3 className="text-sm font-semibold text-heka-text text-center mb-4">新增相簿</h3>
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="相簿名稱"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm text-heka-text outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-heka-purple/20 mb-4"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAlbum(); }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowNewAlbum(false); setNewAlbumName(''); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-heka-text cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleCreateAlbum}
                disabled={!newAlbumName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-heka-purple text-sm font-medium text-white cursor-pointer disabled:opacity-40"
              >
                建立
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon, label, sublabel, onClick }: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full bg-heka-purple/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-heka-text">{label}</p>
        <p className="text-[10px] text-heka-text-secondary">{sublabel}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
