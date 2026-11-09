import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getMealSuggestions } from '../../../services/apiClient';

export default function MealIdeas({ date, onLogIdea }) {
  const [mealType, setMealType] = useState('LUNCH');
  const [preferences, setPreferences] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const suggest = async () => {
    setLoading(true);
    setError('');
    setIdeas([]);
    try {
      const response = await getMealSuggestions({ date, mealType, preferences: preferences.trim() });
      setIdeas(response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not get meal ideas.');
    } finally {
      setLoading(false);
    }
  };

  return <section aria-labelledby="meal-ideas-title" className="rounded-2xl border p-5 sm:p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
    <div className="mb-5 flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"><Sparkles size={22} aria-hidden="true" /></span><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-violet-400">Azure AI · GPT-5</p><h2 id="meal-ideas-title" className="mt-1 text-xl font-black">Meal ideas for you</h2><p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Get ideas using this day’s log and your targets.</p></div></div>
    <div className="space-y-4">
      <label className="block text-sm font-bold">Which meal?<select value={mealType} onChange={(event) => { setMealType(event.target.value); setIdeas([]); }} className="mt-2 min-h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-violet-400" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}><option value="BREAKFAST">Breakfast</option><option value="LUNCH">Lunch</option><option value="DINNER">Dinner</option><option value="SNACK">Snack</option></select></label>
      <label className="block text-sm font-bold">Preferences or ingredients to avoid<textarea value={preferences} onChange={(event) => setPreferences(event.target.value)} maxLength={500} rows={3} placeholder="e.g. vegetarian, no peanuts, quick meals" className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-violet-400" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} /></label>
      <button type="button" onClick={suggest} disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 text-sm font-extrabold text-white transition hover:bg-violet-400 disabled:opacity-60"><Sparkles size={17} aria-hidden="true" />{loading ? 'Thinking of ideas…' : 'Suggest meals'}</button>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Your food names, daily totals, targets, and the preferences you enter are sent to your Azure AI deployment only when you tap Suggest. Check ingredients yourself for allergies.</p>
      {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      {ideas.length > 0 && <div role="status" className="space-y-3 pt-2">{ideas.map((idea, index) => <article key={`${idea.title}-${index}`} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-tertiary)' }}><p className="text-[11px] font-bold uppercase tracking-wide text-violet-400">Idea {index + 1}</p><h3 className="mt-1 text-base font-extrabold">{idea.title}</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{idea.description}</p><button type="button" onClick={() => onLogIdea(idea.title, mealType)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-amber-500">Log this meal <ArrowRight size={15} aria-hidden="true" /></button></article>)}<p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Ideas are suggestions, not verified nutrition values. Enter the amounts you eat when logging.</p></div>}
    </div>
  </section>;
}
