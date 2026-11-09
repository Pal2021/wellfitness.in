import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Plus, Search, X } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import AddCustomExerciseModal from '../components/AddCustomExerciseModal';
import * as exerciseService from '../services/exerciseService';

export default function ExercisesScreen() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [activeTab, setActiveTab] = useState('library');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    exerciseService.fetchAllExercises()
      .then((data) => {
        if (!cancelled) setExercises(data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || 'Failed to load exercises');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const libraryExercises = useMemo(() => exercises.filter((exercise) => !exercise.userId), [exercises]);
  const muscleGroups = useMemo(() => exerciseService.getMuscleGroups(libraryExercises), [libraryExercises]);
  const filteredExercises = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return exercises.filter((exercise) => {
      if (activeTab === 'library' && exercise.userId) return false;
      if (activeTab === 'custom' && !exercise.userId) return false;
      if (activeTab === 'library' && selectedMuscleGroup && exercise.muscleGroup !== selectedMuscleGroup) return false;
      return !query || exercise.name?.toLowerCase().includes(query);
    });
  }, [exercises, activeTab, searchTerm, selectedMuscleGroup]);

  const refresh = () => {
    setError('');
    setLoading(true);
    setReloadKey((value) => value + 1);
  };

  const handleCreateCustomExercise = async (data) => {
    await exerciseService.createCustomExercise(data);
    refresh();
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <header className="relative mb-7 overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17120b] px-6 py-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.15)] sm:px-9 sm:py-11">
          <img src="/exercise-images/barbell-squat.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14100b] via-[#14100b]/95 to-[#14100b]/30" aria-hidden="true" />
          <div className="relative max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400"><Dumbbell size={16} aria-hidden="true" /> Train with purpose</span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">Exercise Library</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">Explore movements, see how they look, and add the right exercise to your next workout.</p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{libraryExercises.length} guided exercises</p>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border p-4 sm:p-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }} aria-label="Exercise filters">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl p-1" style={{ background: 'var(--color-bg-tertiary)' }} aria-label="Exercise collection">
              <button type="button" onClick={() => setActiveTab('library')} aria-pressed={activeTab === 'library'} className={`rounded-lg px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition ${activeTab === 'library' ? 'bg-amber-500 text-black shadow-sm' : 'hover:text-amber-500'}`}>Library</button>
              <button type="button" onClick={() => setActiveTab('custom')} aria-pressed={activeTab === 'custom'} className={`rounded-lg px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition ${activeTab === 'custom' ? 'bg-amber-500 text-black shadow-sm' : 'hover:text-amber-500'}`}>My custom</button>
            </div>
            {activeTab === 'custom' && (
              <button type="button" onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-black transition hover:bg-amber-400"><Plus size={16} aria-hidden="true" /> Add exercise</button>
            )}
          </div>

          <div className="relative">
            <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <input aria-label="Search exercises" type="search" placeholder="Search exercises..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-12 w-full rounded-xl border pl-11 pr-10 text-sm outline-none transition focus:border-amber-500" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
            {searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-amber-500"><X size={17} /></button>}
          </div>

          {activeTab === 'library' && muscleGroups.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by muscle group">
              {['', ...muscleGroups].map((group) => (
                <button type="button" key={group || 'all'} onClick={() => setSelectedMuscleGroup(group)} aria-pressed={selectedMuscleGroup === group} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition ${selectedMuscleGroup === group ? 'border-amber-500 bg-amber-500 text-black' : 'border-amber-500/15 hover:border-amber-500/50'}`}>
                  {group || 'All'}
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-extrabold">{activeTab === 'library' ? 'Explore exercises' : 'Your exercises'}</h2>
          {!loading && !error && <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}</p>}
        </div>

        {loading && <div role="status" className="rounded-2xl border p-12 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Loading exercises…</div>}
        {!loading && error && <div role="alert" className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-border)' }}><p className="mb-4">{error}</p><button type="button" onClick={refresh} className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-black">Try again</button></div>}
        {!loading && !error && filteredExercises.length === 0 && (
          <div className="rounded-2xl border px-6 py-14 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
            <Dumbbell size={32} className="mx-auto mb-4 text-amber-500" aria-hidden="true" />
            <h3 className="text-lg font-bold">No exercises found</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{activeTab === 'custom' && !searchTerm ? 'Create a custom exercise to start your collection.' : 'Try another search or muscle group.'}</p>
            {activeTab === 'custom' && !searchTerm && <button type="button" onClick={() => setIsAddModalOpen(true)} className="mt-5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black">Create exercise</button>}
          </div>
        )}
        {!loading && !error && filteredExercises.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredExercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} onSelect={(item) => navigate(`/exercises/${item.id}`, { state: { exercise: item } })} />)}
          </div>
        )}
      </main>

      <AddCustomExerciseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onExerciseCreated={handleCreateCustomExercise} />
    </div>
  );
}
