import { colors } from '../theme';

export default function VolumeBars({ data = [0,0,0,0,0,0,0] }) {
  const max = Math.max(...data, 1);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: 56, gap: 5, marginTop: 8 }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            height: val > 0 ? Math.max((val / max) * 44, 4) : 4,
            background: val > 0 ? colors.AMBER : colors.BG_QUATERNARY,
            opacity: val > 0 ? Math.max(val / max, 0.3) : 1,
            transition: 'height 0.4s ease',
          }} />
          <div style={{ fontSize: 9, color: colors.TEXT_TERTIARY, fontWeight: 700, marginTop: 3 }}>{days[i]}</div>
        </div>
      ))}
    </div>
  );
}
