import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../common/context/AuthContext';
import AppCard from '../../../common/components/AppCard';
import AppButton from '../../../common/components/AppButton';
import RestTimer from '../components/RestTimer';
import PRBanner from '../components/PRBanner';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';
import api from '../../../services/api';

export default function WorkoutScreen() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const passedSplitDayId = location.state?.splitDayId;

  const [session, setSession] = useState(null);
  const [dayExercises, setDayExercises] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [prEvent, setPrEvent] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  // Split picker state
  const [split, setSplit] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState(passedSplitDayId || null);
  const [splitLoading, setSplitLoading] = useState(true);

  // Exercise-level state
  const [exerciseHistory, setExerciseHistory] = useState({});
  const [expandedHistory, setExpandedHistory] = useState(null);
  // Dynamic sets: { exerciseId: count }
  const [setsCounts, setSetsCounts] = useState({});

  // Load active split for the day picker
  useEffect(() => {
    api.get('/splits/active').then(r => {
      const s = r.data.data;
      setSplit(s);
      if (passedSplitDayId && s?.days) {
        const day = s.days.find(d => d.id === passedSplitDayId);
        if (day?.exercises) {
          setDayExercises(day.exercises);
          initSetsCounts(day.exercises);
        }
        setSelectedDayId(passedSplitDayId);
      }
      setSplitLoading(false);
    }).catch(() => setSplitLoading(false));
  }, [passedSplitDayId]);

  // Check for active session on mount
  useEffect(() => {
    api.get('/workouts/active').then(r => {
      if (r.data.data) {
        setSession(r.data.data);
        if (r.data.data.id) {
          api.get(`/workouts/${r.data.data.id}/sets`).then(res => {
            const sets = res.data.data || [];
            const logged = {};
            sets.forEach(s => { logged[`${s.exerciseId}-${s.setNumber}`] = s; });
            setCompletedSets(logged);
          });
        }
        if (r.data.data.splitDayId) {
          setSelectedDayId(r.data.data.splitDayId);
          api.get('/splits/active').then(sr => {
            const sp = sr.data.data;
            if (sp?.days) {
              const day = sp.days.find(d => d.id === r.data.data.splitDayId);
              if (day?.exercises) {
                setDayExercises(day.exercises);
                initSetsCounts(day.exercises);
              }
            }
          });
        }
      }
    });
  }, []);

  const initSetsCounts = (exercises) => {
    const counts = {};
    exercises.forEach(ex => { counts[ex.exerciseId] = ex.defaultSets || 3; });
    setSetsCounts(counts);
  };

  // Fetch exercise history when exercises load
  useEffect(() => {
    if (dayExercises.length === 0) return;
    dayExercises.forEach(ex => {
      if (!exerciseHistory[ex.exerciseId]) {
        api.get(`/workouts/exercise-history/${ex.exerciseId}`).then(r => {
          setExerciseHistory(prev => ({ ...prev, [ex.exerciseId]: r.data.data || [] }));
        }).catch(() => {});
      }
    });
  }, [dayExercises]);

  const selectDay = (dayId) => {
    setSelectedDayId(dayId);
    if (split?.days) {
      const day = split.days.find(d => d.id === dayId);
      if (day?.exercises) {
        setDayExercises(day.exercises);
        initSetsCounts(day.exercises);
      }
    }
  };

  // Elapsed time ticker
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => {
      const start = new Date(session.startTime);
      setElapsedTime(Math.floor((Date.now() - start.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [session]);

  const startWorkout = async () => {
    setLoading(true);
    try {
      const body = selectedDayId ? { splitDayId: selectedDayId } : {};
      const r = await api.post('/workouts/start', body);
      setSession(r.data.data);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to start workout');
    }
    setLoading(false);
  };

  const logSet = async (exerciseId, exerciseName, setNumber, weight, reps) => {
    if (!session) return;
    try {
      const r = await api.post(`/workouts/${session.id}/sets`, {
        exerciseId, setNumber, weightKg: weight, reps,
      });
      const data = r.data.data;
      const key = `${exerciseId}-${setNumber}`;
      setCompletedSets(prev => ({ ...prev, [key]: data }));
      setShowRestTimer(true);
      if (data.isPr) {
        setPrEvent({ exerciseName: data.exerciseName || exerciseName, weight, reps });
        setTimeout(() => setPrEvent(null), 5000);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to log set');
    }
  };

  const endWorkout = async () => {
    if (!session) return;
    if (!confirm('End this workout?')) return;
    setLoading(true);
    try {
      await api.post(`/workouts/${session.id}/end`);
      navigate('/');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to end workout');
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const formatHistoryDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = d.toLocaleDateString('en-IN', { weekday: 'short' });
    return `${day}, ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  };

  const addSet = (exerciseId) => {
    setSetsCounts(prev => ({ ...prev, [exerciseId]: (prev[exerciseId] || 3) + 1 }));
  };

  const removeSet = (exerciseId) => {
    setSetsCounts(prev => {
      const current = prev[exerciseId] || 3;
      if (current <= 1) return prev;
      return { ...prev, [exerciseId]: current - 1 };
    });
  };

  // Get last session summary for an exercise
  const getLastSessionSummary = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    if (history.length === 0) return null;
    // Group by date — get the most recent session
    const grouped = {};
    history.forEach(set => {
      const dateKey = new Date(set.loggedAt).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = { date: set.loggedAt, sets: [] };
      grouped[dateKey].sets.push(set);
    });
    const sessions = Object.values(grouped);
    if (sessions.length === 0) return null;
    const lastSession = sessions[0]; // most recent
    const totalSets = lastSession.sets.length;
    const avgWeight = (lastSession.sets.reduce((s, set) => s + (set.weightKg || 0), 0) / totalSets).toFixed(1);
    const avgReps = Math.round(lastSession.sets.reduce((s, set) => s + (set.reps || 0), 0) / totalSets);
    return { totalSets, avgWeight, avgReps, date: lastSession.date };
  };

  // Get previous set data for "Last Time" column
  const getPreviousSetData = (exerciseId, setNumber) => {
    const history = exerciseHistory[exerciseId] || [];
    const matchingSet = history.find(s => s.setNumber === setNumber);
    if (matchingSet) return { weight: matchingSet.weightKg, reps: matchingSet.reps };
    return null;
  };

  const days = split?.days?.filter(d => !d.isRestDay).sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const cellBase = {
    borderRadius: 10, padding: '10px 6px', textAlign: 'center',
    fontFamily: typography.FONT_MONO, fontSize: 14, fontWeight: 800,
    border: `0.5px solid ${colors.BORDER_DEFAULT}`, width: '100%',
    outline: 'none', background: colors.BG_TERTIARY, color: colors.TEXT_PRIMARY,
  };

  // ─── No active session: Split Day Picker + Start ───
  if (!session) {
    return (
      <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ padding: '14px 16px 6px' }}>
          <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Start Workout</div>
          <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>Choose your workout for today</div>
        </div>

        {splitLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: colors.TEXT_TERTIARY, animation: 'pulse 1.5s infinite' }}>Loading splits...</div>
        ) : days.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 14px' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>No split set up</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 16 }}>Set up your training split first</div>
            <AppButton label="Go to My Split →" onClick={() => navigate('/split')} />
          </div>
        ) : (
          <>
            <div style={{ padding: '6px 14px 4px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 8 }}>
                {split?.name?.toUpperCase() || 'YOUR SPLIT'} — SELECT A WORKOUT
              </div>
            </div>

            <div style={{ padding: '0 14px' }}>
              {days.map((day, i) => {
                const isSelected = selectedDayId === day.id;
                return (
                  <AppCard key={day.id} onClick={() => selectDay(day.id)} style={{
                    padding: '14px 16px', cursor: 'pointer',
                    border: isSelected ? `1.5px solid ${colors.AMBER}` : `0.5px solid ${colors.BORDER_DEFAULT}`,
                    background: isSelected ? colors.AMBER_DIM : colors.BG_SECONDARY,
                    animation: `fadeIn ${0.15 + i * 0.05}s ease`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: isSelected ? colors.AMBER_DIM : colors.BG_TERTIARY,
                        border: `0.5px solid ${isSelected ? colors.AMBER_GLOW : colors.BORDER_DEFAULT}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: isSelected ? colors.AMBER : colors.TEXT_TERTIARY,
                        fontFamily: typography.FONT_MONO,
                      }}>{day.dayOfWeek}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800 }}>{day.label}</div>
                        {day.muscleGroups && <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, marginTop: 2 }}>{day.muscleGroups}</div>}
                        <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
                          {day.exercises?.length || 0} exercises · {day.exercises?.reduce((s, e) => s + (e.defaultSets || 0), 0) || 0} sets
                        </div>
                      </div>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: isSelected ? `2px solid ${colors.AMBER}` : `1px solid ${colors.BORDER_DEFAULT}`,
                        background: isSelected ? colors.AMBER : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: isSelected ? '#000' : colors.TEXT_TERTIARY,
                      }}>{isSelected ? '✓' : ''}</div>
                    </div>
                  </AppCard>
                );
              })}
            </div>

            {selectedDayId && dayExercises.length > 0 && (
              <div style={{ padding: '6px 14px 0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 1, marginBottom: 6, marginTop: 4 }}>
                  EXERCISES ({dayExercises.length})
                </div>
                <AppCard style={{ padding: '10px 14px' }}>
                  {dayExercises.map((ex, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '5px 0',
                      borderBottom: i < dayExercises.length - 1 ? `0.5px solid ${colors.BORDER_DEFAULT}` : 'none',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{ex.exerciseName}</span>
                      <span style={{ fontSize: 11, color: colors.TEXT_TERTIARY, fontFamily: typography.FONT_MONO }}>
                        {ex.defaultSets}×{ex.defaultReps}
                      </span>
                    </div>
                  ))}
                </AppCard>
              </div>
            )}

            <div style={{ padding: '14px 14px 0' }}>
              <AppButton
                label={selectedDayId ? `Start Workout 💪` : 'Select a workout above'}
                onClick={startWorkout} loading={loading}
                style={{ opacity: selectedDayId ? 1 : 0.5, pointerEvents: selectedDayId ? 'auto' : 'none' }}
              />
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <span onClick={() => { setSelectedDayId(null); setDayExercises([]); startWorkout(); }}
                  style={{ fontSize: 11, color: colors.TEXT_TERTIARY, cursor: 'pointer', textDecoration: 'underline' }}>
                  or start a quick empty workout
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Active session: Redesigned Workout UI ───
  const totalSets = dayExercises.reduce((sum, ex) => sum + (setsCounts[ex.exerciseId] || ex.defaultSets || 3), 0);
  const completedCount = Object.keys(completedSets).length;

  return (
    <div style={{ paddingBottom: 80, animation: 'fadeIn 0.3s ease' }}>
      {/* Sticky Header */}
      <div style={{
        padding: '10px 16px 12px', position: 'sticky', top: 0, zIndex: 10,
        background: `linear-gradient(180deg, ${colors.BG_PRIMARY} 80%, transparent)`,
        backdropFilter: 'blur(10px)',
      }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>{session.splitDayLabel || 'Quick Workout'}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 3, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: colors.TEXT_TERTIARY, fontFamily: typography.FONT_MONO }}>⏱ {formatTime(elapsedTime)}</span>
              <span style={{ fontSize: 11, color: colors.GREEN, fontWeight: 700 }}>{completedCount}/{totalSets} sets</span>
            </div>
          </div>
          <Badge label="LIVE" variant="green" style={{ animation: 'blink 1.2s infinite' }} />
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: colors.BG_TERTIARY, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width 0.4s ease',
            background: `linear-gradient(90deg, ${colors.GREEN}, ${colors.AMBER})`,
            width: totalSets > 0 ? `${(completedCount / totalSets) * 100}%` : '0%',
          }} />
        </div>
      </div>

      {prEvent && <PRBanner exerciseName={prEvent.exerciseName} weight={prEvent.weight} reps={prEvent.reps} />}
      {showRestTimer && (
        <RestTimer seconds={90} onComplete={() => setShowRestTimer(false)} onSkip={() => setShowRestTimer(false)} />
      )}

      {/* Exercise Cards */}
      <div style={{ padding: '0 14px' }}>
        {dayExercises.map((ex, exIdx) => {
          const numSets = setsCounts[ex.exerciseId] || ex.defaultSets || 3;
          const lastSummary = getLastSessionSummary(ex.exerciseId);
          const allDone = Array.from({ length: numSets }, (_, i) => `${ex.exerciseId}-${i + 1}`).every(k => completedSets[k]);
          const isHistoryOpen = expandedHistory === ex.exerciseId;
          const history = exerciseHistory[ex.exerciseId] || [];

          // Group history for expanded view
          const groupedByDate = {};
          history.slice(0, 15).forEach(set => {
            const dateKey = new Date(set.loggedAt).toDateString();
            if (!groupedByDate[dateKey]) groupedByDate[dateKey] = { date: set.loggedAt, sets: [] };
            groupedByDate[dateKey].sets.push(set);
          });
          const histSessions = Object.values(groupedByDate).slice(0, 3);

          return (
            <div key={ex.exerciseId || exIdx} style={{
              marginBottom: 12, borderRadius: 14, overflow: 'hidden',
              border: `0.5px solid ${allDone ? '#34D39944' : colors.BORDER_DEFAULT}`,
              background: allDone
                ? `linear-gradient(135deg, ${colors.GREEN_DIM} 0%, ${colors.BG_SECONDARY} 100%)`
                : colors.BG_SECONDARY,
              animation: `fadeIn ${0.15 + exIdx * 0.05}s ease`,
            }}>
              {/* Exercise Header */}
              <div style={{ padding: '14px 16px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: allDone ? colors.GREEN_DIM : colors.AMBER_DIM,
                        color: allDone ? colors.GREEN : colors.AMBER,
                        border: `0.5px solid ${allDone ? '#34D39933' : colors.AMBER_GLOW}`,
                        fontFamily: typography.FONT_MONO,
                      }}>{exIdx + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{ex.exerciseName}</div>
                      {allDone && <span style={{ fontSize: 14 }}>✅</span>}
                    </div>

                    {/* Last session summary */}
                    {lastSummary ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginTop: 6,
                        fontSize: 11, color: colors.TEXT_TERTIARY,
                      }}>
                        <span style={{ fontWeight: 700, color: colors.AMBER }}>Last:</span>
                        <span style={{ fontFamily: typography.FONT_MONO, fontWeight: 700 }}>
                          {lastSummary.avgWeight}kg × {lastSummary.avgReps} reps × {lastSummary.totalSets} sets
                        </span>
                        <span style={{ fontSize: 9, opacity: 0.6 }}>({formatHistoryDate(lastSummary.date)})</span>
                      </div>
                    ) : (
                      <div style={{ marginTop: 4, fontSize: 10, color: colors.TEXT_TERTIARY }}>First time — no previous data 💪</div>
                    )}
                  </div>

                  {/* History toggle */}
                  <div onClick={() => setExpandedHistory(isHistoryOpen ? null : ex.exerciseId)} style={{
                    padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: 'pointer',
                    background: isHistoryOpen ? colors.AMBER_DIM : colors.BG_TERTIARY,
                    border: `0.5px solid ${isHistoryOpen ? colors.AMBER : colors.BORDER_DEFAULT}`,
                    color: isHistoryOpen ? colors.AMBER : colors.TEXT_TERTIARY,
                  }}>📊</div>
                </div>

                {/* Expanded History */}
                {isHistoryOpen && (
                  <div style={{
                    marginTop: 8, padding: '8px 10px', borderRadius: 10,
                    background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    {histSessions.length === 0 ? (
                      <div style={{ fontSize: 11, color: colors.TEXT_TERTIARY, textAlign: 'center', padding: '6px 0' }}>
                        No history yet
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.5, marginBottom: 6 }}>RECENT SESSIONS</div>
                        {histSessions.map((sess, si) => (
                          <div key={si} style={{
                            marginBottom: si < histSessions.length - 1 ? 6 : 0,
                            paddingBottom: si < histSessions.length - 1 ? 6 : 0,
                            borderBottom: si < histSessions.length - 1 ? `0.5px solid ${colors.BORDER_DEFAULT}` : 'none',
                          }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: colors.AMBER, marginBottom: 3 }}>
                              📅 {formatHistoryDate(sess.date)}
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {sess.sets.sort((a, b) => a.setNumber - b.setNumber).map((set, k) => (
                                <div key={k} style={{
                                  padding: '3px 7px', borderRadius: 6, fontSize: 10,
                                  background: set.isPr ? colors.GREEN_DIM : `${colors.BG_PRIMARY}`,
                                  border: `0.5px solid ${set.isPr ? '#34D39933' : colors.BORDER_DEFAULT}`,
                                  color: set.isPr ? colors.GREEN : colors.TEXT_SECONDARY,
                                  fontFamily: typography.FONT_MONO, fontWeight: 700,
                                }}>
                                  {set.weightKg}kg×{set.reps} {set.isPr ? '🏆' : ''}
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

              {/* Column Headers */}
              <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 6 }}>
                <div style={{ width: 32, fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, letterSpacing: 0.3 }}>SET</div>
                <div style={{ flex: 1.2, fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, textAlign: 'center', letterSpacing: 0.3 }}>PREVIOUS</div>
                <div style={{ flex: 1, fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, textAlign: 'center', letterSpacing: 0.3 }}>KG</div>
                <div style={{ flex: 1, fontSize: 9, fontWeight: 800, color: colors.TEXT_TERTIARY, textAlign: 'center', letterSpacing: 0.3 }}>REPS</div>
                <div style={{ width: 38 }} />
              </div>

              {/* Set Rows */}
              {Array.from({ length: numSets }, (_, setIdx) => {
                const setNum = setIdx + 1;
                const key = `${ex.exerciseId}-${setNum}`;
                const logged = completedSets[key];
                const prev = getPreviousSetData(ex.exerciseId, setNum);
                const isDone = !!logged;

                return (
                  <SetRowInline
                    key={key}
                    setNumber={setNum}
                    previousWeight={prev?.weight}
                    previousReps={prev?.reps}
                    targetWeight={logged?.overloadSuggestion?.suggestedWeight || prev?.weight || ''}
                    targetReps={ex.defaultReps}
                    isDone={isDone}
                    isPR={logged?.isPr}
                    onComplete={(weight, reps) => logSet(ex.exerciseId, ex.exerciseName, setNum, weight, reps)}
                  />
                );
              })}

              {/* Add/Remove Set Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 16px 12px' }}>
                <div onClick={() => removeSet(ex.exerciseId)} style={{
                  padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  background: colors.BG_TERTIARY, color: colors.RED, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                  opacity: numSets <= 1 ? 0.3 : 1, pointerEvents: numSets <= 1 ? 'none' : 'auto',
                }}>− Remove Set</div>
                <div onClick={() => addSet(ex.exerciseId)} style={{
                  padding: '5px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  background: colors.AMBER_DIM, color: colors.AMBER, border: `0.5px solid ${colors.AMBER_GLOW}`,
                }}>+ Add Set</div>
              </div>
            </div>
          );
        })}

        {dayExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.TEXT_SECONDARY, marginBottom: 4 }}>No exercises loaded</div>
            <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY }}>
              Go to your Split and start a workout from there.
            </div>
          </div>
        )}
      </div>

      {/* Sticky End Workout Button */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 14px 16px', zIndex: 20,
        background: `linear-gradient(0deg, ${colors.BG_PRIMARY} 70%, transparent)`,
      }}>
        <AppButton label="End Workout ✓" variant="outline" onClick={endWorkout} loading={loading} />
      </div>
    </div>
  );
}

// ─── Inline SetRow (replaces the separate component) ───
function SetRowInline({ setNumber, previousWeight, previousReps, targetWeight, targetReps, isDone: initDone, isPR, onComplete }) {
  const [weight, setWeight] = useState(targetWeight || '');
  const [reps, setReps] = useState(targetReps || '');
  const [done, setDone] = useState(initDone || false);

  const complete = () => {
    if (!weight || !reps) return;
    setDone(true);
    onComplete?.(Number(weight), Number(reps));
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '3px 16px', marginBottom: 4,
      background: done ? `${colors.GREEN_DIM}33` : 'transparent',
      transition: 'background 0.3s',
    }}>
      {/* Set number badge */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, fontFamily: typography.FONT_MONO,
        background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
        color: done ? colors.GREEN : colors.TEXT_TERTIARY,
        border: `0.5px solid ${done ? '#34D39933' : colors.BORDER_DEFAULT}`,
      }}>S{setNumber}</div>

      {/* Previous data */}
      <div style={{
        flex: 1.2, borderRadius: 8, padding: '6px 4px', textAlign: 'center',
        fontSize: 11, fontFamily: typography.FONT_MONO, fontWeight: 700,
        background: colors.BG_TERTIARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
        color: colors.TEXT_TERTIARY,
      }}>
        {previousWeight ? (
          <span>{previousWeight}kg × {previousReps}</span>
        ) : (
          <span style={{ fontSize: 9, opacity: 0.6 }}>— first —</span>
        )}
      </div>

      {/* Weight input */}
      <input
        type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" disabled={done}
        style={{
          flex: 1, borderRadius: 10, padding: '10px 6px', textAlign: 'center',
          fontFamily: typography.FONT_MONO, fontSize: 14, fontWeight: 800, width: '100%', outline: 'none',
          background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
          color: done ? colors.GREEN : colors.TEXT_PRIMARY,
          border: `0.5px solid ${done ? '#34D39933' : colors.BORDER_DEFAULT}`,
          opacity: done ? 0.7 : 1,
        }}
      />

      {/* Reps input */}
      <input
        type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="reps" disabled={done}
        style={{
          flex: 1, borderRadius: 10, padding: '10px 6px', textAlign: 'center',
          fontFamily: typography.FONT_MONO, fontSize: 14, fontWeight: 800, width: '100%', outline: 'none',
          background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
          color: done ? colors.GREEN : colors.TEXT_PRIMARY,
          border: `0.5px solid ${done ? '#34D39933' : colors.BORDER_DEFAULT}`,
          opacity: done ? 0.7 : 1,
        }}
      />

      {/* Complete button */}
      <div onClick={complete} style={{
        width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: done ? 'default' : 'pointer', fontSize: 15, fontWeight: 800,
        background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
        border: `0.5px solid ${done ? '#34D39933' : colors.BORDER_DEFAULT}`,
        color: done ? colors.GREEN : colors.TEXT_TERTIARY,
        transition: 'all 0.2s',
      }}>
        {done ? '✓' : '○'}
      </div>
    </div>
  );
}
