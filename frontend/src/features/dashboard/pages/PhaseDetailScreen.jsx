import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppCard from '../../../common/components/AppCard';
import AppButton from '../../../common/components/AppButton';
import Badge from '../../../common/components/Badge';
import { colors } from '../../../theme';

const PHASES = {
  '1': {
    name: 'MVP Workout Tracker', emoji: '🏋️', /* tier: 'FREE', badge: 'green', */
    desc: 'Track workouts, manage splits, log sets with weights & reps, view history, and hit new PRs.',
    features: [
      { emoji: '💪', label: 'Start Workout', desc: 'Log sets, weights, reps — with PR detection', path: '/workout' },
      { emoji: '📋', label: 'My Split', desc: 'View/change splits, add/remove exercises per day', path: '/split' },
      { emoji: '📚', label: 'Exercise Library', desc: '55+ exercises, search, filter, add custom exercises', path: '/exercises' },
      { emoji: '📖', label: 'Workout History', desc: 'View all past sessions with dates, exercises, sets', path: '/history' },
      { emoji: '👤', label: 'Profile', desc: 'Goals, body stats, settings, personal records', path: '/profile' },
    ],
  },
  '2': {
    name: 'Advanced Workout System', emoji: '⚡', /* tier: 'PRO · ₹299/mo', badge: 'amber', */
    desc: 'Level up your workouts with templates, analytics, supersets, and RPE tracking.',
    features: [
      { emoji: '📋', label: 'Workout Templates', desc: 'Save any completed workout as a reusable template' },
      { emoji: '⏱', label: 'Advanced Rest Timer', desc: 'Per-exercise defaults, audio alerts, vibration' },
      { emoji: '🏆', label: 'PR Celebration', desc: 'Full-screen trophy animation with confetti burst' },
      { emoji: '📊', label: 'Workout Analytics', desc: 'Volume charts, strength curves, frequency heatmaps' },
      { emoji: '💪', label: '1RM Estimator', desc: '1RM history, percentage calculator (60-80% of 1RM)' },
      { emoji: '🔗', label: 'Superset Support', desc: 'Link two exercises, alternate sets, combined rest' },
      { emoji: '📝', label: 'Workout Notes', desc: 'Session notes, searchable, shown in history' },
      { emoji: '😰', label: 'RPE Rating', desc: 'Rate of Perceived Exertion (1-10) per set' },
    ],
  },
  '3': {
    name: 'Diet & Nutrition', emoji: '🥗', /* tier: 'PRO · ₹299/mo', badge: 'amber', */
    desc: 'India\'s first gym app with a verified Indian food database — dal, roti, paneer measured in katori.',
    features: [
      { emoji: '🥗', label: 'Food Diary', desc: 'MFP-style breakfast, lunch, dinner, snacks sections' },
      { emoji: '🔥', label: 'Calorie Ring', desc: 'Goal − Food + Exercise = Remaining' },
      { emoji: '📊', label: 'Macro Bars', desc: 'Carbs, Fat, Protein tracking with daily goals' },
      { emoji: '🇮🇳', label: 'Indian Food DB', desc: '5000+ verified Indian foods with katori, roti units' },
      { emoji: '📷', label: 'Barcode Scanner', desc: 'Scan packaged products instantly' },
      { emoji: '💧', label: 'Water Tracker', desc: '8-cup visual with reminders' },
    ],
  },
  '4': {
    name: 'AI Coach', emoji: '🤖', /* tier: 'PRO / ELITE', badge: 'purple', */
    desc: 'Your personal AI trainer powered by Gemini — reads your actual workout & diet history.',
    features: [
      { emoji: '🧠', label: 'AI Chat', desc: 'Ask anything about your training, diet, or recovery' },
      { emoji: '📊', label: 'Daily Brief', desc: 'Auto-generated morning insights & recommendations' },
      { emoji: '📈', label: 'Smart Overload', desc: '6-week trend analysis with deload suggestions' },
      { emoji: '🥗', label: 'Diet Advisor', desc: 'Cross-references workout + diet for Indian food suggestions' },
      { emoji: '💤', label: 'Recovery Score', desc: 'Sleep, HRV, fatigue — scored 0-100 daily' },
    ],
  },
  '5': {
    name: 'Progress Tracking', emoji: '📈', /* tier: 'PRO · ₹299/mo', badge: 'blue', */
    desc: 'Body weight, measurements, progress photos, strength graphs, and monthly reports.',
    features: [
      { emoji: '⚖️', label: 'Body Weight Log', desc: 'Daily weight with 7-day moving average trend' },
      { emoji: '📐', label: 'Body Fat Estimator', desc: 'Navy formula — no equipment needed' },
      { emoji: '📷', label: 'Progress Photos', desc: 'Before/after comparison with timeline' },
      { emoji: '📏', label: 'Measurements', desc: 'Chest, waist, arms, thighs — trend arrows' },
      { emoji: '📊', label: 'Strength Graphs', desc: 'Per-lift 1RM history and volume charts' },
      { emoji: '📋', label: 'Monthly Report', desc: 'Auto-generated PDF with all stats' },
    ],
  },
  '6': {
    name: 'Smart Training', emoji: '🧠', /* tier: 'ELITE · ₹699/mo', badge: 'amber', */
    desc: 'AI-powered training adjustments based on recovery, fatigue, and life events.',
    features: [
      { emoji: '💚', label: 'Muscle Recovery Tracker', desc: 'Per-muscle recovery: Ready / Recovering / Rest' },
      { emoji: '😴', label: 'Fatigue Detection', desc: '2-week rolling analysis, flags performance drops >20%' },
      { emoji: '🔄', label: 'Adaptive Plans', desc: 'Auto-adjusts volume based on recovery and sleep' },
      { emoji: '📉', label: 'Deload Planner', desc: 'Auto-schedules 40% volume reduction after 8 weeks' },
      { emoji: '🔀', label: 'Exercise Substitution', desc: 'Smart alternatives based on equipment and muscle group' },
    ],
  },
  '7': {
    name: 'AI Form Analysis', emoji: '📹', /* tier: 'ELITE · ₹699/mo', badge: 'purple', */
    desc: 'Upload exercise videos and get AI-powered form feedback with scores.',
    features: [
      { emoji: '📱', label: 'Video Upload', desc: '10-30 sec clips for Squat, Deadlift, Bench, OHP' },
      { emoji: '🦴', label: 'Pose Estimation', desc: 'MediaPipe on-device — 33 body keypoints per frame' },
      { emoji: '📊', label: 'Form Score', desc: '0-100 score per metric: depth, knee cave, bar path, etc.' },
      { emoji: '📝', label: 'Written Feedback', desc: '"Your squat depth is 72% — aim for 90%+. Try ankle drills."' },
      { emoji: '🆚', label: 'Form Comparison', desc: 'Side-by-side: 30 days ago vs today with score improvements' },
    ],
  },
  '8': {
    name: 'Community', emoji: '👥', /* tier: 'ELITE · ₹699/mo', badge: 'green', */
    desc: 'Share PRs, follow friends, compete in challenges, and celebrate transformations.',
    features: [
      { emoji: '📰', label: 'Community Feed', desc: 'Share workouts, PRs, and transformations' },
      { emoji: '📸', label: 'Post Types', desc: 'Workout posts, PR cards, before/after photos' },
      { emoji: '❤️', label: 'Reactions', desc: '❤️ Like, 🔥 Fire, 💪 Strong reactions' },
      { emoji: '💬', label: 'Comments', desc: 'Threaded comments with @mentions' },
      { emoji: '👥', label: 'Follow System', desc: 'Follow friends, city-based suggestions' },
      { emoji: '⚔️', label: 'Friend Battles', desc: 'Head-to-head challenges with friends' },
    ],
  },
  '9': {
    name: 'Gamification', emoji: '🏆', /* tier: 'FREE + ELITE', badge: 'gold', */
    desc: 'Earn XP, unlock badges, compete on leaderboards, and complete weekly challenges.',
    features: [
      { emoji: '⭐', label: 'XP Points', desc: 'Earn XP for workouts, PRs, streaks, and more' },
      { emoji: '📊', label: 'Level System', desc: 'Level 1-25 with titles: Beginner → Legend' },
      { emoji: '🏅', label: '20+ Badges', desc: 'Workout, strength, streak, diet, community badges' },
      { emoji: '🏆', label: 'Leaderboards', desc: 'Weekly XP, monthly volume, city-based boards' },
      { emoji: '🎯', label: 'Weekly Challenges', desc: 'Auto-generated challenges with bonus XP' },
      { emoji: '🔥', label: 'Streak Visuals', desc: 'Fire animation that grows with longer streaks' },
    ],
  },
};



