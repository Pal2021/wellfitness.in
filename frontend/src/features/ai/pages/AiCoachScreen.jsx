import { useNavigate } from 'react-router-dom';
import AppCard from '../../../common/components/AppCard';
import Badge from '../../../common/components/Badge';
import { colors } from '../../../theme';

const UPCOMING = [
  { emoji: '🧠', label: 'AI Chat', desc: 'Ask anything about your training, diet, or recovery' },
  { emoji: '📊', label: 'Daily Brief', desc: 'Auto-generated morning insights & recommendations' },
  { emoji: '📈', label: 'Smart Overload', desc: '6-week trend analysis with deload suggestions' },
  { emoji: '🥗', label: 'Diet Advisor', desc: 'Cross-references workout + diet for Indian food suggestions' },
  { emoji: '💤', label: 'Recovery Score', desc: 'Sleep, HRV, fatigue — scored 0-100 daily' },
  { emoji: '⌚', label: 'Wearable Sync', desc: 'Google Fit & Apple Health auto-import' },
  { emoji: '👨‍🏫', label: 'Coach Mode', desc: 'Personal trainers manage up to 50 clients' },
];

export default function AiCoachScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>AI Coach 🤖</div>
          <Badge label="PHASE 4" variant="purple" />
        </div>
      </div>

      <div style={{ padding: '20px 14px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 14px',
          background: `linear-gradient(135deg, ${colors.AMBER}, #e85d0a)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
        }}>🤖</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Wellfitness AI Coach</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 20 }}>
          Your personal AI trainer that reads your actual workout<br />
          and diet history to give you real advice.
        </div>
        <Badge label="COMING IN PHASE 4" variant="purple" />
        {/* Membership tier hidden for Phase 1 launch: <Badge label="COMING IN PHASE 4 — PRO / ELITE" variant="purple" /> */}
      </div>

      {/* Mock chat preview */}
      <div style={{ padding: '0 14px', marginBottom: 14 }}>
        <AppCard style={{ padding: 14, borderLeft: `3px solid ${colors.PURPLE}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.PURPLE, letterSpacing: 0.5, marginBottom: 6 }}>PREVIEW</div>
          <div style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 1.6 }}>
            "Your bench has plateaued for 3 weeks at 80kg. I recommend a deload this week — drop to 60kg for 4×8, then try 82.5kg next Monday."
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
