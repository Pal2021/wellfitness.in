import { colors } from '../theme';

const variantMap = {
  amber:  { bg: colors.AMBER_DIM, color: colors.AMBER, border: colors.AMBER_GLOW },
  green:  { bg: colors.GREEN_DIM, color: colors.GREEN, border: '#34D39922' },
  blue:   { bg: colors.BLUE_DIM, color: colors.BLUE, border: '#60A5FA22' },
  red:    { bg: colors.RED_DIM, color: colors.RED, border: '#F8717133' },
  purple: { bg: colors.PURPLE_DIM, color: colors.PURPLE, border: '#A78BFA22' },
  gold:   { bg: colors.GOLD_DIM, color: colors.GOLD, border: '#F5C84222' },
};

export default function Badge({ label, variant = 'amber', style }) {
  const v = variantMap[variant] || variantMap.amber;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: v.bg, color: v.color, border: `0.5px solid ${v.border}`,
      fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
      letterSpacing: 0.2, whiteSpace: 'nowrap',
      animation: variant === 'red' ? 'blink 1s infinite' : 'none', ...style,
    }}>
      {label}
    </span>
  );
}
