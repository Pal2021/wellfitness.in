import { useNavigate } from 'react-router-dom';
import { colors, typography } from '../../../theme';

const FEATURES = [
  { emoji: '🏋️', title: 'Smart Workout Tracking', desc: 'Log sets, reps, and weights with intelligent PR detection' },
  { emoji: '📊', title: 'Progress Analytics', desc: 'Track your strength gains with visual charts and reports' },
  { emoji: '📋', title: 'Custom Splits', desc: 'PPL, Upper/Lower, Bro Split, Arnold — or build your own' },
  { emoji: '🏆', title: 'PR Detection', desc: 'Automatic personal record tracking across all exercises' },
  { emoji: '🤖', title: 'AI Coach', desc: 'Get personalized training advice powered by AI (Coming Soon)' },
  { emoji: '🥗', title: 'Diet & Nutrition', desc: 'Indian food database with macro tracking (Coming Soon)' },
];

const BENEFITS = [
  { icon: '⚡', text: 'Track workouts in seconds' },
  { icon: '📈', text: 'See your strength progress over time' },
  { icon: '🎯', text: 'Never forget what you lifted last session' },
  { icon: '🔥', text: 'Build consistency with streak tracking' },
  { icon: '💪', text: '55+ exercises with custom additions' },
  { icon: '🆓', text: 'Phase 1 is completely free' },
];

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: colors.BG_PRIMARY, animation: 'fadeIn 0.5s ease' }}>
      {/* ─── Hero Section ─── */}
      <div style={{
        padding: '50px 24px 30px', textAlign: 'center',
        background: `linear-gradient(180deg, ${colors.AMBER}08 0%, transparent 100%)`,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 4,
          background: `linear-gradient(135deg, ${colors.AMBER} 0%, #FFD700 50%, ${colors.AMBER} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Wellfitness
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.TEXT_TERTIARY, letterSpacing: 2, marginBottom: 20 }}>
          SMART GYM TRACKER
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 10, color: colors.TEXT_PRIMARY }}>
          Track. Lift. Progress.
        </div>
        <div style={{ fontSize: 14, color: colors.TEXT_SECONDARY, lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
          The smart gym companion that remembers every rep, tracks your PRs, and helps you get stronger — session by session.
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto' }}>
          <div onClick={() => navigate('/login')} style={{
            padding: '14px 24px', borderRadius: 14,
            background: `linear-gradient(135deg, ${colors.AMBER} 0%, #FFD700 100%)`,
            color: '#000', fontSize: 15, fontWeight: 800, textAlign: 'center', cursor: 'pointer',
            boxShadow: `0 4px 20px ${colors.AMBER}44`,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 30px ${colors.AMBER}66`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${colors.AMBER}44`; }}
          >
            Get Started — It's Free 💪
          </div>
          <div onClick={() => navigate('/login')} style={{
            padding: '12px 24px', borderRadius: 14,
            background: 'transparent', border: `1.5px solid ${colors.AMBER}44`,
            color: colors.AMBER, fontSize: 13, fontWeight: 700, textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.AMBER; e.currentTarget.style.background = colors.AMBER_DIM; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${colors.AMBER}44`; e.currentTarget.style.background = 'transparent'; }}
          >
            Already have an account? Sign In
          </div>
        </div>
      </div>

      {/* ─── Features Section ─── */}
      <div style={{ padding: '30px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: colors.AMBER, letterSpacing: 2, marginBottom: 6 }}>FEATURES</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Everything You Need to Level Up</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: '16px 14px', borderRadius: 14,
              background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
              animation: `fadeIn ${0.2 + i * 0.05}s ease`,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Benefits Section ─── */}
      <div style={{
        padding: '24px 20px',
        background: `linear-gradient(135deg, ${colors.AMBER}08 0%, ${colors.BG_SECONDARY} 100%)`,
        borderTop: `0.5px solid ${colors.BORDER_DEFAULT}`,
        borderBottom: `0.5px solid ${colors.BORDER_DEFAULT}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: colors.AMBER, letterSpacing: 2, marginBottom: 6 }}>WHY WELLFITNESS?</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Built for Serious Lifters</div>
        </div>

        <div style={{ maxWidth: 340, margin: '0 auto' }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 6,
              background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
              animation: `fadeIn ${0.3 + i * 0.04}s ease`,
            }}>
              <div style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{b.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{b.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Pricing Teaser — hidden for Phase 1 launch ───
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: colors.AMBER, letterSpacing: 2, marginBottom: 6 }}>PLANS</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Start Free, Upgrade When Ready</div>

        <div style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}>
          {[
            { name: 'Free', price: '₹0', desc: 'Workout tracking, splits, history', color: colors.GREEN },
            { name: 'Pro', price: '₹299/mo', desc: 'Analytics, diet, AI coach', color: colors.AMBER },
            { name: 'Elite', price: '₹699/mo', desc: 'Everything + community', color: colors.PURPLE },
          ].map((p, i) => (
            <div key={i} style={{
              flex: 1, padding: '14px 10px', borderRadius: 12, textAlign: 'center',
              background: colors.BG_SECONDARY, border: `0.5px solid ${i === 1 ? p.color + '66' : colors.BORDER_DEFAULT}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: typography.FONT_MONO, color: p.color }}>{p.price}</div>
              <div style={{ fontSize: 9, color: colors.TEXT_TERTIARY, marginTop: 4 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
      */}

      {/* ─── Bottom CTA ─── */}
      <div style={{ padding: '10px 24px 30px', textAlign: 'center' }}>
        <div onClick={() => navigate('/login')} style={{
          padding: '14px 24px', borderRadius: 14, maxWidth: 300, margin: '0 auto',
          background: `linear-gradient(135deg, ${colors.AMBER} 0%, #FFD700 100%)`,
          color: '#000', fontSize: 15, fontWeight: 800, textAlign: 'center', cursor: 'pointer',
          boxShadow: `0 4px 20px ${colors.AMBER}44`,
        }}>
          Get Started Free →
        </div>

      </div>
    </div>
  );
}
