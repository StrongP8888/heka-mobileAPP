interface EmotionPoint {
  hour: number;
  score: number;
  label: 'happy' | 'neutral' | 'sad';
}

interface EmotionCurveProps {
  data: EmotionPoint[];
}

const emotionColor = {
  happy: '#10B981',
  neutral: '#F59E0B',
  sad: '#EF4444',
};

export default function EmotionCurve({ data }: EmotionCurveProps) {
  const width = 280;
  const height = 80;
  const padding = { top: 8, right: 12, bottom: 20, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minScore = 40;
  const maxScore = 100;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.score - minScore) / (maxScore - minScore)) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) * 0.4;
    const cpx2 = p.x - (p.x - prev.x) * 0.4;
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

  const yLabels = [100, 70, 40];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Grid lines */}
      {yLabels.map((val) => {
        const y = padding.top + chartH - ((val - minScore) / (maxScore - minScore)) * chartH;
        return (
          <g key={val}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeWidth={0.5} strokeDasharray="3,3" />
            <text x={padding.left - 4} y={y + 3} textAnchor="end" fontSize={8} fill="#9CA3AF">{val}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <defs>
        <linearGradient id="emotionGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#emotionGrad)" />
      <path d={pathD} fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={emotionColor[p.label]} stroke="white" strokeWidth={1.5} />
      ))}

      {/* X-axis labels */}
      {points.filter((_, i) => i % 2 === 0).map((p) => (
        <text key={p.hour} x={p.x} y={height - 4} textAnchor="middle" fontSize={8} fill="#9CA3AF">
          {p.hour}:00
        </text>
      ))}
    </svg>
  );
}
