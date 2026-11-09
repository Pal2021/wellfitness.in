import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, Heart, Share2, Target } from 'lucide-react';
import ExercisePhoto from '../components/ExercisePhoto';
import * as exerciseService from '../services/exerciseService';

const panelStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' };

export default function ExerciseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cachedExercise = location.state?.exercise;
  const [exercise, setExercise] = useState(cachedExercise?.id === id ? cachedExercise : null);
  const [loading, setLoading] = useState(!exercise);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const loadExerciseDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (cachedExercise?.id === id) {
        setExercise(cachedExercise);
      } else {
        setExercise(await exerciseService.fetchExerciseById(id));
      }
    } catch (requestError) {
      setError(requestError.message || 'Failed to load exercise details');
    } finally {
      setLoading(false);
    }
  }, [cachedExercise, id]);

  useEffect(() => {
    loadExerciseDetail();
  }, [loadExerciseDetail]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: exercise.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage('Link copied to clipboard');
      }
    } catch (shareError) {
      if (shareError.name !== 'AbortError') setShareMessage('Could not share this exercise');
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('/exercises')} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:border-amber-500/50" style={{ borderColor: 'var(--color-border)' }}><ArrowLeft size={17} aria-hidden="true" /> All exercises</button>
          {exercise && !loading && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsFavorite((value) => !value)} aria-label={isFavorite ? 'Remove favorite' : 'Mark favorite'} aria-pressed={isFavorite} className="rounded-xl border p-2.5 text-amber-500 transition hover:bg-amber-500/10" style={{ borderColor: 'var(--color-border)' }}><Heart size={19} fill={isFavorite ? 'currentColor' : 'none'} /></button>
              <button type="button" onClick={handleShare} aria-label="Share exercise" className="rounded-xl border p-2.5 text-amber-500 transition hover:bg-amber-500/10" style={{ borderColor: 'var(--color-border)' }}><Share2 size={19} /></button>
            </div>
          )}
        </div>

        {shareMessage && <p role="status" className="mb-4 text-right text-sm text-amber-500">{shareMessage}</p>}
        {loading && <div role="status" className="rounded-2xl border p-12 text-center text-sm" style={panelStyle}>Loading exercise…</div>}
        {!loading && error && <div role="alert" className="rounded-2xl border p-8 text-center" style={panelStyle}><p className="mb-4">{error}</p><button type="button" onClick={loadExerciseDetail} className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-black">Try again</button></div>}

        {!loading && !error && exercise && (
          <>
            <section className="grid overflow-hidden rounded-3xl border lg:grid-cols-[1.15fr_1fr]" style={panelStyle}>
              <ExercisePhoto exercise={exercise} loading="eager" className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[420px]" />
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
                <span className="mb-4 w-fit rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-500">{exercise.muscleGroup || 'Exercise'}</span>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{exercise.name}</h1>
                <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                  {exercise.instructions || 'Add this movement to a workout and start tracking your sets.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[exercise.equipment, exercise.difficulty, exercise.isCompound ? 'Compound' : null].filter(Boolean).map((tag) => <span key={tag} className="rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wide" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>{tag}</span>)}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <button type="button" onClick={() => navigate(`/workout/log?exerciseId=${exercise.id}`)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-extrabold text-black transition hover:bg-amber-400">Add to workout <ArrowRight size={17} aria-hidden="true" /></button>
                  <button type="button" onClick={() => navigate(`/progress?exerciseId=${exercise.id}`)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-bold transition hover:border-amber-500/50" style={{ borderColor: 'var(--color-border)' }}><BarChart3 size={17} aria-hidden="true" /> View progress</button>
                </div>
              </div>
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border p-6 sm:p-7" style={panelStyle}>
                <div className="mb-4 flex items-center gap-2 text-amber-500"><Target size={20} aria-hidden="true" /><h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Muscles worked</h2></div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Primary</p>
                <p className="text-xl font-extrabold capitalize">{exercise.muscleGroup?.toLowerCase() || 'Not specified'}</p>
                {exercise.secondaryMuscles && <><p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Also works</p><p className="text-sm font-medium">{exercise.secondaryMuscles}</p></>}
              </section>

              <section className="rounded-2xl border p-6 sm:p-7" style={panelStyle}>
                <h2 className="mb-4 text-lg font-extrabold">How to perform it</h2>
                <p className="text-sm leading-7" style={{ color: 'var(--color-text-secondary)' }}>{exercise.instructions || 'No instructions have been added for this exercise yet.'}</p>
              </section>
            </div>

            {exercise.videoUrl && <section className="mt-6 rounded-2xl border p-6 sm:p-7" style={panelStyle}><h2 className="mb-4 text-lg font-extrabold">Video demonstration</h2><video src={exercise.videoUrl} controls className="w-full max-w-3xl rounded-xl" controlsList="nodownload" /></section>}
          </>
        )}
      </main>
    </div>
  );
}
