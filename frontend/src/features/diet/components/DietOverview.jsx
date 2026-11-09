import { Pencil } from 'lucide-react';

const macroItems = [
  { key: 'proteinGrams', label: 'Protein', color: 'bg-sky-400' },
  { key: 'carbsGrams', label: 'Carbs', color: 'bg-amber-400' },
  { key: 'fatGrams', label: 'Fat', color: 'bg-rose-400' },
];

function percent(value, target) {
  return target > 0 ? Math.min(100, Math.round((Number(value) / Number(target)) * 100)) : 0;
}

export default function DietOverview({ totals, targets, onEditTargets }) {
  const calories = Number(totals?.calories) || 0;
  const targetCalories = Number(targets?.calories) || 0;
  const remaining = targetCalories - calories;

  return <section aria-labelledby="diet-overview-title" className="overflow-hidden rounded-3xl border border-amber-500/20 bg-[#17110b] p-5 text-white sm:p-7">
    <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">Daily overview</p><h2 id="diet-overview-title" className="mt-1 text-xl font-black">Your nutrition</h2></div><button type="button" onClick={onEditTargets} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 px-3 text-xs font-bold text-white transition hover:bg-white/10"><Pencil size={14} /> Targets</button></div>
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full p-3" style={{ background: `conic-gradient(#f59e0b ${percent(calories, targetCalories)}%, rgba(255,255,255,.1) 0)` }}>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#17110b]"><strong className="text-3xl font-black tabular-nums">{calories.toLocaleString()}</strong><span className="text-[11px] font-bold uppercase tracking-wider text-white/55">kcal logged</span></div>
      </div>
      <div className="min-w-0 flex-1"><p className="text-sm font-bold">{targetCalories ? `${targetCalories.toLocaleString()} kcal target` : 'No calorie target set'}</p><p className="mt-1 text-xs leading-relaxed text-white/60">{targetCalories ? remaining >= 0 ? `${remaining.toLocaleString()} kcal until your target` : `${Math.abs(remaining).toLocaleString()} kcal above your target` : 'You can still log meals without setting targets.'}</p><div className="mt-5 grid grid-cols-3 gap-2">{macroItems.map(({ key, label, color }) => { const value = Number(totals?.[key]) || 0; const target = Number(targets?.[key]) || 0; return <div key={key} className="min-w-0 rounded-xl bg-white/5 p-3"><span className="block text-[10px] font-bold uppercase tracking-wide text-white/55">{label}</span><strong className="mt-1 block text-sm font-black tabular-nums">{value.toFixed(1)} g</strong><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent(value, target)}%` }} /></div><span className="mt-1 block text-[10px] text-white/50">{target ? `of ${target.toFixed(1)} g` : 'No target'}</span></div>; })}</div></div>
    </div>
  </section>;
}
