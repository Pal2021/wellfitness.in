import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Cpu, Utensils, User } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/workout' },
  { id: 'ai', label: 'AI Coach', icon: Cpu, path: '/ai-coach' },
  { id: 'diet', label: 'Diet', icon: Utensils, path: '/diet' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav aria-label="Primary mobile navigation" className="pointer-events-none fixed bottom-0 left-0 right-0 z-[100] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div
        className="pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-[28px] border px-1 py-2 shadow-2xl backdrop-blur-xl"
        style={{ 
          background: 'var(--color-bg-secondary)', 
          borderColor: 'var(--color-border)',
          boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path
            || (item.id === 'workout' && ['/workout/', '/splits', '/exercises', '/progress'].some((path) => pathname.startsWith(path)))
            || (pathname === '/' && item.path === '/dashboard');
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              aria-current={pathname === item.path || (pathname === '/' && item.id === 'home') ? 'page' : undefined}
              className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl transition active:scale-95 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <span
                className={`flex h-9 w-11 items-center justify-center rounded-2xl transition ${
                  isActive ? 'bg-amber-500 shadow-[0_4px_16px_rgba(245,158,11,0.3)]' : ''
                }`}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-black' : 'text-gray-500 dark:text-gray-400'}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`text-[10px] font-bold leading-tight transition ${
                  isActive ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

