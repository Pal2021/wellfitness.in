import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Cpu, Dumbbell, LayoutList, Plus, Sparkles, TrendingUp, Utensils, UserRound } from 'lucide-react';
import { saveGuestAction } from '../../common/guestIntent';

const exercises = [
  { name: 'Lat pulldown', group: 'Back', image: '/exercise-images/lat-pulldown.jpg', detail: '3 sets · 8–12 reps' },
  { name: 'Barbell squat', group: 'Legs', image: '/exercise-images/barbell-squat.jpg', detail: '3 sets · 6–10 reps' },
  { name: 'Bench press', group: 'Chest', image: '/exercise-images/barbell-bench-press.jpg', detail: '3 sets · 6–10 reps' },
];

const tools = [
  { label: 'My Split', path: '/splits', icon: LayoutList, detail: 'Plan training days' },
  { label: 'Exercises', path: '/exercises', icon: BookOpen, detail: 'Explore movements' },
  { label: 'History', path: '/workout/history', icon: Clock3, detail: 'Review sessions' },
  { label: 'Progress', path: '/progress', icon: TrendingUp, detail: 'Follow your lifts' },
];

const panel = 'rounded-3xl border border-white/10 bg-[#1b1b1b] p-5 sm:p-6';
const muted = 'text-sm leading-relaxed text-white/55';

function SampleNote() {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-100"><span><strong>Sample preview</strong> · Explore the app before creating an account.</span><Link to="/login" className="font-bold text-amber-400 underline underline-offset-4">Already a member? Log in</Link></div>;
}

function ActionButton({ action, children, question = '', secondary = false }) {
  const navigate = useNavigate();
  return <button type="button" onClick={() => { saveGuestAction(action, question); navigate('/register'); }} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold transition active:scale-[0.99] ${secondary ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10' : 'bg-amber-500 text-black hover:bg-amber-400'}`}>{children}<ArrowRight size={17} aria-hidden="true" /></button>;
}

function PageHeading({ eyebrow, title, description, icon: Icon }) {
  const IconComponent = Icon;
  return <header className="mb-6"><p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500"><IconComponent size={16} aria-hidden="true" />{eyebrow}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-white/55">{description}</p></header>;
}

function ExerciseCards() {
  return <div className="grid gap-3 sm:grid-cols-3">{exercises.map((exercise) => <article key={exercise.name} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b]"><img src={exercise.image} alt="" className="h-40 w-full object-cover" loading="lazy" /><div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-400">{exercise.group}</p><h3 className="mt-1 text-lg font-bold">{exercise.name}</h3><p className="mt-1 text-sm text-white/50">{exercise.detail}</p></div></article>)}</div>;
}

function DashboardPreview() {
  return <><PageHeading eyebrow="Your training starts here" title="Welcome to WellFitness" description="Take a look around. Your own numbers appear after you join." icon={Dumbbell} /><section className="relative mb-5 overflow-hidden rounded-3xl border border-amber-500/20 bg-[#1a1209] p-6 sm:p-9"><img src="/exercise-images/deadlift.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-r from-[#1a1209] via-[#1a1209]/90 to-transparent" /><div className="relative"><span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Ready to train</span><h2 className="mt-4 max-w-lg text-3xl font-black">Your next workout starts here.</h2><p className="mt-2 max-w-md text-sm text-white/70">Track sets, follow progress, and build a routine that fits you.</p><div className="mt-6"><ActionButton action="workout">Start workout</ActionButton></div></div></section><div className="mb-6 grid grid-cols-3 gap-3">{[['6', 'Workouts'], ['2', 'Week streak'], ['3', 'Records']].map(([value, label]) => <div className={panel} key={label}><strong className="block text-2xl text-amber-400">{value}</strong><span className="text-[11px] font-bold uppercase text-white/50">{label}</span></div>)}</div><h2 className="mb-3 text-xl font-bold">Explore your tools</h2><ToolCards /></>;
}

