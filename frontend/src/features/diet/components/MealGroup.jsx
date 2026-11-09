import { Apple, Coffee, Moon, Plus, Sun } from 'lucide-react';

const groups = {
  BREAKFAST: { label: 'Breakfast', icon: Coffee },
  LUNCH: { label: 'Lunch', icon: Sun },
  DINNER: { label: 'Dinner', icon: Moon },
  SNACK: { label: 'Snacks', icon: Apple },
};

export default function MealGroup({ type, entries, onAdd, onEdit }) {
  const group = groups[type];
  const Icon = group.icon;
  const total = entries.reduce((sum, entry) => sum + (Number(entry.calories) || 0), 0);

  return <section className="overflow-hidden rounded-2xl border" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
    <div className="flex items-center gap-3 p-4 sm:p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><Icon size={20} aria-hidden="true" /></span><div className="min-w-0 flex-1"><h3 className="text-base font-extrabold">{group.label}</h3><p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{entries.length ? `${total} kcal logged` : 'Nothing logged yet'}</p></div><button type="button" onClick={onAdd} aria-label={`Add ${group.label.toLowerCase()} food`} className="flex min-h-10 items-center gap-1 rounded-xl bg-amber-500/10 px-3 text-xs font-bold text-amber-500 transition hover:bg-amber-500/20"><Plus size={16} /> Add</button></div>
    {entries.length > 0 && <ul className="border-t" style={{ borderColor: 'var(--color-border)' }}>{entries.map((entry) => <li key={entry.id}><button type="button" onClick={() => onEdit(entry)} className="flex min-h-16 w-full items-center justify-between gap-3 border-b px-4 py-3 text-left transition hover:bg-amber-500/5 last:border-b-0 sm:px-5" style={{ borderColor: 'var(--color-border)' }}><span className="min-w-0"><span className="block truncate text-sm font-bold">{entry.foodName}</span><span className="mt-0.5 block truncate text-xs" style={{ color: 'var(--color-text-secondary)' }}>{entry.serving || 'Tap to edit'}{[entry.proteinGrams, entry.carbsGrams, entry.fatGrams].some((value) => value != null) ? ` · P ${entry.proteinGrams ?? '—'} · C ${entry.carbsGrams ?? '—'} · F ${entry.fatGrams ?? '—'} g` : ''}</span></span><span className="shrink-0 text-sm font-extrabold tabular-nums text-amber-500">{entry.calories} kcal</span></button></li>)}</ul>}
  </section>;
}
