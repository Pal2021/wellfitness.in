import { useNavigate } from 'react-router-dom';
import AppCard from '../../../common/components/AppCard';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';

const UPCOMING = [
  { emoji: '🥗', label: 'Food Diary', desc: 'MFP-style breakfast, lunch, dinner, snacks sections' },
  { emoji: '🔥', label: 'Calorie Ring', desc: 'Goal − Food + Exercise = Remaining' },
  { emoji: '📊', label: 'Macro Bars', desc: 'Carbs, Fat, Protein tracking with daily goals' },
  { emoji: '🇮🇳', label: 'Indian Food DB', desc: '5000+ verified Indian foods with katori, roti units' },
  { emoji: '🔍', label: 'Food Search', desc: 'Real-time search, recent foods, saved meals' },
  { emoji: '📷', label: 'Barcode Scanner', desc: 'Scan packaged products instantly' },
  { emoji: '💧', label: 'Water Tracker', desc: '8-cup visual with reminders' },
  { emoji: '📋', label: 'Meal Templates', desc: 'Save & reuse frequent meal combos' },
];

export default function DietScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Diet Diary 🥗</div>
          <Badge label="PHASE 3" variant="amber" />
        </div>
      </div>

      <div style={{ padding: '20px 14px', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🥗</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Diet Tracker</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 20 }}>
          India's first gym app with a verified Indian food database.<br />
          Dal, roti, paneer — measured in katori, not grams.
        </div>
        <Badge label="COMING IN PHASE 3" variant="amber" />
        {/* Membership tier hidden for Phase 1 launch: <Badge label="COMING IN PHASE 3 — PRO PLAN" variant="amber" /> */}
      </div>

      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>
          UPCOMING FEATURES
        </div>
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
