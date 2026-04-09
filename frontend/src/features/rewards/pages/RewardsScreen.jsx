import { useNavigate } from 'react-router-dom';
import AppCard from '../../../common/components/AppCard';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';

const BADGES_PREVIEW = [
  { emoji: '🏋️', name: 'First Workout', earned: true },
  { emoji: '💪', name: '10 Sessions', earned: true },
  { emoji: '🏆', name: 'First PR', earned: true },
  { emoji: '🔥', name: '7-Day Streak', earned: false },
  { emoji: '🦁', name: 'Bench 100kg', earned: false },
  { emoji: '💯', name: '100 Sessions', earned: false },
];

const UPCOMING = [
  { emoji: '⭐', label: 'XP Points', desc: 'Earn XP for workouts, PRs, streaks, and more' },
  { emoji: '📊', label: 'Level System', desc: 'Level 1-25 with titles: Beginner → Legend' },
  { emoji: '🏅', label: '20+ Badges', desc: 'Workout, strength, streak, diet, community badges' },
  { emoji: '🏆', label: 'Leaderboards', desc: 'Weekly XP, monthly volume, city-based boards' },
  { emoji: '🎯', label: 'Weekly Challenges', desc: 'Auto-generated challenges with bonus XP' },
  { emoji: '🔥', label: 'Streak Visuals', desc: 'Fire animation that grows with longer streaks' },
  { emoji: '❄️', label: 'Streak Freeze', desc: '1 free skip per month without breaking streak' },
];

export default function RewardsScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Rewards 🏆</div>
          <Badge label="PHASE 9" variant="gold" />
        </div>
      </div>

      <div style={{ padding: '20px 14px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Achievements & XP</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 20 }}>
          Earn XP, unlock badges, compete on leaderboards,<br />
          and challenge friends head-to-head.
        </div>
        <Badge label="COMING IN PHASE 9" variant="gold" />
        {/* Membership tier hidden for Phase 1 launch: <Badge label="COMING IN PHASE 9 — FREE + ELITE" variant="gold" /> */}
      </div>

      {/* Badge preview grid */}
      <div style={{ padding: '0 14px', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>BADGE PREVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
          {BADGES_PREVIEW.map((b, i) => (
            <AppCard key={i} style={{
              padding: '12px 8px', textAlign: 'center',
              opacity: b.earned ? 1 : 0.3,
              border: b.earned ? `0.5px solid ${colors.AMBER_GLOW}` : undefined,
              background: b.earned ? colors.AMBER_DIM : colors.BG_SECONDARY,
            }}>
              <div style={{ fontSize: 26, marginBottom: 5 }}>{b.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: b.earned ? colors.AMBER : colors.TEXT_TERTIARY }}>
                {b.name}
              </div>
            </AppCard>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>UPCOMING FEATURES</div>
        {UPCOMING.map((f, i) => (
          <AppCard key={i} style={{ padding: '12px 14px', animation: `fadeIn ${0.2 + i * 0.05}s ease` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{f.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}
