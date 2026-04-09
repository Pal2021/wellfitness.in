import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../common/context/AuthContext';
import AppCard from '../../../common/components/AppCard';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';
import api from '../../../services/api';

const PHASES = [
  { num: 1, emoji: '🏋️', name: 'Workout Tracker', /* tier: 'FREE', tierColor: colors.GREEN, */ desc: 'Log workouts, track progress, manage splits', badge: 'ACTIVE', badgeBg: colors.GREEN_DIM, badgeColor: colors.GREEN, path: '/phase/1' },
  { num: 2, emoji: '⚡', name: 'Advanced Workout', /* tier: 'PRO · ₹299/mo', tierColor: colors.AMBER, */ desc: 'Templates, analytics, supersets, RPE tracking', badge: 'COMING SOON', path: '/phase/2' },
  { num: 3, emoji: '🥗', name: 'Diet & Nutrition', /* tier: 'PRO · ₹299/mo', tierColor: colors.AMBER, */ desc: 'Indian food database, macro tracking, calorie ring', badge: 'COMING SOON', path: '/phase/3' },
  { num: 4, emoji: '🤖', name: 'AI Coach', /* tier: 'PRO / ELITE', tierColor: colors.PURPLE, */ desc: 'Gemini-powered training & diet advisor', badge: 'COMING SOON', path: '/phase/4' },
  { num: 5, emoji: '📈', name: 'Progress Tracking', /* tier: 'PRO · ₹299/mo', tierColor: colors.BLUE, */ desc: 'Body stats, photos, strength graphs, reports', badge: 'COMING SOON', path: '/phase/5' },
  { num: 6, emoji: '🧠', name: 'Smart Training', /* tier: 'ELITE · ₹699/mo', tierColor: colors.AMBER, */ desc: 'Recovery tracking, fatigue detection, adaptive plans', badge: 'COMING SOON', path: '/phase/6' },
  { num: 7, emoji: '📹', name: 'Form Analysis', /* tier: 'ELITE · ₹699/mo', tierColor: colors.PURPLE, */ desc: 'AI pose estimation, form scores, video feedback', badge: 'COMING SOON', path: '/phase/7' },
  { num: 8, emoji: '👥', name: 'Community', /* tier: 'ELITE · ₹699/mo', tierColor: colors.GREEN, */ desc: 'Social feed, challenges, follow friends', badge: 'COMING SOON', path: '/phase/8' },
  { num: 9, emoji: '🏆', name: 'Gamification', /* tier: 'FREE + ELITE', tierColor: colors.GOLD, */ desc: 'XP, badges, leaderboards, weekly challenges', badge: 'COMING SOON', path: '/phase/9' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(r => {
      setDash(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const streak = dash?.streak?.current || 0;
  const totalWorkouts = dash?.totalWorkouts || 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🏋️</div>
          <div style={{ fontSize: 14, color: colors.TEXT_TERTIARY, fontWeight: 600 }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* ── Header ── */}
      <div style={{ padding: '16px 16px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Wellfitness 🏋️</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
              {getGreeting()}, {dash?.name || user?.name || 'Warrior'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {streak > 0 && <Badge label={`🔥 ${streak}`} variant="amber" />}
            <Badge label={`${totalWorkouts} workouts`} variant="blue" />
            {/* Profile Icon */}
            <div onClick={() => navigate('/profile')} style={{
              width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
              background: colors.AMBER_DIM, border: `2px solid ${colors.AMBER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: colors.AMBER,
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {(dash?.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'flex', gap: 7, padding: '8px 14px 14px' }}>
        {[
          { val: totalWorkouts, label: 'Workouts', color: colors.TEXT_PRIMARY },
          { val: streak, label: 'Streak 🔥', color: colors.AMBER },
          { val: dash?.recentPRs?.length || 0, label: 'PRs 🏆', color: colors.GREEN },
        ].map((k, i) => (
          <div key={i} style={{
            flex: 1, padding: '10px 6px', textAlign: 'center',
            background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: typography.FONT_MONO, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: colors.TEXT_TERTIARY, letterSpacing: 0.3, marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── All Phases ── */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 10 }}>
          ALL PHASES
        </div>

        {PHASES.map(phase => {
          const isActive = phase.badge === 'ACTIVE';

          return (
            <div key={phase.num} style={{ marginBottom: 8, animation: `fadeIn ${0.1 + phase.num * 0.04}s ease` }}>
              <AppCard
                onClick={() => navigate(phase.path)}
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  border: isActive ? `1.5px solid ${colors.AMBER_GLOW}` : undefined,
                  background: isActive ? colors.AMBER_DIM : colors.BG_SECONDARY,
                  marginBottom: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isActive ? colors.AMBER_DIM : colors.BG_TERTIARY,
                    border: `0.5px solid ${isActive ? colors.AMBER_GLOW : colors.BORDER_DEFAULT}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{phase.emoji}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>Phase {phase.num}</span>
                      <span style={{
                        fontSize: 7, fontWeight: 800, letterSpacing: 0.3,
                        padding: '2px 6px', borderRadius: 4,
                        background: isActive ? colors.GREEN_DIM : colors.BG_TERTIARY,
                        color: isActive ? colors.GREEN : colors.TEXT_TERTIARY,
                        border: `0.5px solid ${isActive ? '#34D39922' : colors.BORDER_DEFAULT}`,
                      }}>{phase.badge}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: colors.TEXT_PRIMARY, marginTop: 1 }}>{phase.name}</div>
                    <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{phase.desc}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {/* Membership tier hidden for Phase 1 launch
                    <div style={{ fontSize: 9, fontWeight: 800, color: phase.tierColor, letterSpacing: 0.2 }}>{phase.tier}</div>
                    */}
                    <div style={{ fontSize: 14, color: colors.TEXT_TERTIARY, marginTop: 4 }}>→</div>
                  </div>
                </div>
              </AppCard>
            </div>
          );
        })}
      </div>


    </div>
  );
}
