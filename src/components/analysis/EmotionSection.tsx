import { useState } from 'react';
import { mockEmotionData, mockWeeklyEmotion } from '../../mock/data';

type Range = 'day' | 'week' | 'month';

export default function EmotionSection() {
  const [range, setRange] = useState<Range>('day');

  const todayData = mockEmotionData.hourly;
  const weeklyAvgs = mockWeeklyEmotion.map((d) => ({
    date: d.date,
    avg: Math.round(d.hourly.reduce((s, h) => s + h.score, 0) / d.hourly.length),
  }));

  const chartData = range === 'day' ? todayData.map((d) => d.score) : weeklyAvgs.map((d) => d.avg);
  const chartLabels = range === 'day' ? todayData.map((d) => `${d.hour}:00`) : weeklyAvgs.map((d) => d.date);

  const currentAvg = range === 'day'
    ? Math.round(todayData.reduce((s, d) => s + d.score, 0) / todayData.length)
    : Math.round(weeklyAvgs.reduce((s, d) => s + d.avg, 0) / weeklyAvgs.length);

  const emotionLabel = currentAvg >= 70 ? '開心' : currentAvg >= 50 ? '平靜' : '低落';
  const emotionColor = currentAvg >= 70 ? '#10B981' : currentAvg >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-heka-text">Emotional Curve</h3>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                range === r ? 'bg-white text-heka-purple shadow-sm' : 'text-gray-400'
              }`}
            >
              {{ day: '1日', week: '7日', month: '30日' }[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColor }} />
        <span className="text-sm font-medium" style={{ color: emotionColor }}>{emotionLabel}</span>
        <span className="text-xs text-heka-text-secondary">平均 {currentAvg} 分</span>
      </div>

      {/* Chart */}
      <EmotionChart data={chartData} labels={chartLabels} color={emotionColor} />
    </div>
  );
}

function EmotionChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const w = 310;
  const h = 100;
  const pad = { top: 10, right: 10, bottom: 22, left: 32 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const min = 30;
  const max = 100;

  const pts = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * cw,
    y: pad.top + ch - ((v - min) / (max - min)) * ch,
    v,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cx1 = prev.x + (p.x - prev.x) * 0.4;
    const cx2 = p.x - (p.x - prev.x) * 0.4;
    return `${acc} C ${cx1},${prev.y} ${cx2},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${pts[pts.length - 1].x},${h - pad.bottom} L ${pts[0].x},${h - pad.bottom} Z`;

  const yTicks = [100, 70, 40];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      {yTicks.map((v) => {
        const y = pad.top + ch - ((v - min) / (max - min)) * ch;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#F3F4F6" strokeWidth={0.8} />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" fontSize={8} fill="#9CA3AF">{v}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="ec-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#ec-grad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} stroke="white" strokeWidth={2} />
      ))}
      {labels.filter((_, i) => data.length <= 8 || i % 2 === 0).map((l, idx) => {
        const realIdx = data.length <= 8 ? idx : idx * 2;
        if (realIdx >= pts.length) return null;
        return (
          <text key={l} x={pts[realIdx].x} y={h - 4} textAnchor="middle" fontSize={8} fill="#9CA3AF">{l}</text>
        );
      })}
    </svg>
  );
}
