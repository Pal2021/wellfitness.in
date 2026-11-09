import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Cpu, BarChart2, User, Dumbbell,
  LayoutList, BookOpen, Clock, Utensils, Zap,
  ChevronLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',       icon: Home,      path: '/dashboard' },
  { id: 'workout',   label: 'Workout',    icon: Dumbbell,  path: '/workout' },
  { id: 'splits',    label: 'My Split',   icon: LayoutList, path: '/splits' },
  { id: 'exercises', label: 'Exercises',  icon: BookOpen,  path: '/exercises' },
  { id: 'history',   label: 'History',    icon: Clock,     path: '/workout/history' },
  { id: 'progress',  label: 'Progress',   icon: BarChart2, path: '/progress' },
  { id: 'ai',        label: 'AI Coach',   icon: Cpu,       path: '/ai-coach' },
  { id: 'diet',      label: 'Diet',       icon: Utensils,  path: '/diet' },
  { id: 'profile',   label: 'Profile',    icon: User,      path: '/profile' },
];

export default function SideNav({ isCollapsed, onToggle }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeItemId = pathname === '/'
    ? 'home'
    : NAV_ITEMS
        .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
        .sort((a, b) => b.path.length - a.path.length)[0]?.id;

  return (
    <aside
      style={{
        width: isCollapsed ? '0px' : '240px',
        minHeight: '100vh',
        background: '#0a0a0a',
        borderRight: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '240px',
          opacity: isCollapsed ? 0 : 1,
          pointerEvents: isCollapsed ? 'none' : 'auto',
          transition: 'opacity 200ms ease',
        }}
      >
        {/* Logo & Toggle */}
        <div style={{ padding: '0 24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={20} color="black" fill="black" />
            </div>
            <span style={{
              fontSize: '18px', fontWeight: '800', color: '#f59e0b',
              fontStyle: 'italic', letterSpacing: '-0.02em',
            }}>
              WellFitness
            </span>
          </div>

          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItemId;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Active indicator bar */}
              <div style={{
                width: '3px', height: '20px', borderRadius: '2px',
                background: isActive ? '#f59e0b' : 'transparent',
                flexShrink: 0,
                marginLeft: '-2px',
                transition: 'all 200ms ease',
              }} />
              <Icon
                size={19}
                color={isActive ? '#f59e0b' : '#6b7280'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span style={{
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : '#6b7280',
                letterSpacing: isActive ? '-0.01em' : '0',
                transition: 'all 200ms ease',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 24px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: '8px',
      }}>
        <p style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.5' }}>
          WellFitness v1.0
        </p>
      </div>
      </div>
    </aside>
  );
}