function ToolCards() {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{tools.map(({ label, path, icon, detail }) => { const IconComponent = icon; return <Link key={path} to={path} className={`${panel} block transition hover:border-amber-500/50`}><IconComponent className="mb-4 text-amber-400" size={22} /><h3 className="font-bold">{label}</h3><p className="mt-1 text-xs text-white/50">{detail}</p></Link>; })}</div>;
}

function WorkoutPreview() {
  return <><PageHeading eyebrow="Your training" title="Workout" description="See how planning, training, and review work together." icon={Dumbbell} /><div className={`${panel} mb-7 bg-gradient-to-br from-[#33200b] to-[#1b1b1b]`}><p className="text-xs font-bold uppercase tracking-widest text-amber-400">Example workout · Pull day</p><h2 className="mt-3 text-2xl font-black">Build a stronger back.</h2><p className={`mt-2 ${muted}`}>Lat pulldown, cable row, and curls. Log your own sets when you start.</p><div className="mt-6"><ActionButton action="workout">Start workout</ActionButton></div></div><h2 className="mb-3 text-xl font-bold">Workout tools</h2><ToolCards /></>;
}

function CoachPreview() {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();
  const ask = (value) => { saveGuestAction('coach', value); navigate('/register'); };
  return <><PageHeading eyebrow="WellFitness AI" title="Your AI Coach" description="Once you join, the coach can use your goals, meals, and workout history." icon={Cpu} /><div className={`${panel} mb-5`}><p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Illustrative example</p><div className="ml-auto mt-5 w-fit max-w-[85%] rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black">Am I improving on lat pulldowns?</div><div className="mt-3 max-w-[90%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/80">Your example sessions show 10 reps at 40 kg, then 10 reps at 42.5 kg. That is progress at the same rep count. Keep your form steady and build from there.</div><p className="mt-4 text-xs text-white/45">This is a written example, not a live response or your personal data.</p></div><form onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question.trim()); }} className={`${panel} flex flex-col gap-3 sm:flex-row`}><label htmlFor="guest-coach-question" className="sr-only">Ask the AI Coach</label><input id="guest-coach-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder="Ask about your training or diet…" className="min-h-12 flex-1 rounded-xl border border-white/15 bg-black/30 px-4 text-base outline-none focus:border-amber-500" /><button type="submit" disabled={!question.trim()} className="min-h-12 rounded-xl bg-amber-500 px-5 font-bold text-black disabled:opacity-50">Ask the coach</button></form><p className="mt-3 text-xs text-white/50">Your question will be ready to send after sign-up and onboarding.</p></>;
}

function DietPreview() {
  return <><PageHeading eyebrow="Nutrition" title="Diet diary" description="A sample day shows how meals and daily totals appear." icon={Utensils} /><div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['1,840', 'Calories'], ['118 g', 'Protein'], ['205 g', 'Carbs'], ['58 g', 'Fat']].map(([value, label]) => <div className={panel} key={label}><strong className="block text-xl text-amber-400">{value}</strong><span className="text-xs text-white/50">{label}</span></div>)}</div><section className={panel}><h2 className="mb-4 text-xl font-bold">Sample meals</h2>{[['Breakfast', 'Oats, yogurt & berries', '420 kcal'], ['Lunch', 'Chicken rice bowl', '650 kcal'], ['Dinner', 'Paneer wrap & salad', '590 kcal'], ['Snack', 'Banana & almonds', '180 kcal']].map(([meal, food, calories]) => <div key={meal} className="flex items-center justify-between gap-3 border-t border-white/10 py-4"><div><p className="text-xs font-bold uppercase text-amber-400">{meal}</p><p className="mt-1 font-semibold">{food}</p></div><span className="shrink-0 text-xs text-white/50">{calories}</span></div>)}<div className="mt-3"><ActionButton action="food"><Plus size={17} /> Log food</ActionButton></div></section></>;
}

