import { colors } from '../theme';
export default function Divider({ style }) {
  return <div style={{ height: 0.5, background: colors.BORDER_DEFAULT, margin: '9px 0', ...style }} />;
}
