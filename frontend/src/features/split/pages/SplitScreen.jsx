import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Moon, Plus, Repeat2, Sparkles } from 'lucide-react';
import { getActiveWorkout } from '../../../services/apiClient';
import SplitExerciseCard from '../components/SplitExerciseCard';
import SplitRestTimer from '../components/SplitRestTimer';
import ChangeSplitModal from '../components/ChangeSplitModal';
import SelectExerciseModal from '../components/SelectExerciseModal';
import * as splitService from '../services/splitService';

const panelStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' };

function dayPhoto(day) {
  const focus = `${day?.label || ''} ${day?.muscleGroups || ''}`.toLowerCase();
  if (focus.includes('leg') || focus.includes('lower')) return '/exercise-images/barbell-squat.jpg';
  if (focus.includes('pull') || focus.includes('back')) return '/exercise-images/lat-pulldown.jpg';
  if (focus.includes('push') || focus.includes('chest')) return '/exercise-images/barbell-bench-press.jpg';
  if (focus.includes('shoulder')) return '/exercise-images/overhead-press.jpg';
  if (focus.includes('arm') || focus.includes('bicep') || focus.includes('tricep')) return '/exercise-images/barbell-curl.jpg';
  return '/exercise-images/deadlift.jpg';
}

function chooseDay(days, selectedId) {
  if (days.some((day) => day.id === selectedId)) return selectedId;
  const weekday = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  return (days.find((day) => day.dayOfWeek === weekday)
    || days.find((day) => !day.isRestDay)
    || days[0])?.id || '';
}

