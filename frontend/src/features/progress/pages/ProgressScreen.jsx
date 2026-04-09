import { useNavigate } from 'react-router-dom';
import AppCard from '../../../common/components/AppCard';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';

const UPCOMING = [
  { emoji: '⚖️', label: 'Body Weight Log', desc: 'Daily weight with 7-day moving average trend' },
  { emoji: '📐', label: 'Body Fat Estimator', desc: 'Navy formula — no equipment needed' },
  { emoji: '📷', label: 'Progress Photos', desc: 'Before/after comparison with timeline' },
  { emoji: '📏', label: 'Measurements', desc: 'Chest, waist, arms, thighs — trend arrows' },
  { emoji: '📊', label: 'Strength Graphs', desc: 'Per-lift 1RM history and volume charts' },
  { emoji: '📋', label: 'Monthly Report', desc: 'Auto-generated PDF with all stats' },
];

export default function ProgressScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Progress 📈</div>
          <Badge label="PHASE 5" variant="blue" />
        </div>
      </div>

      <div style={{ padding: '20px 14px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📈</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Progress Tracking</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 20 }}>
          Weight, body fat, measurements, progress photos,<br />
          and strength curves — all in one place.
        </div>
        <Badge label="COMING IN PHASE 5" variant="blue" />
        {/* Membership tier hidden for Phase 1 launch: <Badge label="COMING IN PHASE 5 — PRO PLAN" variant="blue" /> */}
      </div>

      {/* Stats preview */}
      <div style={{ padding: '0 14px', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>PREVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {[
            { val: '78.4 kg', label: 'Body Weight', trend: '▼ 0.3kg/wk', color: colors.GREEN },
            { val: '17%', label: 'Body Fat', trend: '▼ 0.8%/mo', color: colors.GREEN },
            { val: '112 kg', label: 'Bench 1RM', trend: '▲ 5kg/3mo', color: colors.AMBER },
            { val: '7.2 hrs', label: 'Avg Sleep', trend: 'Good', color: colors.GREEN },
          ].map((s, i) => (
            <AppCard key={i} style={{ padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: typography.FONT_MONO, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: s.color, marginTop: 5 }}>{s.trend}</div>
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
