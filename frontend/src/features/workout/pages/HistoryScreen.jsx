import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppCard from '../../../common/components/AppCard';
import AppButton from '../../../common/components/AppButton';
import Badge from '../../../common/components/Badge';
import { colors, typography } from '../../../theme';
import api from '../../../services/api';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);
  const [sessionSets, setSessionSets] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => { loadHistory(0); }, []);

  const loadHistory = async (p) => {
    try {
      const r = await api.get(`/workouts/history?page=${p}&size=50`);
      const data = r.data.data || [];
      if (p === 0) setAllSessions(data);
      else setAllSessions(prev => [...prev, ...data]);
      setHasMore(r.data.pagination?.hasNext || false);
      setPage(p);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleSession = async (sessionId) => {
    if (expandedSession === sessionId) { setExpandedSession(null); return; }
    setExpandedSession(sessionId);
    if (!sessionSets[sessionId]) {
      try {
        const r = await api.get(`/workouts/${sessionId}/sets`);
        setSessionSets(prev => ({ ...prev, [sessionId]: r.data.data || [] }));
      } catch (e) { console.error(e); }
    }
  };

  // Format date as "14 March 2026"
  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Get the day name
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0)) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { weekday: 'long' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return '';
    const mins = Math.floor((new Date(end) - new Date(start)) / 60000);
    if (mins < 60) return `${mins}min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}min`;
  };

  const groupSetsByExercise = (sets) => {
    const groups = {};
    sets.forEach(s => {
      const name = s.exerciseName || s.exerciseId;
      if (!groups[name]) groups[name] = [];
      groups[name].push(s);
    });
    return groups;
  };

  // Filter sessions
  const filtered = search.trim()
    ? allSessions.filter(s =>
        (s.splitDayLabel || '').toLowerCase().includes(search.toLowerCase()) ||
        formatFullDate(s.startTime).toLowerCase().includes(search.toLowerCase()) ||
        getDayName(s.startTime).toLowerCase().includes(search.toLowerCase())
      )
    : allSessions;

  // Group filtered sessions by date
  const groupedByDate = {};
  filtered.forEach(session => {
    const dateKey = new Date(session.startTime).toDateString();
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        dateStr: session.startTime,
        fullDate: formatFullDate(session.startTime),
        dayName: getDayName(session.startTime),
        sessions: [],
      };
    }
    groupedByDate[dateKey].sessions.push(session);
  });
  const dateGroups = Object.values(groupedByDate);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
          <div style={{ fontSize: 14, color: colors.TEXT_TERTIARY, fontWeight: 600 }}>Loading history...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 20, animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div onClick={() => navigate(-1)} style={{ fontSize: 12, color: colors.AMBER, cursor: 'pointer', fontWeight: 700, marginBottom: 4 }}>← Back</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Workout History</div>
        <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginTop: 2 }}>
          {allSessions.length} sessions · {dateGroups.length} days
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 14px 10px' }}>
        <input
          placeholder="🔍 Search by workout name, date, or day..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: colors.BG_SECONDARY, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
            borderRadius: 12, padding: '11px 14px', fontSize: 13, color: colors.TEXT_PRIMARY, outline: 'none',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 14px' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>{search ? '🔍' : '📝'}</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
            {search ? 'No matching workouts' : 'No workouts yet'}
          </div>
          <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, marginBottom: 20 }}>
            {search ? 'Try a different search term' : 'Complete your first workout to see it here'}
          </div>
          {!search && <AppButton label="Start Workout →" onClick={() => navigate('/workout')} />}
        </div>
      ) : (
        <div style={{ padding: '0 14px' }}>
          {dateGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 16, animation: `fadeIn ${0.15 + gi * 0.04}s ease` }}>
              {/* ─── Date Header ─── */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 8, marginBottom: 6,
                borderBottom: `1px solid ${colors.BORDER_DEFAULT}`,
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>
                    {group.fullDate}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, marginTop: 2,
                    color: group.dayName === 'Today' ? colors.GREEN : group.dayName === 'Yesterday' ? colors.AMBER : colors.TEXT_TERTIARY,
                  }}>
                    {group.dayName}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800,
                  background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                  fontFamily: typography.FONT_MONO, border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                }}>
                  {group.sessions.length} session{group.sessions.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* ─── Sessions under this date ─── */}
              {group.sessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const sets = sessionSets[session.id] || [];
                const grouped = groupSetsByExercise(sets);
                const prCount = sets.filter(s => s.isPr).length;

                return (
                  <div key={session.id} style={{ marginBottom: 6 }}>
                    {/* Session Card */}
                    <div onClick={() => toggleSession(session.id)} style={{
                      padding: '12px 14px', cursor: 'pointer',
                      borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                      background: colors.BG_SECONDARY,
                      border: `0.5px solid ${isExpanded ? colors.AMBER_GLOW : colors.BORDER_DEFAULT}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: colors.AMBER_DIM, border: `0.5px solid ${colors.AMBER_GLOW}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 14,
                            }}>🏋️</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800 }}>{session.splitDayLabel || 'Quick Workout'}</div>
                              <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY, marginTop: 1 }}>
                                {formatTime(session.startTime)}
                              </div>
                            </div>
                          </div>

                          {/* Stats row */}
                          <div style={{ display: 'flex', gap: 10, marginTop: 6, marginLeft: 40 }}>
                            {session.endTime && (
                              <div style={{
                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                              }}>⏱ {formatDuration(session.startTime, session.endTime)}</div>
                            )}
                            {session.totalVolumeKg > 0 && (
                              <div style={{
                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                background: colors.BG_TERTIARY, color: colors.TEXT_TERTIARY,
                              }}>📊 {Number(session.totalVolumeKg).toLocaleString()}kg</div>
                            )}
                            {prCount > 0 && (
                              <div style={{
                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                background: colors.GREEN_DIM, color: colors.GREEN,
                              }}>🏆 {prCount} PR{prCount > 1 ? 's' : ''}</div>
                            )}
                          </div>
                        </div>

                        <div style={{
                          fontSize: 12, color: isExpanded ? colors.AMBER : colors.TEXT_TERTIARY,
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}>▶</div>
                      </div>
                    </div>

                    {/* ─── Expanded Detail View ─── */}
                    {isExpanded && (
                      <div style={{
                        background: colors.BG_TERTIARY,
                        borderRadius: '0 0 12px 12px',
                        border: `0.5px solid ${colors.AMBER_GLOW}`, borderTop: 'none',
                        padding: '12px 14px', animation: 'fadeIn 0.2s ease',
                      }}>
                        {sets.length === 0 ? (
                          <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY, textAlign: 'center', padding: 12, animation: 'pulse 1.5s infinite' }}>
                            Loading workout details...
                          </div>
                        ) : (
                          <>
                            {/* Summary Stats */}
                            <div style={{
                              display: 'flex', gap: 8, marginBottom: 12, padding: '8px 10px',
                              background: colors.BG_SECONDARY, borderRadius: 10,
                              border: `0.5px solid ${colors.BORDER_DEFAULT}`,
                            }}>
                              <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: typography.FONT_MONO }}>{Object.keys(grouped).length}</div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: colors.TEXT_TERTIARY }}>EXERCISES</div>
                              </div>
                              <div style={{ width: 1, background: colors.BORDER_DEFAULT }} />
                              <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: typography.FONT_MONO }}>{sets.length}</div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: colors.TEXT_TERTIARY }}>TOTAL SETS</div>
                              </div>
                              <div style={{ width: 1, background: colors.BORDER_DEFAULT }} />
                              <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: typography.FONT_MONO, color: colors.AMBER }}>
                                  {Number(session.totalVolumeKg || 0).toLocaleString()}
                                </div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: colors.TEXT_TERTIARY }}>VOLUME (KG)</div>
                              </div>
                            </div>

                            {/* Exercise Details */}
                            {Object.entries(grouped).map(([exerciseName, exerciseSets], idx) => {
                              const totalVolume = exerciseSets.reduce((s, set) => s + (set.weightKg * set.reps), 0);
                              const hasPr = exerciseSets.some(s => s.isPr);

                              return (
                                <div key={idx} style={{
                                  marginBottom: idx < Object.keys(grouped).length - 1 ? 10 : 0,
                                  borderRadius: 10, overflow: 'hidden',
                                  border: `0.5px solid ${hasPr ? '#34D39933' : colors.BORDER_DEFAULT}`,
                                  background: colors.BG_SECONDARY,
                                }}>
                                  {/* Exercise Name Header */}
                                  <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '8px 10px',
                                    borderBottom: `0.5px solid ${colors.BORDER_DEFAULT}`,
                                    background: hasPr ? `${colors.GREEN_DIM}` : 'transparent',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <div style={{
                                        width: 20, height: 20, borderRadius: 5, fontSize: 9, fontWeight: 800,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: colors.AMBER_DIM, color: colors.AMBER,
                                        fontFamily: typography.FONT_MONO,
                                      }}>{idx + 1}</div>
                                      <span style={{ fontSize: 13, fontWeight: 800 }}>{exerciseName}</span>
                                      {hasPr && <span style={{ fontSize: 12 }}>🏆</span>}
                                    </div>
                                    <span style={{ fontSize: 10, color: colors.TEXT_TERTIARY, fontFamily: typography.FONT_MONO, fontWeight: 700 }}>
                                      {exerciseSets.length} sets · {totalVolume.toFixed(0)}kg
                                    </span>
                                  </div>

                                  {/* Set Rows */}
                                  {exerciseSets.sort((a, b) => a.setNumber - b.setNumber).map((set, si) => (
                                    <div key={si} style={{
                                      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                                      borderBottom: si < exerciseSets.length - 1 ? `0.5px solid ${colors.BORDER_DEFAULT}` : 'none',
                                    }}>
                                      <div style={{
                                        width: 24, fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY,
                                        fontFamily: typography.FONT_MONO,
                                      }}>S{set.setNumber}</div>
                                      <div style={{
                                        flex: 1, fontSize: 13, fontWeight: 800, fontFamily: typography.FONT_MONO,
                                        color: set.isPr ? colors.GREEN : colors.TEXT_PRIMARY,
                                      }}>
                                        {set.weightKg}kg
                                      </div>
                                      <div style={{ fontSize: 12, color: colors.TEXT_TERTIARY }}>×</div>
                                      <div style={{
                                        flex: 1, fontSize: 13, fontWeight: 800, fontFamily: typography.FONT_MONO,
                                        color: set.isPr ? colors.GREEN : colors.TEXT_PRIMARY,
                                      }}>
                                        {set.reps} reps
                                      </div>
                                      <div style={{
                                        fontSize: 10, color: colors.TEXT_TERTIARY, fontFamily: typography.FONT_MONO,
                                      }}>
                                        = {(set.weightKg * set.reps).toFixed(0)}kg
                                      </div>
                                      {set.isPr && <span style={{ fontSize: 10 }}>🏆</span>}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {hasMore && (
            <div style={{ padding: '10px 0' }}>
              <AppButton label="Load More" variant="outline" onClick={() => loadHistory(page + 1)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