function ProgressPreview() {
  return <><PageHeading eyebrow="Training trends" title="Progress" description="Review every session for each exercise once you start logging." icon={TrendingUp} /><section className={panel}><p className="text-xs font-bold uppercase text-amber-400">Example · Lat pulldown</p><h2 className="mt-2 text-2xl font-black">Stronger each session</h2><div className="mt-6 flex h-36 items-end gap-3 border-b border-white/15 pb-1">{[40, 42.5, 45, 47.5, 50].map((weight) => <div key={weight} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs text-white/60">{weight}</span><div className="w-full max-w-16 rounded-t-lg bg-gradient-to-t from-amber-700 to-amber-400" style={{ height: `${weight * 2}px` }} /></div>)}</div><p className="mt-3 text-xs text-white/50">Sample weights in kg across five sessions</p></section></>;
}

function HistoryPreview() {
  return <><PageHeading eyebrow="Training record" title="Workout history" description="Completed sessions appear here with every exercise and set." icon={Clock3} /><div className="space-y-3">{[['Pull day', 'Lat pulldown · Cable row · Biceps curl', '18 sets'], ['Leg day', 'Barbell squat · Romanian deadlift · Lunges', '16 sets'], ['Push day', 'Bench press · Shoulder press · Triceps pushdown', '17 sets']].map(([title, detail, sets]) => <article className={panel} key={title}><div className="flex justify-between gap-3"><h2 className="text-lg font-bold">{title}</h2><span className="text-xs text-amber-400">{sets}</span></div><p className={`mt-2 ${muted}`}>{detail}</p></article>)}</div></>;
}

function SplitPreview() {
  return <><PageHeading eyebrow="Your routine" title="My Split" description="Organize training days around your schedule." icon={LayoutList} /><div className="grid gap-3 sm:grid-cols-3">{[['Monday', 'Push', 'Chest · Shoulders · Triceps'], ['Wednesday', 'Pull', 'Back · Biceps'], ['Friday', 'Legs', 'Quads · Hamstrings · Glutes']].map(([day, title, focus]) => <article className={panel} key={day}><p className="text-xs font-bold uppercase text-amber-400">{day}</p><h2 className="mt-3 text-xl font-black">{title}</h2><p className={`mt-1 ${muted}`}>{focus}</p></article>)}</div><div className="mt-6"><ActionButton action="split">Build my split</ActionButton></div></>;
}

function ProfilePreview() {
  return <><PageHeading eyebrow="Your space" title="Profile" description="Your goals, body metrics, and settings live here after sign-up." icon={UserRound} /><div className={panel}><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400"><UserRound size={30} /></div><div><h2 className="text-xl font-bold">Your fitness profile</h2><p className={muted}>Make the experience yours.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[['Goal', 'Build strength'], ['Body metrics', 'Track changes'], ['Training plan', 'Set your schedule']].map(([label, value]) => <div key={label} className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/50">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div><div className="mt-6"><ActionButton action="profile">Set up my profile</ActionButton></div></div></>;
}

export default function GuestPreview() {
  const { pathname } = useLocation();
  let content;
  if (pathname === '/dashboard') content = <DashboardPreview />;
  else if (pathname === '/workout') content = <WorkoutPreview />;
  else if (pathname === '/ai-coach') content = <CoachPreview />;
  else if (pathname === '/diet') content = <DietPreview />;
  else if (pathname === '/progress') content = <ProgressPreview />;
  else if (pathname === '/workout/history') content = <HistoryPreview />;
  else if (pathname === '/splits') content = <SplitPreview />;
  else if (pathname === '/profile') content = <ProfilePreview />;
  else if (pathname.startsWith('/exercises')) content = <><PageHeading eyebrow="Movement library" title="Exercise library" description="Get to know the movements you can add to a workout." icon={BookOpen} /><ExerciseCards /><div className="mt-6"><ActionButton action="workout">Use an exercise in a workout</ActionButton></div></>;
  else content = <DashboardPreview />;
  return <div className="min-h-screen bg-[#101010] pb-32 text-white md:pb-12"><main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10"><SampleNote />{content}<div className="mt-8 flex flex-wrap gap-3"><Link to="/dashboard" className="text-sm font-bold text-amber-400 hover:underline">Back to home</Link><span className="text-white/25">·</span><Link to="/register" className="text-sm font-bold text-white/70 hover:text-white">Create an account</Link></div></main></div>;
}
