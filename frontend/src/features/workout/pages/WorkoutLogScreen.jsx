import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Check, Clock3, Dumbbell, Plus, Search, Trophy, X } from 'lucide-react';
import {
  addSet,
  endWorkout,
  getActiveSplit,
  getActiveWorkout,
  getExerciseHistory,
  getExercises,
  getWorkoutSets,
  startWorkout,
} from '../../../services/apiClient';
import WorkoutProgressBar from '../components/WorkoutProgressBar';
import { getWorkoutProgress } from '../utils/workoutProgress';

const REST_SECONDS = 105;
const selectionKey = (sessionId) => `workout_exercises_${sessionId}`;
const cardClass = 'rounded-2xl border border-white/10 bg-white/[0.04]';
const inputClass = 'w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-amber-500';

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function ExerciseLogCard({ exercise, loggedSets, onLog, onRemove, saving, suggestion }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState(String(exercise.defaultReps || 10));
  const [rpe, setRpe] = useState('');
  const [previousSets, setPreviousSets] = useState([]);
  const nextSetNumber = Math.max(0, ...loggedSets.map((set) => set.setNumber)) + 1;
  const previous = previousSets.find((set) => set.setNumber === nextSetNumber);

  useEffect(() => {
    let cancelled = false;
    getExerciseHistory(exercise.id)
      .then((response) => {
        if (!cancelled) setPreviousSets(response.data?.data || []);
      })
      .catch(() => {
        if (!cancelled) setPreviousSets([]);
      });
    return () => { cancelled = true; };
  }, [exercise.id]);

  const applyPrevious = (source) => {
    setWeight(String(source.suggestedWeight ?? source.weightKg ?? ''));
    setReps(String(source.suggestedReps ?? source.reps ?? ''));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedWeight = Number(weight);
    const parsedReps = Number(reps);
    const parsedRpe = rpe === '' ? null : Number(rpe);
    if (weight === '' || !Number.isFinite(parsedWeight) || parsedWeight < 0 ||
        !Number.isInteger(parsedReps) || parsedReps < 1 ||
        (parsedRpe !== null && (!Number.isInteger(parsedRpe) || parsedRpe < 1 || parsedRpe > 10))) {
      return;
    }
    const saved = await onLog(exercise.id, nextSetNumber, parsedWeight, parsedReps, parsedRpe);
    if (saved) {
      setWeight('');
      setRpe('');
    }
  };

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
          <p className="mt-1 text-xs text-white/50">
            {exercise.muscleGroup || exercise.equipment || 'Exercise'}
            {exercise.defaultSets ? ` · ${exercise.defaultSets} planned sets` : ''}
          </p>
        </div>
        {loggedSets.length === 0 && !exercise.defaultSets && (
          <button type="button" onClick={() => onRemove(exercise.id)} aria-label={`Remove ${exercise.name}`} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white">
            <X size={17} />
          </button>
        )}
      </div>

      {loggedSets.length > 0 && (
        <div className="px-5 pt-4">
          <div className="grid grid-cols-[3rem_1fr_1fr_3rem] gap-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
            <span>Set</span><span>Weight</span><span>Reps</span><span>Done</span>
          </div>
          {loggedSets.map((set) => (
            <div key={set.id} className="grid grid-cols-[3rem_1fr_1fr_3rem] items-center gap-2 border-t border-white/5 py-3 text-sm">
              <span className="font-semibold text-amber-400">{set.setNumber}</span>
              <span>{set.weightKg} kg</span>
              <span>{set.reps}</span>
              <span className="flex items-center gap-1 text-green-400" title={set.isPr ? 'Personal record' : 'Completed'}>
                {set.isPr ? <Trophy size={17} /> : <Check size={17} />}
              </span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 pt-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">Set {nextSetNumber}</span>
          <div className="flex flex-wrap justify-end gap-2">
            {previous && (
              <button type="button" onClick={() => applyPrevious(previous)} className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10">
                Previous: {previous.weightKg} kg × {previous.reps}
              </button>
            )}
            {suggestion && (
              <button type="button" onClick={() => applyPrevious(suggestion)} className="rounded-lg bg-amber-500/15 px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/25">
                Suggested: {suggestion.suggestedWeight} kg × {suggestion.suggestedReps}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs font-semibold text-white/60">Weight (kg)
            <input className={`${inputClass} mt-2`} type="number" inputMode="decimal" min="0" step="0.01" value={weight} onChange={(event) => setWeight(event.target.value)} required />
          </label>
          <label className="text-xs font-semibold text-white/60">Reps
            <input className={`${inputClass} mt-2`} type="number" inputMode="numeric" min="1" step="1" value={reps} onChange={(event) => setReps(event.target.value)} required />
          </label>
          <label className="text-xs font-semibold text-white/60">RPE
            <input className={`${inputClass} mt-2`} type="number" inputMode="numeric" min="1" max="10" step="1" placeholder="—" value={rpe} onChange={(event) => setRpe(event.target.value)} />
          </label>
        </div>
        <button type="submit" disabled={saving} className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-amber-400 disabled:opacity-50">
          {saving ? 'Saving set…' : `Log set ${nextSetNumber}`}
        </button>
      </form>
    </section>
  );
}

export default function WorkoutLogScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const requestedDayId = new URLSearchParams(search).get('splitDayId');
  const requestedExerciseId = new URLSearchParams(search).get('exerciseId');
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  const [split, setSplit] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loggedSets, setLoggedSets] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState(requestedDayId || '');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState(requestedExerciseId ? [requestedExerciseId] : []);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savingExerciseId, setSavingExerciseId] = useState(null);
  const [suggestions, setSuggestions] = useState({});
  const [prMessage, setPrMessage] = useState('');
  const [restUntil, setRestUntil] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [activeResult, exercisesResult, splitResult] = await Promise.allSettled([
          getActiveWorkout(), getExercises(), getActiveSplit(),
        ]);
        if (activeResult.status === 'rejected') throw activeResult.reason;
        if (exercisesResult.status === 'rejected') throw exercisesResult.reason;
        const active = activeResult.value.data?.data || null;
        const exercises = exercisesResult.value.data?.data || [];
        const activeSplit = splitResult.status === 'fulfilled' ? splitResult.value.data?.data : null;
        const sets = active ? (await getWorkoutSets(active.id)).data?.data || [] : [];
        if (cancelled) return;
        setSession(active);
        setLibrary(exercises);
        setSplit(activeSplit);
        setLoggedSets(sets);
        if (active) {
          setSelectedDayId(active.splitDayId || '');
          try {
            const saved = JSON.parse(localStorage.getItem(selectionKey(active.id)) || '[]');
            if (Array.isArray(saved)) setSelectedExerciseIds([...new Set([...saved, ...(requestedExerciseId ? [requestedExerciseId] : [])])]);
          } catch {
            setSelectedExerciseIds(requestedExerciseId ? [requestedExerciseId] : []);
          }
        } else if (!requestedDayId && activeSplit?.days) {
          const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
          const todayDay = activeSplit.days.find((day) => day.dayOfWeek === today && !day.isRestDay);
          if (todayDay) setSelectedDayId(todayDay.id);
        }
      } catch (loadError) {
        if (!cancelled) setError(getErrorMessage(loadError, 'Could not load workout data.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [reloadKey, requestedDayId, requestedExerciseId]);

  useEffect(() => {
    if (!session) return;
    localStorage.setItem(selectionKey(session.id), JSON.stringify(selectedExerciseIds));
  }, [session, selectedExerciseIds]);

  useEffect(() => {
    if (!session && !restUntil) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [session, restUntil]);

  const selectedDay = split?.days?.find((day) => day.id === selectedDayId) || null;
  const planned = useMemo(() => selectedDay?.exercises || [], [selectedDay]);
  const trackedExercises = useMemo(() => {
    const byId = new Map();
    for (const item of planned) {
      const id = item.exerciseId || item.exercise?.id;
      if (id) byId.set(id, { ...item.exercise, id, name: item.exerciseName || item.exercise?.name || 'Exercise', defaultSets: item.defaultSets, defaultReps: item.defaultReps });
    }
    for (const id of selectedExerciseIds) {
      const exercise = library.find((item) => item.id === id);
      if (exercise && !byId.has(id)) byId.set(id, exercise);
    }
    for (const set of loggedSets) {
      if (!byId.has(set.exerciseId)) byId.set(set.exerciseId, library.find((item) => item.id === set.exerciseId) || { id: set.exerciseId, name: set.exerciseName });
    }
    return [...byId.values()];
  }, [planned, selectedExerciseIds, library, loggedSets]);

  const matchingExercises = library
    .filter((exercise) => !trackedExercises.some((item) => item.id === exercise.id) && exercise.name?.toLowerCase().includes(exerciseSearch.toLowerCase()))
    .slice(0, 12);
  const totalVolume = loggedSets.reduce((sum, set) => sum + Number(set.weightKg) * Number(set.reps), 0);
  const workoutProgress = getWorkoutProgress(trackedExercises, loggedSets);
  const elapsedMinutes = session ? Math.max(0, Math.floor((now - new Date(session.startTime).getTime()) / 60000)) : 0;
  const restRemaining = restUntil ? Math.max(0, Math.ceil((restUntil - now) / 1000)) : 0;

  const handleStart = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await startWorkout(selectedDayId || undefined);
      const started = response.data?.data;
      if (!started?.id) throw new Error('The workout did not start. Please try again.');
      setSession(started);
      setLoggedSets([]);
      setSelectedExerciseIds((current) => [...new Set([...current, ...planned.map((item) => item.exerciseId).filter(Boolean)])]);
    } catch (startError) {
      // A session created in another tab can be recovered without losing it.
      try {
        const active = (await getActiveWorkout()).data?.data;
        if (active) {
          setSession(active);
          setLoggedSets((await getWorkoutSets(active.id)).data?.data || []);
          setSelectedDayId(active.splitDayId || '');
        } else {
          setError(getErrorMessage(startError, 'Could not start workout.'));
        }
      } catch {
        setError(getErrorMessage(startError, 'Could not start workout.'));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLog = async (exerciseId, setNumber, weightKg, reps, rpe) => {
    if (!session) return false;
    setSavingExerciseId(exerciseId);
    setError('');
    try {
      const response = await addSet(session.id, { exerciseId, setNumber, weightKg, reps, rpe });
      const result = response.data?.data;
      if (!result?.setId) throw new Error('Set was not saved. Please try again.');
      setLoggedSets((current) => [...current, { id: result.setId, ...result, weightKg, reps }]);
      setSuggestions((current) => ({ ...current, [exerciseId]: result.overloadSuggestion }));
      setPrMessage(result.isPr ? `New personal record: ${result.exerciseName} · ${weightKg} kg × ${reps}` : '');
      setNow(Date.now());
      setRestUntil(Date.now() + REST_SECONDS * 1000);
      return true;
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Could not save set.'));
      return false;
    } finally {
      setSavingExerciseId(null);
    }
  };

  const handleFinish = async () => {
    if (!session || !window.confirm('Finish this workout? You can view it in History afterward.')) return;
    setBusy(true);
    setError('');
    try {
      await endWorkout(session.id);
      localStorage.removeItem(selectionKey(session.id));
      navigate('/workout/history', { replace: true });
    } catch (finishError) {
      setError(getErrorMessage(finishError, 'Could not finish workout.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#17130b] via-[#101010] to-black pb-32 text-white md:pb-12">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <button onClick={() => navigate('/workout')} className="mb-4 flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={17} /> Workout tracker</button>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{session ? session.splitDayLabel || 'Freestyle Workout' : 'Start Workout'}</h1>
            <p className="mt-2 text-sm text-white/50">{session ? 'Log your sets, then finish when you are done.' : 'Choose a training day or start a freestyle session.'}</p>
          </div>
          {session && <span className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-400"><span className="h-2 w-2 rounded-full bg-green-400" /> LIVE</span>}
        </header>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
        {loading ? (
          <div className="py-24 text-center text-white/60">Loading workout…</div>
        ) : !session && library.length === 0 ? (
          <button onClick={() => setReloadKey((value) => value + 1)} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black">Try again</button>
        ) : (
          <>
            {!session && (
              <section className={`${cardClass} mb-6 p-5 md:p-6`}>
                <label className="block text-sm font-bold" htmlFor="training-day">Training day</label>
                <select id="training-day" value={selectedDayId} onChange={(event) => setSelectedDayId(event.target.value)} className={`${inputClass} mt-3 max-w-md`}>
                  <option value="">Freestyle workout</option>
                  {split?.days?.filter((day) => !day.isRestDay).map((day) => <option key={day.id} value={day.id}>{day.label} · {day.dayOfWeek}</option>)}
                </select>
                <p className="mt-3 text-sm text-white/50">{selectedDay ? `${planned.length} scheduled exercises will be ready to log.` : 'Add any exercise after starting.'}</p>
                <button onClick={handleStart} disabled={busy} className="mt-6 rounded-xl bg-amber-500 px-7 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-50">
                  {busy ? 'Starting…' : 'Start session'}
                </button>
              </section>
            )}

            {session && (
              <>
                <div className="mb-6 grid grid-cols-3 gap-3">
                  <div className={`${cardClass} p-4`}><Clock3 className="mb-2 text-amber-400" size={20} /><strong className="block text-xl">{elapsedMinutes} min</strong><span className="text-xs text-white/50">Elapsed</span></div>
                  <div className={`${cardClass} p-4`}><Activity className="mb-2 text-amber-400" size={20} /><strong className="block text-xl">{loggedSets.length}</strong><span className="text-xs text-white/50">Sets logged</span></div>
                  <div className={`${cardClass} p-4`}><Dumbbell className="mb-2 text-amber-400" size={20} /><strong className="block text-xl">{Math.round(totalVolume)} kg</strong><span className="text-xs text-white/50">Volume</span></div>
                </div>

                <WorkoutProgressBar {...workoutProgress} />

                {restRemaining > 0 && <div className={`${cardClass} mb-6 flex items-center justify-between gap-3 p-4`}><div><span className="text-xs font-bold uppercase tracking-wider text-white/50">Rest timer</span><strong className="block text-2xl text-amber-400">{Math.floor(restRemaining / 60)}:{String(restRemaining % 60).padStart(2, '0')}</strong></div><div className="flex gap-2"><button onClick={() => setRestUntil((value) => value + 30000)} className="rounded-lg bg-white/10 px-3 py-2 text-sm">+30s</button><button onClick={() => setRestUntil(null)} className="rounded-lg bg-white/10 px-3 py-2 text-sm">Skip</button></div></div>}
                {prMessage && <div role="status" className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"><Trophy size={20} />{prMessage}<button onClick={() => setPrMessage('')} aria-label="Dismiss record message" className="ml-auto"><X size={16} /></button></div>}

                <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Exercises</h2><button onClick={() => setShowPicker((value) => !value)} className="flex items-center gap-2 rounded-xl border border-amber-500/30 px-3 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-500/10"><Plus size={16} /> Add exercise</button></div>

                {showPicker && <div className={`${cardClass} mb-5 p-4`}><div className="relative"><Search size={17} className="absolute left-3 top-3.5 text-white/40" /><input value={exerciseSearch} onChange={(event) => setExerciseSearch(event.target.value)} placeholder="Search exercises" aria-label="Search exercises" className={`${inputClass} pl-10`} /></div><div className="mt-3 max-h-64 overflow-y-auto">{matchingExercises.map((exercise) => <button key={exercise.id} onClick={() => { setSelectedExerciseIds((current) => [...new Set([...current, exercise.id])]); setShowPicker(false); setExerciseSearch(''); }} className="flex w-full items-center justify-between border-b border-white/5 px-2 py-3 text-left text-sm hover:bg-white/5"><span>{exercise.name}</span><Plus size={16} className="text-amber-400" /></button>)}{matchingExercises.length === 0 && <p className="p-3 text-sm text-white/50">No matching exercises.</p>}</div></div>}

                {trackedExercises.length === 0 ? <div className={`${cardClass} mb-6 p-10 text-center text-white/50`}>Add an exercise to log your first set.</div> : <div className="grid gap-5 lg:grid-cols-2">{trackedExercises.map((exercise) => <ExerciseLogCard key={exercise.id} exercise={exercise} loggedSets={loggedSets.filter((set) => set.exerciseId === exercise.id)} onLog={handleLog} onRemove={(id) => setSelectedExerciseIds((current) => current.filter((item) => item !== id))} saving={busy || savingExerciseId !== null} suggestion={suggestions[exercise.id]} />)}</div>}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6"><p className="text-sm text-white/50">Your workout stays active if you leave this page.</p><button onClick={handleFinish} disabled={busy || savingExerciseId !== null} className="rounded-xl bg-amber-500 px-7 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-50">{busy ? 'Finishing…' : 'Finish workout'}</button></div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
