import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { addMealEntry, deleteMealEntry, getDietDay, saveNutritionTargets, updateMealEntry } from '../../../services/apiClient';
import DietOverview from '../components/DietOverview';
import { MealEditor, TargetEditor } from '../components/DietDialogs';
import MealGroup from '../components/MealGroup';
import MealIdeas from '../components/MealIdeas';

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromString(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function offsetDate(value, days) {
  const date = dateFromString(value);
  date.setDate(date.getDate() + days);
  return localDate(date);
}

function requestMessage(error) {
  return error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
}

export default function DietScreen() {
  const [date, setDate] = useState(() => localDate());
  const [reloadKey, setReloadKey] = useState(0);
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeMeal, setActiveMeal] = useState(null);
  const [showTargets, setShowTargets] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [feedback, setFeedback] = useState('');
  const today = localDate();

  useEffect(() => {
    let active = true;
    getDietDay(date).then((response) => {
      if (active) setDay(response.data?.data || null);
    }).catch((error) => {
      if (active) setLoadError(requestMessage(error));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [date, reloadKey]);

  const changeDate = (nextDate) => {
    setDate(nextDate);
    setDay(null);
    setLoading(true);
    setLoadError('');
    setFeedback('');
  };

  const refresh = () => {
    setLoading(true);
    setLoadError('');
    setReloadKey((value) => value + 1);
  };

  const openMeal = (mealType, entry = null, initialName = '') => {
    setActionError('');
    setActiveMeal({ mealType, entry, initialName });
  };

  const saveMeal = async (payload) => {
    setBusy(true);
    setActionError('');
    try {
      if (activeMeal.entry) await updateMealEntry(activeMeal.entry.id, payload);
      else await addMealEntry(payload);
      setActiveMeal(null);
      setFeedback('Food saved.');
      refresh();
    } catch (error) {
      setActionError(requestMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const removeMeal = async () => {
    if (!activeMeal?.entry) return;
    setBusy(true);
    setActionError('');
    try {
      await deleteMealEntry(activeMeal.entry.id);
      setActiveMeal(null);
      setFeedback('Food deleted.');
      refresh();
    } catch (error) {
      setActionError(requestMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const saveTargets = async (payload) => {
    setBusy(true);
    setActionError('');
    try {
      await saveNutritionTargets(payload);
      setShowTargets(false);
      setFeedback('Targets saved.');
      refresh();
    } catch (error) {
      setActionError(requestMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const displayDate = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(dateFromString(date));
  const entries = day?.entries || [];

  return <div className="min-h-screen pb-32 md:pb-12" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-500"><UtensilsCrossed size={16} aria-hidden="true" /> WellFitness nutrition</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Diet diary</h1><p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Log what you eat and see your day at a glance.</p></div><button type="button" onClick={() => openMeal('SNACK')} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-extrabold text-black transition hover:bg-amber-400 sm:w-auto"><Plus size={18} aria-hidden="true" /> Log food</button></header>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border p-3 sm:p-4" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}><button type="button" onClick={() => changeDate(offsetDate(date, -1))} aria-label="Previous day" className="flex h-11 w-11 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--color-border)' }}><ChevronLeft size={20} /></button><div className="min-w-0 flex-1 text-center"><p className="text-[11px] font-bold uppercase tracking-widest text-amber-500">{date === today ? 'Today' : 'Food diary'}</p><p className="truncate text-sm font-extrabold sm:text-base">{displayDate}</p></div><button type="button" onClick={() => changeDate(offsetDate(date, 1))} disabled={date >= today} aria-label="Next day" className="flex h-11 w-11 items-center justify-center rounded-xl border disabled:opacity-30" style={{ borderColor: 'var(--color-border)' }}><ChevronRight size={20} /></button>{date !== today && <button type="button" onClick={() => changeDate(today)} className="min-h-11 rounded-xl border px-3 text-xs font-bold text-amber-500" style={{ borderColor: 'var(--color-border)' }}>Today</button>}</div>

      {feedback && <p role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">{feedback}</p>}
      {loadError && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"><span>{loadError}</span><button type="button" onClick={refresh} className="inline-flex items-center gap-1 font-bold"><RefreshCw size={15} /> Retry</button></div>}

      {loading ? <div className="rounded-3xl border p-8 text-center text-sm" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Loading your diary…</div> : day && <>
        <DietOverview totals={day.totals} targets={day.targets} onEditTargets={() => { setActionError(''); setShowTargets(true); }} />
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <section aria-labelledby="meals-title"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Your log</p><h2 id="meals-title" className="mt-1 text-xl font-black">Meals & snacks</h2></div><span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>{entries.length} {entries.length === 1 ? 'food' : 'foods'}</span></div><div className="space-y-3">{mealTypes.map((type) => <MealGroup key={type} type={type} entries={entries.filter((entry) => entry.mealType === type)} onAdd={() => openMeal(type)} onEdit={(entry) => openMeal(type, entry)} />)}</div></section>
          <MealIdeas key={`${date}-${reloadKey}`} date={date} onLogIdea={(title, type) => openMeal(type, null, title)} />
        </div>
      </>}
    </main>
    {activeMeal && <MealEditor key={`${activeMeal.entry?.id || activeMeal.mealType}-${activeMeal.initialName}-${date}`} entry={activeMeal.entry} mealType={activeMeal.mealType} initialName={activeMeal.initialName} date={date} busy={busy} error={actionError} onSave={saveMeal} onDelete={removeMeal} onClose={() => setActiveMeal(null)} />}
    {showTargets && <TargetEditor targets={day?.targets} busy={busy} error={actionError} onSave={saveTargets} onClose={() => setShowTargets(false)} />}
  </div>;
}