export default function SplitScreen() {
  const navigate = useNavigate();
  const [activeSplit, setActiveSplit] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [removingId, setRemovingId] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const loadSplit = useCallback(async () => {
    try {
      setError('');
      const [splitData, workoutResponse] = await Promise.all([
        splitService.getActiveUserSplit(),
        getActiveWorkout().catch(() => null),
      ]);
      const days = [...(splitData?.days || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setActiveSplit(splitData ? { ...splitData, days } : null);
      setActiveWorkout(workoutResponse?.data?.data || null);
      setSelectedDayId((current) => chooseDay(days, current));
    } catch (requestError) {
      setError(requestError.message || 'Could not load your split.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSplit(); }, [loadSplit]);

  const retry = () => {
    setLoading(true);
    loadSplit();
  };

  const days = activeSplit?.days || [];
  const currentDay = days.find((day) => day.id === selectedDayId) || days[0] || null;
  const workoutDays = days.filter((day) => !day.isRestDay).length;
  const exercises = currentDay?.exercises || [];
  const plannedSets = exercises.reduce((total, item) => total + (Number(item.defaultSets) || 3), 0);
  const startPath = activeWorkout ? '/workout/log' : `/workout/log?splitDayId=${currentDay?.id}`;

  const removeExercise = async (item) => {
    const exerciseId = item.exerciseId || item.exercise?.id;
    if (!activeSplit || !currentDay || !exerciseId) return;
    try {
      setActionError('');
      setRemovingId(exerciseId);
      await splitService.removeExerciseFromSplitDay(activeSplit.id, currentDay.id, exerciseId);
      await loadSplit();
    } catch (requestError) {
      setActionError(requestError.message || 'Could not remove this exercise.');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <header className="mb-6 flex items-start gap-3">
          <button type="button" onClick={() => navigate('/workout')} aria-label="Back to workout" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition hover:border-amber-500/40" style={panelStyle}><ArrowLeft size={19} aria-hidden="true" /></button>
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500">Your training plan</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Split</h1>
          </div>
        </header>

        {loading && <div role="status" className="rounded-2xl border p-12 text-center text-sm" style={panelStyle}>Loading your split…</div>}
        {!loading && error && <div role="alert" className="rounded-2xl border p-8 text-center" style={panelStyle}><p className="mb-4">{error}</p><button type="button" onClick={retry} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black">Try again</button></div>}

        {!loading && !error && !activeSplit && (
          <section className="overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17120c] p-7 text-white sm:p-10">
            <Sparkles size={30} className="mb-5 text-amber-400" aria-hidden="true" />
            <h2 className="text-2xl font-black">Build a plan that fits your week.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">Choose a split template, then add or remove exercises to make it yours.</p>
            <button type="button" onClick={() => setShowChangeModal(true)} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-black sm:w-fit">Browse split templates <ArrowRight size={17} aria-hidden="true" /></button>
          </section>
        )}

        {!loading && !error && activeSplit && (
          <>
            <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 sm:p-6" style={panelStyle}>
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Current split</p>
                <h2 className="text-xl font-extrabold sm:text-2xl">{activeSplit.name || 'Custom Split'}</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{workoutDays} workout {workoutDays === 1 ? 'day' : 'days'} · {days.length - workoutDays} rest {days.length - workoutDays === 1 ? 'day' : 'days'}</p>
              </div>
              <button type="button" onClick={() => setShowChangeModal(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 px-4 text-sm font-bold text-amber-500 transition hover:bg-amber-500/10 sm:w-auto"><Repeat2 size={17} aria-hidden="true" /> Change split</button>
            </section>

            {days.length === 0 ? <p className="rounded-2xl border p-6 text-sm" style={panelStyle}>This split has no days yet. Choose a different template.</p> : (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-base font-extrabold"><CalendarDays size={18} className="text-amber-500" aria-hidden="true" /> Training days</h2>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Choose a day</span>
                </div>
                <div className="-mx-4 mb-6 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Choose split day">
                  {days.map((day, index) => {
                    const selected = day.id === currentDay?.id;
                    return <button key={day.id || index} type="button" onClick={() => setSelectedDayId(day.id)} aria-pressed={selected} className={`min-h-14 min-w-24 shrink-0 snap-start rounded-xl border px-3 py-2 text-left transition ${selected ? 'border-amber-500 bg-amber-500 text-black shadow-[0_8px_25px_rgba(245,158,11,0.2)]' : 'hover:border-amber-500/40'}`} style={selected ? undefined : panelStyle}>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider opacity-70">{day.dayOfWeek || `Day ${index + 1}`}</span>
                      <span className="mt-0.5 block max-w-28 truncate text-sm font-bold">{day.label || (day.isRestDay ? 'Rest' : `Day ${index + 1}`)}</span>
                    </button>;
                  })}
                </div>

                {currentDay && (currentDay.isRestDay ? (
                  <section className="mb-6 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#162035] to-[#101015] p-7 text-white sm:p-10">
                    <Moon size={30} className="mb-5 text-sky-300" aria-hidden="true" />
                    <h2 className="text-2xl font-black">Rest and recover</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">Your plan has no workout scheduled for {currentDay.dayOfWeek || 'this day'}. Give your body time to recover.</p>
                    {activeWorkout && <button type="button" onClick={() => navigate('/workout/log')} className="mt-6 min-h-12 w-full rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-black sm:w-auto">Resume active workout</button>}
                  </section>
                ) : (
                  <>
                    <section className="relative mb-5 overflow-hidden rounded-3xl border border-amber-500/20 bg-[#16100b] text-white">
                      <img src={dayPhoto(currentDay)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#14100b] via-[#14100b]/90 to-[#14100b]/35" aria-hidden="true" />
                      <div className="relative p-6 sm:p-8">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">{currentDay.dayOfWeek || `Day ${days.indexOf(currentDay) + 1}`} · Workout day</p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight">{currentDay.label || 'Workout day'}</h2>
                        <p className="mt-2 text-sm text-white/70">{exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} · {plannedSets} planned sets{currentDay.muscleGroups ? ` · ${currentDay.muscleGroups}` : ''}</p>
                        {activeWorkout && activeWorkout.splitDayId !== currentDay.id && <p className="mt-3 max-w-sm text-xs text-amber-200">Another workout is in progress. Resume it before starting this day.</p>}
                        <button type="button" onClick={() => navigate(startPath)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-amber-400 active:scale-[0.99] sm:w-auto">
                          {activeWorkout ? 'Resume workout' : 'Start this workout'} <ArrowRight size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </section>

                    <section aria-labelledby="split-exercises-title" className="mb-6 rounded-2xl border p-4 sm:p-6" style={panelStyle}>
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div><h3 id="split-exercises-title" className="text-lg font-extrabold">Planned exercises</h3><p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Adjust this day to match your training.</p></div>
                        <span className="text-xs font-bold text-amber-500">{exercises.length} total</span>
                      </div>
                      {actionError && <p role="alert" className="mb-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{actionError}</p>}
                      {exercises.length === 0 ? <p className="rounded-xl border border-dashed p-6 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>No exercises yet. Add one to build this day.</p> : (
                        <div className="space-y-3">{exercises.map((item, index) => <SplitExerciseCard key={item.id || `${item.exerciseId}-${index}`} exercise={item} index={index + 1} onPlay={() => navigate(activeWorkout ? `/workout/log?exerciseId=${item.exerciseId || item.exercise?.id}` : `/workout/log?splitDayId=${currentDay.id}&exerciseId=${item.exerciseId || item.exercise?.id}`)} onDelete={removeExercise} busy={Boolean(removingId)} />)}</div>
                      )}
                      <button type="button" onClick={() => setShowAddExerciseModal(true)} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-500/40 px-4 text-sm font-bold text-amber-500 transition hover:bg-amber-500/10"><Plus size={18} aria-hidden="true" /> Add exercise</button>
                    </section>

                    <SplitRestTimer />
                  </>
                ))}
              </>
            )}
          </>
        )}
      </main>

      {showChangeModal && <ChangeSplitModal onClose={() => setShowChangeModal(false)} onSplitChanged={async () => { setSelectedDayId(''); await loadSplit(); }} currentSplitName={activeSplit?.name} />}
      {showAddExerciseModal && currentDay && <SelectExerciseModal onClose={() => setShowAddExerciseModal(false)} onExerciseAdded={loadSplit} splitId={activeSplit.id} dayId={currentDay.id} excludedExerciseIds={exercises.map((item) => item.exerciseId || item.exercise?.id)} />}
    </div>
  );
}