export default function PhaseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const phase = PHASES[id];
  const isActive = id === '1';

  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDone, setNotifyDone] = useState(false);

  if (!phase) {
    return (
      <div style={{ paddingBottom: 20 }}>
        <div style={{ padding: '14px 16px 6px' }}>
          <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Unknown Phase</div>
        </div>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤷</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Phase not found</div>
          <AppButton label="Go Back" onClick={() => navigate(-1)} style={{ marginTop: 20 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Phase {id} — {phase.name}</div>
          <Badge label={isActive ? 'ACTIVE' : 'COMING SOON'} variant={isActive ? 'green' : 'amber'} />
          {/* Membership tier hidden for Phase 1 launch: <Badge label={isActive ? 'ACTIVE' : phase.tier} variant={phase.badge} /> */}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        margin: '8px 14px 12px', padding: '20px 16px', textAlign: 'center',
        borderRadius: 16, background: `linear-gradient(135deg, ${colors.BG_SECONDARY} 0%, ${colors.BG_TERTIARY} 100%)`,
        border: `0.5px solid ${colors.BORDER_DEFAULT}`,
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{phase.emoji}</div>
        <div style={{ fontSize: 13, color: colors.TEXT_TERTIARY, lineHeight: 1.6, marginBottom: 10 }}>{phase.desc}</div>
        {isActive && <Badge label="✅ This phase is active" variant="green" />}
        {!isActive && <Badge label="🔒 COMING SOON" variant="amber" />}
        {/* Membership tier hidden for Phase 1 launch: {!isActive && <Badge label={`🔒 ${phase.tier}`} variant={phase.badge} />} */}
      </div>

      {/* Features */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>
          {isActive ? 'FEATURES' : 'UPCOMING FEATURES'} ({phase.features.length})
        </div>
        {phase.features.map((f, i) => (
          <AppCard key={i} onClick={() => f.path && navigate(f.path)} style={{
            padding: '12px 14px', cursor: f.path ? 'pointer' : 'default',
            animation: `fadeIn ${0.15 + i * 0.05}s ease`,
            border: isActive && f.path ? `1px solid ${colors.AMBER_GLOW}` : undefined,
            background: isActive && f.path ? colors.AMBER_DIM : colors.BG_SECONDARY,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: isActive ? colors.AMBER_DIM : colors.BG_TERTIARY,
                border: `0.5px solid ${isActive ? colors.AMBER_GLOW : colors.BORDER_DEFAULT}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{f.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{f.label}</span>
                  {!isActive && (
                    <span style={{
                      fontSize: 7, fontWeight: 800, padding: '2px 5px', borderRadius: 4,
                      background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                      border: `0.5px solid ${colors.BORDER_DEFAULT}`, letterSpacing: 0.3,
                    }}>UPCOMING</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{f.desc}</div>
              </div>
              {f.path && <span style={{ fontSize: 16, color: colors.AMBER }}>→</span>}
            </div>
          </AppCard>
        ))}
      </div>


      {/* ─── Notify Me Section ─── */}
      {!isActive && (
        <div style={{ padding: '10px 14px 0' }}>
          <div style={{
            padding: '16px', borderRadius: 14,
            background: `linear-gradient(135deg, ${colors.BG_SECONDARY} 0%, ${colors.BG_TERTIARY} 100%)`,
            border: `0.5px solid ${colors.BORDER_DEFAULT}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Get Notified</div>
                <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>We'll email you when Phase {id} launches</div>
              </div>
            </div>
            {notifyDone ? (
              <div style={{
                padding: '10px 14px', borderRadius: 10, textAlign: 'center',
                background: colors.GREEN_DIM, border: `0.5px solid #34D39933`,
                fontSize: 12, fontWeight: 700, color: colors.GREEN,
              }}>✅ You'll be notified when this feature is live!</div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <input placeholder="Enter your email..." value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)}
                  style={{
                    flex: 1, background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                    borderRadius: 10, padding: '10px 12px', fontSize: 13, color: colors.TEXT_PRIMARY, outline: 'none',
                  }} />
                <div onClick={() => { if (notifyEmail.includes('@')) setNotifyDone(true); else alert('Please enter a valid email'); }} style={{
                  padding: '10px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  background: colors.AMBER, color: '#000',
                }}>Notify Me</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '10px 14px' }}>
        <AppButton label="← Back" variant="outline" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
}
