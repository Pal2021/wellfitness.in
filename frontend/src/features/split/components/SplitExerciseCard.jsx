import { useState } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import ExercisePhoto from '../../exercise/components/ExercisePhoto';

export default function SplitExerciseCard({ exercise, index, onPlay, onDelete, busy = false }) {
  const [confirming, setConfirming] = useState(false);
  const details = exercise.exercise || exercise;
  const name = exercise.exerciseName || details.name || 'Exercise';
  const photoExercise = { ...details, name };
  const sets = Number(exercise.defaultSets) || 3;
  const reps = Number(exercise.defaultReps) || 10;

  return (
    <article className="rounded-xl border p-3 sm:p-4" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start gap-3">
        <ExercisePhoto exercise={photoExercise} className="h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Exercise {index}</p>
          <h4 className="mt-1 text-sm font-extrabold leading-snug sm:text-base">{name}</h4>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{sets} sets × {reps} reps{details.muscleGroup ? ` · ${details.muscleGroup.toLowerCase()}` : ''}</p>
        </div>
        {!confirming && <button type="button" onClick={() => setConfirming(true)} disabled={busy} aria-label={`Remove ${name}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"><Trash2 size={17} aria-hidden="true" /></button>}
      </div>

      {confirming ? (
        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-semibold text-red-500">Remove this exercise?</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="min-h-11 rounded-lg px-3 text-xs font-bold">Cancel</button>
            <button type="button" onClick={() => { setConfirming(false); onDelete(exercise); }} disabled={busy} className="min-h-11 rounded-lg bg-red-500 px-3 text-xs font-extrabold text-white">Remove</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={onPlay} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-lg bg-amber-500/10 px-3 text-xs font-extrabold text-amber-500 transition hover:bg-amber-500/20">
          Log this exercise <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
    </article>
  );
}
