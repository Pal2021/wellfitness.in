import { useNavigate } from 'react-router-dom';
import AppCard from '../components/AppCard';
import Badge from '../components/Badge';
import { colors } from '../theme';

const UPCOMING = [
  { emoji: '📰', label: 'Community Feed', desc: 'Share workouts, PRs, and transformations' },
  { emoji: '📸', label: 'Post Types', desc: 'Workout posts, PR cards, before/after photos' },
  { emoji: '❤️', label: 'Reactions', desc: '❤️ Like, 🔥 Fire, 💪 Strong reactions' },
  { emoji: '💬', label: 'Comments', desc: 'Threaded comments with @mentions' },
  { emoji: '👥', label: 'Follow System', desc: 'Follow friends, city-based suggestions' },
  { emoji: '🏆', label: 'Gym Challenges', desc: 'Weekly auto-generated community challenges' },
  { emoji: '⚔️', label: 'Friend Battles', desc: 'Head-to-head challenges with friends' },
  { emoji: '🛡️', label: 'Moderation', desc: 'Report, block, and content filtering' },
];

export default function CommunityScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Community 👥</div>
          <Badge label="PHASE 8" variant="green" />
        </div>
      </div>

      <div style={{ padding: '20px 14px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>👥</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Community Feed</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 20 }}>
          Share your PRs, follow friends, compete in challenges,<br />
          and celebrate transformations together.
        </div>
        <Badge label="COMING IN PHASE 8" variant="green" />
        {/* Membership tier hidden for Phase 1 launch: <Badge label="COMING IN PHASE 8 — ELITE PLAN" variant="green" /> */}
      </div>

      {/* Mock post preview */}
      <div style={{ padding: '0 14px', marginBottom: 14 }}>
        <AppCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 13px', display: 'flex', gap: 9, alignItems: 'center', background: colors.BG_TERTIARY }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: colors.AMBER_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💪</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Rahul S.</div>
              <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY }}>2 hours ago · Mumbai</div>
            </div>
          </div>
          <div style={{ padding: '12px 13px' }}>
            <div style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 1.6, marginBottom: 9 }}>
              New PR on bench! 100kg × 5 — finally hit the 2-plate club! 🏆
            </div>
            <div style={{ background: colors.AMBER_DIM, border: `0.5px solid ${colors.AMBER_GLOW}`, borderRadius: 9, padding: '9px 11px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: colors.AMBER }}>🏆 Bench Press — 100kg × 5 reps · Est 1RM: 112kg</div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: colors.TEXT_TERTIARY, fontWeight: 600 }}>
              <span>❤️ 48</span><span>💬 12</span><span>🔁 Share</span>
            </div>
          </div>
        </AppCard>
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
