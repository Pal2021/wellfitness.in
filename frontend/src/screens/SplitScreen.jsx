import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import { colors, typography } from '../theme';
import api from '../services/api';

const MUSCLE_GROUPS = ['CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'CORE', 'FULL_BODY', 'CARDIO', 'OTHER'];

export default function SplitScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [split, setSplit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangeSplit, setShowChangeSplit] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [addingExercise, setAddingExercise] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [changingLoading, setChangingLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  // Exercise history state
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [exerciseHistory, setExerciseHistory] = useState({});

  // Manual add form state
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualMuscle, setManualMuscle] = useState('CHEST');
  const [manualNotes, setManualNotes] = useState('');
  const [manualSaving, setManualSaving] = useState(false);

  const loadSplit = () => {
    setLoading(true);
    api.get('/splits/active').then(r => {
      setSplit(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadSplit(); }, []);

  // Auto-expand first non-rest day
  useEffect(() => {
    if (split?.days && !expandedDay) {
      const first = split.days.find(d => !d.isRestDay);
      if (first) setExpandedDay(first.id);
    }
  }, [split]);

  const openChangeSplit = () => {
    api.get('/split-templates').then(r => setTemplates(r.data.data || []));
    setShowChangeSplit(true);
  };

  const changeSplit = async (templateId) => {
    setChangingLoading(true);
    try {
      await api.post('/splits/from-template', { templateId });
      setShowChangeSplit(false);
      loadSplit();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to change split');
    }
    setChangingLoading(false);
  };

  const openAddExercise = (dayId) => {
    setAddingExercise(dayId);
    setSearchTerm('');
    setShowManualAdd(false);
    setManualName('');
    setManualMuscle('CHEST');
    setManualNotes('');
    api.get('/exercises').then(r => setAllExercises(r.data.data || []));
  };

  const addExerciseToDay = async (exerciseId) => {
    if (!split || !addingExercise) return;
    try {
      await api.post(`/splits/${split.id}/days/${addingExercise}/exercises/${exerciseId}`);
      setAddingExercise(null);
      loadSplit();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to add exercise');
    }
  };

  const saveManualExercise = async () => {
    if (!manualName.trim()) { alert('Please enter an exercise name'); return; }
    setManualSaving(true);
    try {
      const r = await api.post('/exercises', {
        name: manualName.trim(),
        muscleGroup: manualMuscle,
        equipment: 'OTHER',
        difficulty: 'INTERMEDIATE',
        isCompound: false,
        instructions: manualNotes.trim() || null,
      });
      const newExercise = r.data.data;
      await addExerciseToDay(newExercise.id);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create exercise');
    }
    setManualSaving(false);
  };

  const removeExerciseFromDay = async (dayId, exerciseId) => {
    if (!split) return;
    if (!confirm('Remove this exercise?')) return;
    try {
      await api.delete(`/splits/${split.id}/days/${dayId}/exercises/${exerciseId}`);
      loadSplit();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to remove exercise');
    }
  };

  const toggleExerciseHistory = async (exerciseId) => {
    if (expandedExercise === exerciseId) { setExpandedExercise(null); return; }
    setExpandedExercise(exerciseId);
    if (!exerciseHistory[exerciseId]) {
      try {
        const r = await api.get(`/workouts/exercise-history/${exerciseId}`);
        setExerciseHistory(prev => ({ ...prev, [exerciseId]: r.data.data || [] }));
      } catch (e) { console.error(e); }
    }
  };

  const formatHistoryDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' });
    return `${dayName}, ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 14, color: colors.TEXT_TERTIARY, fontWeight: 600 }}>Loading split...</div>
      </div>
    </div>
  );

  const days = split?.days || [];
  const workoutDays = days.filter(d => !d.isRestDay).sort((a, b) => a.displayOrder - b.displayOrder);
  const restDays = days.filter(d => d.isRestDay);
  const filteredExercises = allExercises.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Change Split Modal ───
  if (showChangeSplit) {
    return (
      <div style={{ paddingBottom: 20, animation: 'fadeIn 0.3s ease' }}>
        <div style={{ padding: '14px 16px 6px' }}>
          <div onClick={() => setShowChangeSplit(false)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Change Split</div>
          <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>Choose a new training split</div>
        </div>
        <div style={{ padding: '8px 14px 0' }}>
          <div style={{ fontSize: 11, color: colors.RED, fontWeight: 600, marginBottom: 14, padding: '10px 14px',
            background: colors.RED_DIM, borderRadius: 12, border: `0.5px solid #F8717133` }}>
            ⚠️ This will replace your current split. Your workout history is safe.
          </div>
          {templates.map(t => (
            <AppCard key={t.id} onClick={() => changeSplit(t.id)} style={{ padding: '14px 16px', cursor: 'pointer', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                }}>{t.iconEmoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
                    {t.frequencyDays} days/week · {t.difficulty}
                  </div>
                </div>
                {split?.templateId === t.id && <Badge label="CURRENT" variant="green" />}
              </div>
            </AppCard>
          ))}
        </div>
      </div>
    );
  }

  // ─── Add Exercise Modal (Redesigned with Manual Add) ───
  if (addingExercise) {
    return (
      <div style={{ paddingBottom: 20, animation: 'fadeIn 0.3s ease' }}>
        <div style={{ padding: '14px 16px 6px' }}>
          <div onClick={() => setAddingExercise(null)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back to Split</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Add Exercise</div>
          <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>Search or add your own exercise</div>
        </div>

        {/* Toggle: Search / Manual */}
        <div style={{ display: 'flex', gap: 6, padding: '8px 14px' }}>
          <div onClick={() => setShowManualAdd(false)} style={{
            flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: !showManualAdd ? colors.AMBER_DIM : colors.BG_SECONDARY,
            border: `1px solid ${!showManualAdd ? colors.AMBER : colors.BORDER_DEFAULT}`,
            color: !showManualAdd ? colors.AMBER : colors.TEXT_TERTIARY,
          }}>🔍 Search Library</div>
          <div onClick={() => setShowManualAdd(true)} style={{
            flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: showManualAdd ? colors.AMBER_DIM : colors.BG_SECONDARY,
            border: `1px solid ${showManualAdd ? colors.AMBER : colors.BORDER_DEFAULT}`,
            color: showManualAdd ? colors.AMBER : colors.TEXT_TERTIARY,
          }}>✏️ Add Manually</div>
        </div>

        <div style={{ padding: '0 14px' }}>
          {!showManualAdd ? (
            /* ── Search Mode ── */
            <>
              <input placeholder="Search exercises..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus
                style={{ width: '100%', background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                  borderRadius: 12, padding: '12px 14px', fontSize: 13, color: colors.TEXT_PRIMARY, outline: 'none', marginBottom: 8 }} />

              {filteredExercises.length === 0 && searchTerm && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🤷</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>No exercises found</div>
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginBottom: 12 }}>Can't find "{searchTerm}"?</div>
                  <AppButton label="✏️ Add it Manually" onClick={() => { setShowManualAdd(true); setManualName(searchTerm); }} />
                </div>
              )}

              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {filteredExercises.map(ex => (
                  <div key={ex.id} onClick={() => addExerciseToDay(ex.id)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', cursor: 'pointer', borderRadius: 10, marginBottom: 4,
                    background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                    transition: 'all 0.15s',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.name}</div>
                      <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{ex.muscleGroup} · {ex.equipment}</div>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: colors.AMBER_DIM, border: `1px solid ${colors.AMBER_GLOW}`, color: colors.AMBER, fontSize: 16, fontWeight: 700,
                    }}>+</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ── Manual Add Mode ── */
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: 12, position: 'relative' }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>EXERCISE NAME *</label>
                <input placeholder="Start typing — e.g. Bench Press, Squat..." value={manualName} onChange={e => setManualName(e.target.value)} autoFocus
                  style={{ width: '100%', background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                    borderRadius: 12, padding: '12px 14px', fontSize: 14, color: colors.TEXT_PRIMARY, outline: 'none', fontWeight: 600 }} />

                {/* Live autocomplete suggestions */}
                {manualName.trim().length > 1 && (() => {
                  const suggestions = allExercises.filter(e =>
                    e.name.toLowerCase().includes(manualName.toLowerCase())
                  ).slice(0, 6);
                  if (suggestions.length === 0) return null;
                  return (
                    <div style={{
                      marginTop: 4, borderRadius: 10, overflow: 'hidden',
                      border: `0.5px solid ${colors.AMBER_GLOW}`, background: colors.BG_SECONDARY,
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, padding: '6px 10px', letterSpacing: 0.5, borderBottom: `0.5px solid ${colors.BORDER_DEFAULT}` }}>
                        💡 SUGGESTIONS — tap to add directly
                      </div>
                      {suggestions.map((ex, i) => (
                        <div key={ex.id} onClick={() => addExerciseToDay(ex.id)} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 10px', cursor: 'pointer',
                          borderBottom: i < suggestions.length - 1 ? `0.5px solid ${colors.BORDER_DEFAULT}` : 'none',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = colors.BG_TERTIARY}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{ex.name}</div>
                            <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY }}>{ex.muscleGroup} · {ex.equipment}</div>
                          </div>
                          <div style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                            background: colors.GREEN_DIM, color: colors.GREEN, border: `0.5px solid #34D39933`,
                          }}>+ Add</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* "Not in library" hint */}
                {manualName.trim().length > 2 && allExercises.filter(e =>
                  e.name.toLowerCase() === manualName.trim().toLowerCase()
                ).length === 0 && (
                  <div style={{ fontSize: 10, color: colors.AMBER, marginTop: 6, fontWeight: 600 }}>
                    ✨ "{manualName.trim()}" is new — fill in details below to save it
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>MUSCLE GROUP *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {MUSCLE_GROUPS.map(mg => (
                    <div key={mg} onClick={() => setManualMuscle(mg)} style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      background: manualMuscle === mg ? colors.AMBER_DIM : colors.BG_SECONDARY,
                      border: `1px solid ${manualMuscle === mg ? colors.AMBER : colors.BORDER_DEFAULT}`,
                      color: manualMuscle === mg ? colors.AMBER : colors.TEXT_TERTIARY,
                    }}>{mg}</div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>NOTES (optional)</label>
                <textarea placeholder="Add any notes about form, cues, or variations..." value={manualNotes} onChange={e => setManualNotes(e.target.value)} rows={3}
                  style={{ width: '100%', background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                    borderRadius: 12, padding: '12px 14px', fontSize: 13, color: colors.TEXT_PRIMARY, outline: 'none', resize: 'none' }} />
              </div>

              <AppButton label={manualSaving ? 'Saving...' : '✓ Save & Add Exercise'} onClick={saveManualExercise}
                loading={manualSaving} style={{ marginBottom: 8 }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Main Split View (Redesigned) ───
  return (
    <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{split?.name || 'My Split'}</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
              {workoutDays.length} workout days · {restDays.length} rest days
            </div>
          </div>
          <div onClick={openChangeSplit} style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.AMBER_DIM}, ${colors.BG_SECONDARY})`,
            border: `1px solid ${colors.AMBER_GLOW}`,
            color: colors.AMBER, cursor: 'pointer',
          }}>🔄 Change</div>
        </div>
      </div>

      {/* Day pills — horizontal scroll */}
      <div style={{ display: 'flex', gap: 6, padding: '0 14px 12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {days.sort((a, b) => a.displayOrder - b.displayOrder).map(day => {
          const isExpanded = expandedDay === day.id;
          return (
            <div key={day.id} onClick={() => setExpandedDay(isExpanded ? null : day.id)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              background: isExpanded
                ? (day.isRestDay ? colors.GREEN_DIM : colors.AMBER_DIM)
                : colors.BG_SECONDARY,
              border: `1px solid ${isExpanded
                ? (day.isRestDay ? '#34D399' : colors.AMBER)
                : colors.BORDER_DEFAULT}`,
              color: isExpanded
                ? (day.isRestDay ? colors.GREEN : colors.AMBER)
                : colors.TEXT_TERTIARY,
            }}>
              <span style={{ fontFamily: typography.FONT_MONO, marginRight: 4 }}>{day.dayOfWeek}</span>
              {day.isRestDay ? '😴' : day.label}
            </div>
          );
        })}
      </div>

      {/* Expanded Day Content */}
      {days.filter(d => expandedDay === d.id).map(day => (
        <div key={day.id} style={{ padding: '0 14px', animation: 'fadeIn 0.3s ease' }}>
          {/* Day Header Card */}
          <div style={{
            padding: '16px', borderRadius: 14, marginBottom: 10,
            background: `linear-gradient(135deg, ${day.isRestDay ? colors.GREEN_DIM : colors.AMBER_DIM} 0%, ${colors.BG_SECONDARY} 100%)`,
            border: `1px solid ${day.isRestDay ? '#34D39933' : colors.AMBER_GLOW}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                    background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                    fontFamily: typography.FONT_MONO, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                  }}>{day.dayOfWeek}</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{day.label}</span>
                </div>
                {day.muscleGroups && (
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 4, letterSpacing: 0.3 }}>
                    🎯 {day.muscleGroups}
                  </div>
                )}
              </div>
              {!day.isRestDay && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{
                    padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                    background: colors.BG_TERTIARY, color: colors.TEXT_PRIMARY,
                    fontFamily: typography.FONT_MONO,
                  }}>{day.exercises?.length || 0}</div>
                  <div onClick={() => navigate('/workout', { state: { splitDayId: day.id } })} style={{
                    padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                    background: colors.GREEN_DIM, border: `1px solid #34D39944`,
                    color: colors.GREEN, cursor: 'pointer',
                  }}>▶ Start Workout</div>
                </div>
              )}
            </div>
          </div>

          {day.isRestDay ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>😴</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.TEXT_SECONDARY }}>Rest Day</div>
              <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>Recovery is when you grow 💪</div>
            </div>
          ) : (
            <>
              {/* Exercise List */}
              {day.exercises && day.exercises.length > 0 ? (
                <div>
                  {day.exercises.map((ex, j) => {
                    const isHistoryOpen = expandedExercise === ex.exerciseId;
                    const history = exerciseHistory[ex.exerciseId] || [];
                    const groupedByDate = {};
                    history.slice(0, 15).forEach(set => {
                      const dateKey = new Date(set.loggedAt).toDateString();
                      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = { date: set.loggedAt, sets: [] };
                      groupedByDate[dateKey].sets.push(set);
                    });
                    const sessions = Object.values(groupedByDate).slice(0, 3);

                    return (
                      <div key={j} style={{
                        marginBottom: 6, borderRadius: 12, overflow: 'hidden',
                        border: `0.5px solid ${isHistoryOpen ? colors.AMBER_GLOW : colors.BORDER_DEFAULT}`,
                        background: colors.BG_SECONDARY,
                      }}>
                        {/* Exercise Row */}
                        <div style={{
                          display: 'flex', alignItems: 'center', padding: '12px 14px', cursor: 'pointer',
                          gap: 12,
                        }} onClick={() => toggleExerciseHistory(ex.exerciseId)}>
                          {/* Number badge */}
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, fontSize: 12, fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                            fontFamily: typography.FONT_MONO, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                            flexShrink: 0,
                          }}>{j + 1}</div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.exerciseName}</div>
                            <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
                              {ex.defaultSets} sets × {ex.defaultReps} reps
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 10, color: colors.AMBER }}>{isHistoryOpen ? '▼' : '▶'}</span>
                            <span onClick={(e) => { e.stopPropagation(); removeExerciseFromDay(day.id, ex.exerciseId); }}
                              style={{
                                width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'transparent', color: colors.RED, fontSize: 13, cursor: 'pointer',
                                border: `0.5px solid transparent`, transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = colors.RED_DIM; e.currentTarget.style.borderColor = '#F8717133'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                            >✕</span>
                          </div>
                        </div>

                        {/* History Panel */}
                        {isHistoryOpen && (
                          <div style={{
                            padding: '0 14px 12px', animation: 'fadeIn 0.2s ease',
                            borderTop: `0.5px solid ${colors.BORDER_DEFAULT}`,
                          }}>
                            {sessions.length === 0 ? (
                              <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, textAlign: 'center', padding: '12px 0' }}>
                                No history yet — this will be your first time! 💪
                              </div>
                            ) : (
                              <>
                                <div style={{ fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, padding: '10px 0 6px' }}>
                                  RECENT SESSIONS
                                </div>
                                {sessions.map((sess, si) => (
                                  <div key={si} style={{
                                    marginBottom: si < sessions.length - 1 ? 8 : 0,
                                    paddingBottom: si < sessions.length - 1 ? 8 : 0,
                                    borderBottom: si < sessions.length - 1 ? `0.5px solid ${colors.BORDER_DEFAULT}` : 'none',
                                  }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: colors.AMBER, marginBottom: 4 }}>
                                      📅 {formatHistoryDate(sess.date)}
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                      {sess.sets.sort((a, b) => a.setNumber - b.setNumber).map((set, k) => (
                                        <div key={k} style={{
                                          padding: '4px 8px', borderRadius: 6, fontSize: 10,
                                          background: set.isPr ? colors.GREEN_DIM : colors.BG_TERTIARY,
                                          border: `0.5px solid ${set.isPr ? '#34D39933' : colors.BORDER_DEFAULT}`,
                                          color: set.isPr ? colors.GREEN : colors.TEXT_SECONDARY,
                                          fontFamily: typography.FONT_MONO, fontWeight: 700,
                                        }}>
                                          {set.weightKg}kg × {set.reps} {set.isPr ? '🏆' : ''}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>No exercises yet — add some below</div>
                </div>
              )}

              {/* Add Exercise Button */}
              <div onClick={() => openAddExercise(day.id)} style={{
                marginTop: 6, padding: '10px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, color: colors.AMBER,
                border: `1.5px dashed ${colors.AMBER_GLOW}`,
                background: `linear-gradient(135deg, ${colors.AMBER_DIM} 0%, transparent 100%)`,
                transition: 'all 0.2s',
              }}>+ Add Exercise</div>
            </>
          )}
        </div>
      ))}

      {/* Show message if no day is selected */}
      {!expandedDay && (
        <div style={{ textAlign: 'center', padding: '30px 14px' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>👆</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.TEXT_SECONDARY }}>Select a day above</div>
          <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY }}>Tap on a day pill to view exercises</div>
        </div>
      )}
    </div>
  );
}
