import { createElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, CalendarDays, Clock3, Dumbbell, Flame, LayoutList, Play, RefreshCw, Trophy } from 'lucide-react';
import { getActiveWorkout, getDashboard, getPRs } from '../../../services/apiClient';
import { useAuth } from '../../../common/context/AuthContext';

const quickLinks = [
  { label: 'My Split', detail: 'Plan your training', icon: LayoutList, path: '/splits' },
  { label: 'Exercises', detail: 'Find a movement', icon: BookOpen, path: '/exercises' },
  { label: 'History', detail: 'Past workouts', icon: Clock3, path: '/workout/history' },
  { label: 'Progress', detail: 'See your gains', icon: BarChart3, path: '/progress' },
];

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const panelStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' };

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ icon, label, value, loading }) {
  return (
    <div className="min-w-0 rounded-2xl border p-3 sm:p-5" style={panelStyle}>
      <span className="mb-3 block text-amber-500" aria-hidden="true">{icon}</span>
      {loading ? <span className="mb-1 block h-7 w-12 animate-pulse rounded" style={{ background: 'var(--color-bg-tertiary)' }} /> : <strong className="block text-2xl font-black tabular-nums sm:text-3xl">{value}</strong>}
      <span className="mt-1 block text-[10px] font-bold uppercase leading-tight tracking-wide sm:text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  );
}

function WeeklyVolume({ volume }) {
  const values = weekdays.map((day) => Math.max(0, Number(volume?.[day]) || 0));
  const maximum = Math.max(1, ...values);
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <section className="rounded-2xl border p-5 sm:p-6" style={panelStyle} aria-labelledby="weekly-volume-title">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Last 7 days</p>
          <h2 id="weekly-volume-title" className="mt-1 text-lg font-extrabold">Training volume</h2>
        </div>
        <span className="text-sm font-extrabold tabular-nums text-amber-500">{numberFormatter.format(total)} kg</span>
      </div>
      <div role="img" aria-label={`Training volume by weekday: ${weekdays.map((day, index) => `${day} ${numberFormatter.format(values[index])} kilograms`).join(', ')}`} className="grid grid-cols-7 items-end gap-2">
        {weekdays.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end overflow-hidden rounded-t-lg bg-amber-500/5">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400" style={{ height: `${values[index] > 0 ? Math.max(6, (values[index] / maximum) * 100) : 0}%` }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--color-text-secondary)' }}>{day}</span>
          </div>
        ))}
      </div>
      {total === 0 && <p className="mt-4 text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>Your volume will appear after a completed workout.</p>}
    </section>
  );
}

