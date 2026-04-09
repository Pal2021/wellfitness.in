import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../common/context/AuthContext';
import AppCard from '../../../common/components/AppCard';
import AppButton from '../../../common/components/AppButton';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';
import api from '../../../services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [prs, setPrs] = useState([]);
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');


  useEffect(() => {
    Promise.all([
      api.get('/profile').then(r => setProfile(r.data.data)),
      api.get('/prs').then(r => setPrs(r.data.data || [])).catch(() => {}),
      api.get('/dashboard').then(r => setDash(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const saveField = async (field) => {
    try {
      await api.put('/profile', { [field]: editValue });
      setProfile(prev => ({ ...prev, [field]: editValue }));
      setEditField(null);
    } catch (e) { alert('Failed to save'); }
  };

  const goals = [
    { key: 'BUILD_MUSCLE', emoji: '💪', label: 'MUSCLE' },
    { key: 'LOSE_FAT', emoji: '🔥', label: 'FAT LOSS' },
    { key: 'GET_STRONG', emoji: '⚡', label: 'STRENGTH' },
  ];

  const settings = [
    { icon: '📅', label: 'Training Split', value: 'View your split', action: () => navigate('/split') },
    { icon: '⚖️', label: 'Body Weight', value: profile?.bodyweightKg ? `${profile.bodyweightKg} kg` : 'Not set', field: 'bodyweightKg' },
    { icon: '📏', label: 'Height', value: profile?.heightCm ? `${profile.heightCm} cm` : 'Not set', field: 'heightCm' },
    { icon: '🔔', label: 'Reminders', value: profile?.notificationTime || 'Not set', field: 'notificationTime' },
    { icon: '📐', label: 'Units', value: `${profile?.unitsWeight || 'KG'} · ${profile?.unitsHeight || 'CM'}` },
  ];



  const streak = dash?.streak?.current || 0;
  const totalWorkouts = dash?.totalWorkouts || 0;
  const totalPRs = prs.length;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: colors.TEXT_TERTIARY, animation: 'pulse 1.5s infinite' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>My Profile</div>
      </div>

      {/* ─── User Hero Card ─── */}
      <div style={{
        margin: '8px 14px 12px', padding: '20px 18px', borderRadius: 16,
        background: `linear-gradient(135deg, ${colors.AMBER_DIM} 0%, ${colors.BG_SECONDARY} 50%, ${colors.BG_TERTIARY} 100%)`,
        border: `1px solid ${colors.AMBER_GLOW}`,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.AMBER} 0%, ${colors.AMBER_GLOW} 100%)`,
            border: `3px solid ${colors.AMBER}`, boxShadow: `0 0 20px ${colors.AMBER}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#000',
          }}>
            {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{profile?.name || user?.name}</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{profile?.email}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <Badge label={`🔥 ${profile?.daysPerWeek || 0}d/week`} variant="amber" />
              <Badge label={profile?.experience || 'Beginner'} variant="blue" />
              <Badge label="Free Plan" variant="green" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Activity Stats ─── */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>📊 ACTIVITY OVERVIEW</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
          {[
            { val: totalWorkouts, label: 'Total Workouts', icon: '🏋️', color: colors.AMBER },
            { val: streak, label: 'Current Streak', icon: '🔥', color: colors.AMBER },
            { val: totalPRs, label: 'Total PRs', icon: '🏆', color: colors.GREEN },
            { val: dash?.recentPRs?.length || 0, label: 'Recent PRs', icon: '⭐', color: colors.BLUE },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '12px 6px', textAlign: 'center', borderRadius: 12,
              background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
            }}>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: typography.FONT_MONO, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: colors.TEXT_TERTIARY, marginTop: 2, letterSpacing: 0.2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <AppCard onClick={() => navigate('/workout')} style={{ flex: 1, padding: '14px 12px', cursor: 'pointer', background: colors.AMBER_DIM, border: `0.5px solid ${colors.AMBER_GLOW}` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>💪</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: colors.AMBER }}>Start Workout</div>
            </div>
          </AppCard>
          <AppCard onClick={() => navigate('/history')} style={{ flex: 1, padding: '14px 12px', cursor: 'pointer' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>📖</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>View History</div>
            </div>
          </AppCard>
          <AppCard onClick={() => navigate('/split')} style={{ flex: 1, padding: '14px 12px', cursor: 'pointer' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>📋</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>My Split</div>
            </div>
          </AppCard>
        </div>
      </div>

      {/* ─── Goal Selector ─── */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>🎯 FITNESS GOAL</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
          {goals.map(g => {
            const active = profile?.goal === g.key;
            return (
              <AppCard key={g.key} onClick={async () => {
                try {
                  await api.put('/profile', { goal: g.key });
                  setProfile(prev => ({ ...prev, goal: g.key }));
                } catch (e) { alert('Failed to update goal'); }
              }} style={{
                padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                border: active ? `1.5px solid ${colors.AMBER}` : undefined,
                background: active ? colors.AMBER_DIM : colors.BG_SECONDARY,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{g.emoji}</div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.3, color: active ? colors.AMBER : colors.TEXT_TERTIARY }}>{g.label}</div>
              </AppCard>
            );
          })}
        </div>
      </div>

      {/* ─── Personal Records ─── */}
      {totalPRs > 0 && (
        <div style={{ padding: '0 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>🏆 PERSONAL RECORDS (Top {Math.min(totalPRs, 5)})</div>
          {prs.slice(0, 5).map((pr, i) => (
            <AppCard key={i} style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: colors.GREEN_DIM, border: `0.5px solid #34D39933`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: colors.GREEN,
                    fontFamily: typography.FONT_MONO,
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{pr.exerciseName}</div>
                    <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 1 }}>{pr.achievedAt?.split('T')[0]}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: colors.AMBER, fontFamily: typography.FONT_MONO }}>
                    {pr.weightKg}kg × {pr.reps}
                  </div>
                  <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY }}>1RM: {pr.estimated1rm}kg</div>
                </div>
              </div>
            </AppCard>
          ))}
        </div>
      )}

      {/* ─── Settings ─── */}
      <div style={{ padding: '4px 14px 0' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>⚙️ SETTINGS</div>
        {settings.map((s, i) => (
          <AppCard key={i} onClick={() => {
            if (s.action) { s.action(); return; }
            if (s.field) { setEditField(s.field); setEditValue(profile?.[s.field] || ''); }
          }} style={{ padding: '11px 14px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 17, width: 24, textAlign: 'center' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 1 }}>{s.value}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, color: colors.TEXT_TERTIARY }}>›</span>
            </div>
          </AppCard>
        ))}
      </div>



      {/* Inline edit modal */}
      {editField && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ background: colors.BG_SECONDARY, borderRadius: 16, padding: 20, width: '85%', maxWidth: 350 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Edit {editField}</div>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
              style={{
                width: '100%', background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                borderRadius: 10, padding: '10px 12px', fontSize: 14, color: colors.TEXT_PRIMARY, outline: 'none', marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <AppButton label="Save" onClick={() => saveField(editField)} style={{ flex: 1 }} />
              <AppButton label="Cancel" variant="ghost" onClick={() => setEditField(null)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: '10px 14px 0' }}>
        <AppButton label="Logout" variant="danger" onClick={() => { logout(); navigate('/login'); }} />
      </div>
    </div>
  );
}
