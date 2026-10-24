import { climberIcon, shoeIcon } from '@crux/design-system';

export function ProgressChart({ series, range, individual = false, name = 'Crew' }) {
  const buckets = range === 'week' ? 7 : 4;
  const labels = Array.from({ length: buckets }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (buckets === 7 ? 6 - i : (3 - i) * 7 + 6));
    return buckets === 7 ? date.toLocaleDateString('en-US', { weekday: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const max = Math.max(3, ...series.flatMap((item) => item.values));
  const width = 600;
  const height = 165;
  const left = 30;
  const right = 10;
  const top = 28;
  const base = height - 25;
  const gap = (width - left - right) / buckets;
  const y = (value) => base - value / max * (base - top);

  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${name} progress by problem set date`}>
    {[0, 1, 2, 3].map((i) => {
      const value = Math.ceil(max / 3) * i;
      return <g key={i}><line x1={left} y1={y(value)} x2={width - right} y2={y(value)} stroke="#e9e3e9"/><text x={left - 7} y={y(value) + 3} textAnchor="end" fill="#928993" fontSize="9">{value}</text></g>;
    })}
    {series.map((item) => {
      const points = item.values.map((value, i) => [left + i * gap + gap / 2, y(value)]);
      const line = points.map(([x, pointY], i) => `${i ? 'L' : 'M'} ${x} ${pointY}`).join(' ');
      const area = `${line} L ${points.at(-1)[0]} ${base} L ${points[0][0]} ${base} Z`;
      const latest = item.values.map((value, i) => value ? i : -1).filter((i) => i >= 0).at(-1);
      return <g key={item.id}>
        <path d={area} fill={item.color} opacity={individual ? '.15' : '.11'}/>
        <path d={line} fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {points.map(([x, pointY], i) => item.values[i] > 0 ? <circle key={i} cx={x} cy={pointY} r="3.4" fill={item.color} stroke="#fffefa" strokeWidth="1.5"><title>{labels[i]}: {item.values[i]} sends</title></circle> : null)}
        {individual && latest != null && <svg x={points[latest][0] - 11} y={Math.max(0, points[latest][1] - 28)} width="23" height="27" viewBox="0 0 160 180" dangerouslySetInnerHTML={{ __html: climberIcon(item.color, item.name).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') }}/>}
        {!individual && latest != null && <svg x={points[latest][0] - 20} y={Math.max(0, points[latest][1] - 30)} width="40" height="27" viewBox="0 0 80 52" dangerouslySetInnerHTML={{ __html: shoeIcon(item.color, item.name).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') }}/>}
      </g>;
    })}
    {labels.map((label, i) => <text key={`${label}-${i}`} x={left + i * gap + gap / 2} y={height - 4} textAnchor="middle" fill="#817b84" fontSize="9">{label}</text>)}
  </svg>;
}