function TodayPlan({ plan, onOpenSplit, onStartWorkout, hasActiveWorkout }) {
  if (!plan) {
    return (
      <section className="rounded-2xl border p-5 sm:p-6" style={panelStyle}>
        <CalendarDays size={22} className="mb-4 text-amber-500" aria-hidden="true" />
        <h2 className="text-lg font-extrabold">Your training plan</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>No workout is scheduled for today. Open My Split to review or choose a plan.</p>
        <button type="button" onClick={onOpenSplit} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-extrabold text-black">Open My Split <ArrowRight size={16} aria-hidden="true" /></button>
      </section>
    );
  }

  if (plan.isRestDay) {
    return (
      <section className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-[#182337] to-[#101015] p-5 text-white sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-sky-300">Today’s plan</p>
        <h2 className="mt-2 text-xl font-black">Recovery day</h2>
        <p className="mt-2 text-sm text-white/65">Your {plan.splitName || 'training'} split has a rest day today. Take time to recover.</p>
        <button type="button" onClick={onOpenSplit} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-300">View your split <ArrowRight size={16} aria-hidden="true" /></button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border p-5 sm:p-6" style={panelStyle} aria-labelledby="today-plan-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Today’s plan · {plan.splitName}</p>
          <h2 id="today-plan-title" className="mt-2 text-xl font-black">{plan.label || 'Workout day'}</h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{plan.exerciseCount || 0} planned exercises{plan.muscleGroups ? ` · ${plan.muscleGroups}` : ''}</p>
        </div>
        <Dumbbell size={24} className="shrink-0 text-amber-500" aria-hidden="true" />
      </div>
      {plan.exercises?.length > 0 && <ul className="mt-5 space-y-2 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>{plan.exercises.map((exercise, index) => <li key={`${exercise.name}-${index}`} className="flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium">{exercise.name}</span><span className="shrink-0 text-xs font-bold text-amber-500">{exercise.sets} × {exercise.reps}</span></li>)}</ul>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={onStartWorkout} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-extrabold text-black sm:flex-none">{hasActiveWorkout ? 'Resume workout' : 'Start this workout'} <ArrowRight size={16} aria-hidden="true" /></button>
        <button type="button" onClick={onOpenSplit} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border px-4 text-sm font-bold sm:flex-none" style={{ borderColor: 'var(--color-border)' }}>View split</button>
      </div>
    </section>
  );
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [prCount, setPrCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getDashboard(), getActiveWorkout(), getPRs()]).then(([dashboardResult, workoutResult, prsResult]) => {
      if (cancelled) return;
      if (dashboardResult.status === 'rejected') {
        setError(dashboardResult.reason?.message || 'Could not load your dashboard.');
        return;
      }
      setDashboard(dashboardResult.value.data?.data || {});
      setActiveWorkout(workoutResult.status === 'fulfilled' ? workoutResult.value.data?.data || null : null);
      const records = prsResult.status === 'fulfilled' ? prsResult.value.data?.data : null;
      setPrCount(Array.isArray(records) ? records.length : null);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const refresh = () => {
    setError('');
    setLoading(true);
    setReloadKey((value) => value + 1);
  };

  const firstName = (user?.name || dashboard?.name || '').trim().split(/\s+/)[0] || 'there';
  const plan = dashboard?.todayWorkout;
  const workoutPath = activeWorkout ? '/workout/log' : plan && !plan.isRestDay ? `/workout/log?splitDayId=${plan.dayId}` : '/workout/log';
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="min-h-screen pb-32 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500">WellFitness · {dateLabel}</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{greeting()}, {firstName}.</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Here’s what your training looks like today.</p>
          </div>
          <button type="button" onClick={refresh} disabled={loading} aria-label="Refresh dashboard" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-amber-500 transition hover:bg-amber-500/10 disabled:opacity-50" style={{ borderColor: 'var(--color-border)' }}><RefreshCw size={18} aria-hidden="true" /></button>
        </header>

        <section className="relative mb-5 overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17110b] text-white shadow-[0_22px_70px_rgba(0,0,0,0.2)]" aria-labelledby="home-workout-title">
          <img src="/exercise-images/barbell-squat.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120e09] via-[#120e09]/90 to-[#120e09]/30" aria-hidden="true" />
          <div className="relative flex min-h-64 flex-col justify-between p-6 sm:min-h-72 sm:p-8">
            <div>
              <span className="inline-flex rounded-full border border-amber-400/30 bg-black/35 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">{activeWorkout ? 'Workout in progress' : 'Ready to train'}</span>
              <h2 id="home-workout-title" className="mt-5 max-w-md text-3xl font-black leading-tight tracking-tight sm:text-4xl">{activeWorkout ? 'Finish what you started.' : 'Your next workout starts here.'}</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">{activeWorkout ? 'Your session is waiting. Pick up your sets where you left off.' : 'Build consistency, one great session at a time.'}</p>
            </div>
            <button type="button" onClick={() => navigate(workoutPath)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-amber-400 active:scale-[0.99] sm:w-fit"><Play size={17} fill="currentColor" aria-hidden="true" /> {activeWorkout ? 'Resume workout' : 'Start workout'} <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </section>

        {error && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"><span>{error}</span><button type="button" onClick={refresh} className="font-bold underline">Try again</button></div>}

        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard icon={<Dumbbell size={20} />} label="Workouts" value={dashboard?.totalWorkouts ?? '—'} loading={loading} />
          <StatCard icon={<Flame size={20} />} label="Day streak" value={dashboard?.streak?.current ?? '—'} loading={loading} />
          <StatCard icon={<Trophy size={20} />} label="Personal records" value={prCount ?? '—'} loading={loading} />
        </div>

        {!loading && !error && <div className="mb-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><TodayPlan plan={plan} hasActiveWorkout={Boolean(activeWorkout)} onOpenSplit={() => navigate('/splits')} onStartWorkout={() => navigate(workoutPath)} /><WeeklyVolume volume={dashboard?.weeklyVolume} /></div>}

        {!loading && !error && dashboard?.recentPRs?.length > 0 && (
          <section className="mb-6 rounded-2xl border p-5 sm:p-6" style={panelStyle} aria-labelledby="recent-pr-title">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 id="recent-pr-title" className="text-lg font-extrabold">Recent personal records</h2><Trophy size={20} className="text-amber-500" aria-hidden="true" /></div>
            <div className="grid gap-2 sm:grid-cols-2">{dashboard.recentPRs.slice(0, 2).map((record, index) => <div key={`${record.exerciseName}-${index}`} className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: 'var(--color-bg-tertiary)' }}><span className="min-w-0 truncate text-sm font-semibold">{record.exerciseName}</span><span className="shrink-0 text-xs font-extrabold text-amber-500">{numberFormatter.format(Number(record.weightKg) || 0)} kg × {record.reps}</span></div>)}</div>
          </section>
        )}

        <section aria-labelledby="home-links-title">
          <h2 id="home-links-title" className="mb-4 text-lg font-extrabold">Explore WellFitness</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {quickLinks.map(({ label, detail, icon, path }) => <button key={path} type="button" onClick={() => navigate(path)} className="group flex min-h-32 flex-col justify-between rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-500/40 sm:min-h-36 sm:p-5" style={panelStyle}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">{createElement(icon, { size: 21, 'aria-hidden': true })}</span>
              <span><strong className="block text-sm font-extrabold sm:text-base">{label}</strong><span className="mt-0.5 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>{detail}</span></span>
            </button>)}
          </div>
        </section>
      </main>
    </div>
  );
}
