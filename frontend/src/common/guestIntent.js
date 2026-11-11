const KEY = 'wellfitness_guest_action';

const ROUTES = {
  workout: '/workout/log',
  food: '/diet',
  coach: '/ai-coach',
  split: '/splits',
  profile: '/profile',
};

export function saveGuestAction(action, question = '') {
  if (!ROUTES[action]) return;
  sessionStorage.setItem(KEY, JSON.stringify({ action, question: action === 'coach' ? question.slice(0, 1000) : '' }));
}

export function takeGuestAction() {
  const stored = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  if (!stored) return { path: '/dashboard' };
  try {
    const { action, question } = JSON.parse(stored);
    if (!ROUTES[action]) return { path: '/dashboard' };
    return { path: ROUTES[action], state: { guestAction: action, question: action === 'coach' && typeof question === 'string' ? question.slice(0, 1000) : '' } };
  } catch {
    return { path: '/dashboard' };
  }
}

export function finishAuthentication(navigate, user) {
  if (user.onboardingComplete === false) {
    navigate('/onboarding', { replace: true });
    return;
  }
  const { path, state } = takeGuestAction();
  navigate(path, { replace: true, state });
}
