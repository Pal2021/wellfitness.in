import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { getExercises } from '../../../services/apiClient';
import ExercisePhoto from '../../exercise/components/ExercisePhoto';
import * as splitService from '../services/splitService';

export default function SelectExerciseModal({ onClose, onExerciseAdded, splitId, dayId, excludedExerciseIds = [] }) {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState('');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getExercises()
      .then((response) => { if (!cancelled) setExercises(response.data?.data || []); })
      .catch(() => { if (!cancelled) setError('Could not load exercises.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape' && !addingId) onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addingId, onClose]);

  const addExercise = async (exerciseId) => {
    try {
      setAddingId(exerciseId);
      setError('');
      await splitService.addExerciseToSplitDay(splitId, dayId, exerciseId);
      await onExerciseAdded();
      onClose();
    } catch (requestError) {
      setError(requestError.message || 'Could not add this exercise.');
    } finally {
      setAddingId('');
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const excluded = new Set(excludedExerciseIds);
  const available = exercises.filter((exercise) => !excluded.has(exercise.id));
  const filtered = available.filter((exercise) => !query || exercise.name?.toLowerCase().includes(query) || exercise.muscleGroup?.toLowerCase().includes(query));

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" onClick={onClose} disabled={Boolean(addingId)} aria-label="Close exercise picker" className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="add-exercise-title" className="relative flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#161616] text-white shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
        <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-amber-400">Build your day</p>
            <h2 id="add-exercise-title" className="text-xl font-black">Add exercise</h2>
            <p className="mt-1 text-xs text-white/55">Choose a movement for this split day.</p>
          </div>
          <button type="button" onClick={onClose} disabled={Boolean(addingId)} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70"><X size={20} /></button>
        </header>

        <div className="border-b border-white/10 px-5 pb-4 sm:px-6">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
            <input type="search" aria-label="Search exercises to add" placeholder="Search name or muscle group" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-500" />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
          {error && <div role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}{exercises.length === 0 && <button type="button" onClick={() => { setError(''); setLoading(true); setReloadKey((value) => value + 1); }} className="ml-2 font-bold underline">Try again</button>}</div>}
          {loading && <p role="status" className="py-10 text-center text-sm text-white/60">Loading exercises…</p>}
          {!loading && !error && filtered.length === 0 && <p className="py-10 text-center text-sm text-white/60">{available.length === 0 ? 'All available exercises are already on this day.' : 'No exercises match your search.'}</p>}
          {!loading && filtered.map((exercise) => (
            <div key={exercise.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <ExercisePhoto exercise={exercise} className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{exercise.name}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">{exercise.muscleGroup || 'Exercise'}</p>
              </div>
              <button type="button" onClick={() => addExercise(exercise.id)} disabled={Boolean(addingId)} aria-label={`Add ${exercise.name}`} className="flex min-h-11 shrink-0 items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-extrabold text-black disabled:opacity-50"><Plus size={15} aria-hidden="true" /> {addingId === exercise.id ? 'Adding' : 'Add'}</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
