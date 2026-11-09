export default function WorkoutProgressBar({ completedSets, targetSets, percentage }) {
  const description = targetSets > 0
    ? `${completedSets} of ${targetSets} planned sets completed`
    : 'Add an exercise to set a target';

  return (
    <section aria-label="Workout progress" className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">Workout progress</h2>
        <span className="text-lg font-bold tabular-nums text-amber-400">{percentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Planned sets completed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={description}
        className="h-2.5 overflow-hidden rounded-full bg-white/10"
      >
        <div className="h-full rounded-full bg-amber-500 transition-[width] duration-300" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-3 text-xs text-white/50">{description}</p>
    </section>
  );
}
