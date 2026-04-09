import { useState } from 'react';
import { mockGameScores, mockCasiRadar } from '../../mock/data';

const gameColors = ['#7C3AED', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899'];

export default function GameScoresSection() {
  const [selectedGame, setSelectedGame] = useState(0);

  return (
    <div className="space-y-4">
      {/* CASI Radar */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <h3 className="text-sm font-semibold text-heka-text mb-3">CASI 認知維度</h3>
        <CasiRadar data={mockCasiRadar} />
        <div className="grid grid-cols-3 gap-2 mt-3">
          {mockCasiRadar.map((d) => (
            <div key={d.dimension} className="text-center">
              <p className="text-[10px] text-heka-text-secondary">{d.dimension}</p>
              <p className="text-sm font-bold text-heka-purple">{d.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Game score trends */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
        <h3 className="text-sm font-semibold text-heka-text mb-3">遊戲成績趨勢</h3>

        {/* Game tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {mockGameScores.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setSelectedGame(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedGame === i
                  ? 'text-white'
                  : 'bg-gray-100 text-heka-text-secondary'
              }`}
              style={selectedGame === i ? { backgroundColor: gameColors[i] } : undefined}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Score chart */}
        <GameTrendChart
          scores={mockGameScores[selectedGame].scores}
          color={gameColors[selectedGame]}
        />

        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs text-heka-text-secondary">
            {mockGameScores[selectedGame].casiDimension}
          </span>
          <span className="text-xs font-medium" style={{ color: gameColors[selectedGame] }}>
            最新 {mockGameScores[selectedGame].scores[mockGameScores[selectedGame].scores.length - 1].score} 分
          </span>
        </div>
      </div>
    </div>
  );
}

function CasiRadar({ data }: { data: { dimension: string; score: number; fullMark: number }[] }) {
  const cx = 120;
  const cy = 100;
  const r = 70;
  const n = data.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const ratio = value / 100;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const gridPaths = levels.map((lv) => {
    const pts = Array.from({ length: n }, (_, i) => getPoint(i, lv * 100));
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  });

  const dataPts = data.map((d, i) => getPoint(i, d.score));
  const dataPath = dataPts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg width="100%" viewBox="0 0 240 200" className="overflow-visible">
      {/* Grid */}
      {gridPaths.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth={0.8} />
      ))}
      {/* Axes */}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <polygon points={dataPath} fill="rgba(124,58,237,0.15)" stroke="#7C3AED" strokeWidth={2} />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#7C3AED" stroke="white" strokeWidth={2} />
      ))}
      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, 120);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#6B7280">
            {d.dimension}
          </text>
        );
      })}
    </svg>
  );
}

function GameTrendChart({ scores, color }: { scores: { date: string; score: number }[]; color: string }) {
  const w = 290;
  const h = 90;
  const pad = { top: 10, right: 8, bottom: 20, left: 30 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const vals = scores.map((s) => s.score);
  const min = Math.max(0, Math.min(...vals) - 10);
  const max = Math.min(100, Math.max(...vals) + 10);

  const pts = scores.map((s, i) => ({
    x: pad.left + (i / (scores.length - 1)) * cw,
    y: pad.top + ch - ((s.score - min) / (max - min)) * ch,
    ...s,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cx1 = prev.x + (p.x - prev.x) * 0.4;
    const cx2 = p.x - (p.x - prev.x) * 0.4;
    return `${acc} C ${cx1},${prev.y} ${cx2},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${pts[pts.length - 1].x},${h - pad.bottom} L ${pts[0].x},${h - pad.bottom} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`gg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {[min, Math.round((min + max) / 2), max].map((v) => {
        const y = pad.top + ch - ((v - min) / (max - min)) * ch;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#F3F4F6" strokeWidth={0.8} />
            <text x={pad.left - 4} y={y + 3} textAnchor="end" fontSize={8} fill="#9CA3AF">{v}</text>
          </g>
        );
      })}
      <path d={areaD} fill={`url(#gg-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={color} stroke="white" strokeWidth={2} />
          <text x={p.x} y={h - 4} textAnchor="middle" fontSize={7} fill="#9CA3AF">{p.date}</text>
        </g>
      ))}
    </svg>
  );
}
