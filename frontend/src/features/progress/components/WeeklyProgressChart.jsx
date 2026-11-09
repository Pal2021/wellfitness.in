const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export default function WeeklyProgressChart({ weeks, metric }) {
  const isVolume = metric === 'volumeKg';
  const maximum = Math.max(1, ...weeks.map((week) => week[metric]));
  const chartDescription = weeks
    .map((week) => `${week.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${numberFormatter.format(week[metric])} ${isVolume ? 'kilograms' : 'workouts'}`)
    .join(', ');

  return (
    <div role="img" aria-label={`Weekly ${isVolume ? 'training volume' : 'workouts'}: ${chartDescription}`}>
      <div className="grid h-48 grid-cols-4 items-end gap-3 border-b border-white/10 pb-2 md:gap-6">
        {weeks.map((week) => (
          <div key={week.start.toISOString()} className="flex h-full flex-col items-center justify-end gap-2">
            <span className="text-xs font-semibold tabular-nums text-white/70">
              {numberFormatter.format(week[metric])}{isVolume ? ' kg' : ''}
            </span>
            <div className="flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-white/[0.04]">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-[height] duration-300"
                style={{ height: `${week[metric] > 0 ? Math.max(6, (week[metric] / maximum) * 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3 text-center text-xs text-white/50 md:gap-6">
        {weeks.map((week) => (
          <span key={week.start.toISOString()}>
            {week.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  );
}
