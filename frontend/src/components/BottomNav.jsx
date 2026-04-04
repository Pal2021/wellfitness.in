import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../theme';

const TABS = [
  { path: '/',          emoji: '🏠', label: 'Home' },
  { path: '/workout',   emoji: '💪', label: 'Workout' },
  { path: '/split',     emoji: '📋', label: 'My Split' },
  { path: '/exercises', emoji: '📚', label: 'Exercises' },
  { path: '/profile',   emoji: '👤', label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 64, background: colors.BG_PRIMARY,
      borderTop: `0.5px solid ${colors.BORDER_DEFAULT}`,
      display: 'flex', alignItems: 'center',
      padding: '4px 8px 10px', zIndex: 100, maxWidth: 430, margin: '0 auto',
    }}>
      {TABS.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <div key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, cursor: 'pointer', padding: '6px 0 2px', borderRadius: 12,
            background: active ? colors.AMBER_DIM : 'transparent',
            transition: 'all 0.2s ease',
          }}>
            <span style={{
              fontSize: 20,
              filter: active ? 'none' : 'grayscale(1)',
              opacity: active ? 1 : 0.35,
              transform: active ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}>{tab.emoji}</span>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: active ? colors.AMBER : colors.TEXT_TERTIARY,
              letterSpacing: 0.3,
            }}>{tab.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
