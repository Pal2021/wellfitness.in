import { colors } from '../theme';

export default function AppCard({ children, style, onClick }) {
  const Wrapper = onClick ? 'div' : 'div';
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
        borderRadius: 16, padding: 14, marginBottom: 10, cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity 0.15s', ...style,
      }}
    >
      {children}
    </div>
  );
}
