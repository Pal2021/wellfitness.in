import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Dumbbell, Flame, RefreshCw, Trophy } from 'lucide-react';
import WeeklyProgressChart from '../components/WeeklyProgressChart';
import ExerciseProgress from '../components/ExerciseProgress';
import { getProgressData } from '../services/progressService';
import { buildWeeklyProgress } from '../utils/progressMetrics';

const cardClass = 'rounded-2xl border border-white/10 bg-white/[0.04]';
const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div className={`${cardClass} p-4 md:p-5`}>
      <span className="mb-4 block text-amber-400" aria-hidden="true">{icon}</span>
      <p className="text-2xl font-extrabold tabular-nums text-white md:text-3xl">
        {numberFormatter.format(value)}{unit && <span className="ml-1 text-sm font-medium text-white/50">{unit}</span>}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/50">{label}</p>
    </div>
  );
}

export default function ProgressScreen() {
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [chartMetric, setChartMetric] = useState('volumeKg');

  useEffect(() => {
    let cancelled = false;
    getProgressData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError?.response?.data?.message || 'Could not load progress. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const refresh = () => {
    setLoading(true);
    setError('');
    setReloadKey((value) => value + 1);
  };

  const weeks = data ? buildWeeklyProgress(data.sessions) : [];
  const recentWorkouts = weeks.reduce((sum, week) => sum + week.workouts, 0);
  const recentVolume = weeks.reduce((sum, week) => sum + week.volumeKg, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#17130b] via-[#101010] to-black pb-32 text-white md:pb-12">
      <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Your training</p>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Progress</h1>
            <p className="mt-2 text-sm text-white/50">Review each exercise's past sessions and your weekly training trend.</p>
          </div>
          <button onClick={refresh} disabled={loading} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/5 disabled:opacity-50">
            <RefreshCw size={16} aria-hidden="true" /> Refresh
          </button>
        </header>

        <ExerciseProgress />

        {loading && <div role="status" className={`${cardClass} p-12 text-center text-white/60`}>Loading progress…</div>}

        {!loading && error && (
          <div role="alert" className={`${cardClass} p-8 text-center`}>
            <p className="mb-5 text-white/70">{error}</p>
            <button onClick={refresh} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black hover:bg-amber-400">Try again</button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={<Dumbbell size={20} />} label="All-time workouts" value={data.dashboard.totalWorkouts || 0} />
              <StatCard icon={<Activity size={20} />} label="Last 4 weeks volume" value={recentVolume} unit="kg" />
              <StatCard icon={<Flame size={20} />} label="Current streak" value={data.dashboard.streak?.current || 0} unit="days" />
              <StatCard icon={<Trophy size={20} />} label="Personal records" value={data.records.length} />
            </div>

            <section className={`${cardClass} mb-6 p-5 md:p-7`}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Weekly trend</h2>
                  <p className="mt-1 text-sm text-white/50">{recentWorkouts} workouts in the last four weeks</p>
                </div>
                <div className="flex rounded-xl bg-black/40 p-1" aria-label="Chart metric">
                  <button onClick={() => setChartMetric('volumeKg')} aria-pressed={chartMetric === 'volumeKg'} className={`rounded-lg px-3 py-2 text-xs font-bold ${chartMetric === 'volumeKg' ? 'bg-amber-500 text-black' : 'text-white/60'}`}>Volume</button>
                  <button onClick={() => setChartMetric('workouts')} aria-pressed={chartMetric === 'workouts'} className={`rounded-lg px-3 py-2 text-xs font-bold ${chartMetric === 'workouts' ? 'bg-amber-500 text-black' : 'text-white/60'}`}>Workouts</button>
                </div>
              </div>
              <WeeklyProgressChart weeks={weeks} metric={chartMetric} />
            </section>

            {recentWorkouts === 0 && (
              <div className={`${cardClass} mb-6 flex flex-wrap items-center justify-between gap-4 p-5`}>
                <p className="text-sm text-white/70">Complete a workout to start building your trend.</p>
                <button onClick={() => navigate('/workout/log')} className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400">Start workout <ArrowRight size={16} /></button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <section className={`${cardClass} p-5 md:p-7`}>
                <h2 className="mb-5 text-xl font-bold">Recent workouts</h2>
                {data.sessions.length === 0 ? (
                  <p className="text-sm text-white/50">No completed workouts in the last four weeks.</p>
                ) : (
                  <div className="space-y-1">
                    {data.sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between gap-3 border-b border-white/5 py-3 last:border-0">
                        <div>
                          <p className="font-semibold">{session.splitDayLabel || 'Freestyle Workout'}</p>
                          <p className="mt-1 text-xs text-white/50">{formatDate(session.startTime)} · {session.sets?.length || 0} sets</p>
                        </div>
                        <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-amber-400">{numberFormatter.format(Number(session.totalVolumeKg) || 0)} kg</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className={`${cardClass} p-5 md:p-7`}>
                <h2 className="mb-5 text-xl font-bold">Personal records</h2>
                {data.records.length === 0 ? (
                  <p className="text-sm text-white/50">Log a set to begin tracking your personal records.</p>
                ) : (
                  <div className="space-y-1">
                    {data.records.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between gap-3 border-b border-white/5 py-3 last:border-0">
                        <div>
                          <p className="font-semibold">{record.exerciseName || 'Exercise'}</p>
                          <p className="mt-1 text-xs text-white/50">{formatDate(record.achievedAt)} · Estimated 1RM</p>
                        </div>
                        <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-amber-400">{numberFormatter.format(Number(record.estimated1rm) || 0)} kg</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
