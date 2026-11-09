import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { getExerciseProgress, getExerciseSessionHistory } from '../../../services/apiClient';

const cardClass = 'rounded-2xl border border-white/10 bg-white/[0.04]';
const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function StrengthTrend({ sessions }) {
  const recent = sessions.slice(0, 8).reverse();
  const maximum = Math.max(1, ...recent.map((session) => Number(session.bestWeightKg) || 0));

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-bold text-white/80">Best weight by session</h3>
      <div className="grid h-40 items-end gap-2 border-b border-white/10 pb-2" style={{ gridTemplateColumns: `repeat(${recent.length}, minmax(0, 1fr))` }}>
        {recent.map((session) => {
          const weight = Number(session.bestWeightKg) || 0;
          return (
            <div key={session.sessionId} className="flex h-full flex-col items-center justify-end gap-2" title={`${formatDate(session.startTime)}: ${numberFormatter.format(weight)} kg`}>
              <span className="text-xs tabular-nums text-white/70">{numberFormatter.format(weight)}</span>
              <div className="flex h-24 w-full max-w-20 items-end rounded-t-lg bg-white/[0.04]">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400" style={{ height: `${weight > 0 ? Math.max(5, (weight / maximum) * 100) : 0}%` }} />
              </div>
              <span className="text-center text-[10px] text-white/50">{new Date(session.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExerciseProgress() {
  const [searchParams] = useSearchParams();
  const requestedExerciseId = searchParams.get('exerciseId');
  const [exercises, setExercises] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getExerciseProgress()
      .then((response) => {
        if (cancelled) return;
        const items = response.data?.data || [];
        setExercises(items);
        setHistoryLoading(items.length > 0);
        setSelectedId((current) => {
          if (items.some((item) => item.exerciseId === current)) return current;
          if (items.some((item) => item.exerciseId === requestedExerciseId)) return requestedExerciseId;
          return items[0]?.exerciseId || '';
        });
      })
      .catch(() => {
        if (!cancelled) setListError('Could not load exercise progress.');
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey, requestedExerciseId]);

  useEffect(() => {
    if (!selectedId) return undefined;
    let cancelled = false;
    getExerciseSessionHistory(selectedId)
      .then((response) => {
        if (!cancelled) setSessions(response.data?.data || []);
      })
      .catch(() => {
        if (!cancelled) setHistoryError('Could not load sessions for this exercise.');
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedId, reloadKey]);

  const selectExercise = (event) => {
    setSelectedId(event.target.value);
    setSessions([]);
    setHistoryError('');
    setHistoryLoading(true);
  };

  const retry = () => {
    setListError('');
    setHistoryError('');
    setListLoading(true);
    setHistoryLoading(Boolean(selectedId));
    setReloadKey((value) => value + 1);
  };

  const selected = exercises.find((exercise) => exercise.exerciseId === selectedId);

  return (
    <section className={`${cardClass} mb-6 p-5 md:p-7`} aria-labelledby="exercise-progress-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="exercise-progress-title" className="text-xl font-bold">Exercise progress</h2>
          <p className="mt-1 text-sm text-white/50">See every completed session for each exercise.</p>
        </div>
        {exercises.length > 0 && (
          <div className="w-full sm:w-72">
            <label htmlFor="progress-exercise" className="mb-1 block text-xs font-semibold text-white/60">Choose exercise</label>
            <select id="progress-exercise" value={selectedId} onChange={selectExercise} className="w-full rounded-xl border border-white/15 bg-[#191919] px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none">
              {exercises.map((exercise) => (
                <option key={exercise.exerciseId} value={exercise.exerciseId}>{exercise.exerciseName || 'Exercise'}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {listLoading && <p role="status" className="py-8 text-sm text-white/60">Loading exercises…</p>}
      {!listLoading && listError && <div role="alert" className="py-4 text-sm text-white/70">{listError} <button onClick={retry} className="ml-2 font-bold text-amber-400">Try again</button></div>}
      {!listLoading && !listError && exercises.length === 0 && (
        <div className="flex items-center gap-3 py-6 text-sm text-white/60"><Dumbbell size={22} className="text-amber-400" aria-hidden="true" /> Complete a workout to see exercise history.</div>
      )}

      {!listLoading && !listError && selected && (
        <>
          <p className="mb-5 text-sm text-white/60">{selected.sessionCount} completed {selected.sessionCount === 1 ? 'session' : 'sessions'} · last performed {formatDate(selected.lastPerformedAt)}</p>
          {historyLoading && <p role="status" className="py-8 text-sm text-white/60">Loading sessions…</p>}
          {!historyLoading && historyError && <div role="alert" className="py-4 text-sm text-white/70">{historyError} <button onClick={retry} className="ml-2 font-bold text-amber-400">Try again</button></div>}
          {!historyLoading && !historyError && sessions.length > 0 && (
            <>
              <StrengthTrend sessions={sessions} />
              <h3 className="mb-3 text-sm font-bold text-white/80">All sessions</h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <article key={session.sessionId} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-white">{formatDate(session.startTime)}</h4>
                        <p className="mt-1 text-xs text-white/50">{session.splitDayLabel || 'Freestyle Workout'} · {session.sets.length} {session.sets.length === 1 ? 'set' : 'sets'}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-amber-400">{numberFormatter.format(Number(session.volumeKg) || 0)} kg volume</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {session.sets.map((set) => (
                        <span key={set.setNumber} className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs tabular-nums text-white/80">
                          Set {set.setNumber}: {numberFormatter.format(Number(set.weightKg) || 0)} kg × {set.reps} reps{set.isPr ? ' · PR' : ''}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {!historyLoading && !historyError && sessions.length === 0 && <p className="py-6 text-sm text-white/60">No completed sessions for this exercise.</p>}
        </>
      )}
    </section>
  );
}
