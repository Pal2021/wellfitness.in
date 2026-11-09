import { ArrowUpRight } from 'lucide-react';
import ExercisePhoto from './ExercisePhoto';

export default function ExerciseCard({ exercise, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left transition duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      aria-label={`View ${exercise.name} details`}
    >
      <ExercisePhoto exercise={exercise} className="aspect-[4/3] w-full" imageClassName="transition-transform duration-500 group-hover:scale-105" />
      <div className="flex w-full flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
            {exercise.muscleGroup || 'Exercise'}
          </span>
          <ArrowUpRight size={18} className="text-amber-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-extrabold leading-snug" style={{ color: 'var(--color-text-primary)' }}>{exercise.name}</h2>
        <p className="mt-auto pt-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
          {[exercise.equipment, exercise.difficulty].filter(Boolean).join(' · ')}
        </p>
      </div>
    </button>
  );
}
