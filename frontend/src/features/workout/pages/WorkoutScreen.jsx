import { createElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Clock3, Dumbbell, LayoutList, Play } from 'lucide-react';
import { getActiveSplit, getActiveWorkout } from '../../../services/apiClient';

const links = [
  { title: 'My Split', description: 'Plan your training days', icon: LayoutList, path: '/splits', image: '/exercise-images/barbell-row.jpg' },
  { title: 'Exercises', description: 'Explore the movement library', icon: BookOpen, path: '/exercises', image: '/exercise-images/lat-pulldown.jpg' },
  { title: 'History', description: 'Review completed sessions', icon: Clock3, path: '/workout/history', image: '/exercise-images/barbell-squat.jpg' },
  { title: 'Progress', description: 'See how your lifts improve', icon: BarChart3, path: '/progress', image: '/exercise-images/barbell-bench-press.jpg' },
];

export default function WorkoutScreen() {
  const navigate = useNavigate();
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [todayDay, setTodayDay] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getActiveWorkout(), getActiveSplit()]).then(([workoutResult, splitResult]) => {
      if (cancelled) return;
      if (workoutResult.status === 'fulfilled') setActiveWorkout(workoutResult.value.data?.data || null);
      const days = splitResult.status === 'fulfilled' ? splitResult.value.data?.data?.days || [] : [];
      const weekday = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      setTodayDay(days.find((day) => day.dayOfWeek === weekday) || null);
    });
    return () => { cancelled = true; };
  }, []);

  const startPath = activeWorkout
    ? '/workout/log'
    : todayDay && !todayDay.isRestDay
      ? `/workout/log?splitDayId=${todayDay.id}`
      : '/workout/log';

  return (
    <div className="min-h-screen pb-32 text-white md:pb-12" style={{ background: 'var(--color-bg-primary)' }}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500"><Dumbbell size={16} aria-hidden="true" /> Your training</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ color: 'var(--color-text-primary)' }}>Workout</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your next session is one tap away.</p>
        </header>

        <section className="relative mb-5 overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17110b] shadow-[0_22px_70px_rgba(0,0,0,0.2)]" aria-labelledby="workout-hero-title">
          <img src="/exercise-images/deadlift.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120e09] via-[#120e09]/90 to-[#120e09]/30" aria-hidden="true" />
          <div className="relative flex min-h-72 flex-col justify-between p-6 sm:min-h-80 sm:p-9">
            <div>
              <span className="inline-flex rounded-full border border-amber-400/30 bg-black/35 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">{activeWorkout ? 'Session in progress' : 'Ready when you are'}</span>
              <h2 id="workout-hero-title" className="mt-5 max-w-lg text-3xl font-black leading-tight tracking-tight sm:text-4xl">{activeWorkout ? 'Keep the momentum going.' : 'Make this workout count.'}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{activeWorkout ? 'Pick up where you left off and finish your sets.' : 'Log your sets, weight, and reps as you train.'}</p>
            </div>
            <button type="button" onClick={() => navigate(startPath)} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-black transition hover:bg-amber-400 active:scale-[0.99] sm:w-fit">
              <Play size={18} fill="currentColor" aria-hidden="true" /> {activeWorkout ? 'Resume workout' : 'Start workout'} <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </section>

        {todayDay && (
          <button type="button" onClick={() => navigate('/splits')} className="mb-8 flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition hover:border-amber-500/40" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Today in your split</p>
              <p className="mt-1 truncate text-base font-extrabold">{todayDay.label || (todayDay.isRestDay ? 'Rest day' : 'Workout day')}</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{todayDay.isRestDay ? 'Recovery is part of your plan' : `${todayDay.exercises?.length || 0} planned exercises`}</p>
            </div>
            <ArrowRight size={19} className="shrink-0 text-amber-500" aria-hidden="true" />
          </button>
        )}

        <section aria-labelledby="workout-tools-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="workout-tools-title" className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Workout tools</h2>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Plan · Train · Review</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {links.map(({ title, description, icon, path, image }) => (
              <button key={path} type="button" onClick={() => navigate(path)} className="group relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#17120e] p-4 text-left text-white transition hover:-translate-y-0.5 hover:border-amber-500/40 active:scale-[0.99] sm:min-h-48">
                <img src={image} alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10" aria-hidden="true" />
                <div className="relative">
                  {createElement(icon, { size: 22, className: 'mb-3 text-amber-400', 'aria-hidden': true })}
                  <h3 className="text-sm font-extrabold sm:text-base">{title}</h3>
                  <p className="mt-1 text-[11px] leading-snug text-white/65 sm:text-xs">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
