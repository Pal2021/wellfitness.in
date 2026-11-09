import { useEffect, useRef, useState } from 'react';
import { Sparkles, Trash2, X } from 'lucide-react';
import { estimateMealNutrition } from '../../../services/apiClient';

const fieldStyle = { background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' };
const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-amber-500';

function Dialog({ title, description, children, onClose, busy }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="diet-dialog-title" onKeyDown={(event) => { if (event.key === 'Escape' && !busy) onClose(); }} className="max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-3xl border p-5 shadow-2xl sm:rounded-3xl sm:p-7" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Diet diary</p><h2 id="diet-dialog-title" className="mt-1 text-2xl font-black">{title}</h2><p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p></div>
          <button type="button" disabled={busy} onClick={onClose} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--color-border)' }}><X size={20} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block text-sm font-bold">{label}{children}</label>;
}

function NumberField({ label, value, onChange, required = false, min = '0', max = 1000, step = '0.1' }) {
  return <Field label={label}><input type="number" inputMode="decimal" min={min} max={max} step={step} required={required} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>;
}

export function MealEditor({ entry, mealType, initialName = '', date, busy, error, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => ({
    mealType: entry?.mealType || mealType,
    foodName: entry?.foodName || initialName,
    serving: entry?.serving || '',
    remarks: entry?.remarks || '',
    calories: entry?.calories ?? '',
    proteinGrams: entry?.proteinGrams ?? '',
    carbsGrams: entry?.carbsGrams ?? '',
    fatGrams: entry?.fatGrams ?? '',
  }));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [localError, setLocalError] = useState('');
  const [estimating, setEstimating] = useState(false);
  const [estimateMessage, setEstimateMessage] = useState('');
  const [estimateError, setEstimateError] = useState('');
  const revision = useRef(0);
  const estimatePending = useRef(false);
  useEffect(() => () => { revision.current += 1; }, []);
  const set = (key, value) => {
    revision.current += 1;
    setLocalError('');
    setEstimateError('');
    setEstimateMessage('');
    setForm((current) => ({ ...current, [key]: value }));
  };
  const optionalNumber = (value) => value === '' ? null : Number(Number(value).toFixed(1));

  const estimate = async () => {
    if (busy || estimatePending.current) return;
    setEstimateMessage('');
    setEstimateError('');
    if (!form.foodName.trim() || !form.serving.trim()) {
      setEstimateError('Enter a food name and the serving you ate before estimating. Manual entry does not require a serving.');
      return;
    }
    estimatePending.current = true;
    setEstimating(true);
    const requestRevision = revision.current;
    try {
      const response = await estimateMealNutrition({ foodName: form.foodName.trim(), serving: form.serving.trim(), remarks: form.remarks.trim() });
      if (revision.current !== requestRevision) {
        setEstimateMessage('Your edits were kept. Estimate again to use the updated food details.');
        return;
      }
      const values = response.data?.data;
      if (!values || !Number.isInteger(values.calories) || values.calories < 0 || values.calories > 10000 ||
          ['proteinGrams', 'carbsGrams', 'fatGrams'].some((key) => !Number.isFinite(values[key]) || values[key] < 0 || values[key] > 1000)) {
        throw new Error('AI returned invalid nutrition values. Enter them manually or try again.');
      }
      setForm((current) => ({ ...current, calories: values.calories,
        proteinGrams: Number(values.proteinGrams.toFixed(1)), carbsGrams: Number(values.carbsGrams.toFixed(1)), fatGrams: Number(values.fatGrams.toFixed(1)) }));
      setLocalError('');
      setEstimateMessage('AI estimate—not exact. Values are for the serving you ate. Review or edit every value, then Save food.');
    } catch (requestError) {
      if (revision.current === requestRevision) {
        setEstimateError(requestError.response?.data?.message || requestError.message || 'Could not estimate nutrition.');
      }
    } finally {
      estimatePending.current = false;
      setEstimating(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const calories = Number(form.calories);
    if (!form.foodName.trim() || form.calories === '' || !Number.isInteger(calories) || calories < 0 || calories > 10000) {
      setLocalError('Enter a food name and calories between 0 and 10,000.');
      return;
    }
    revision.current += 1;
    onSave({ loggedDate: date, mealType: form.mealType, foodName: form.foodName.trim(),
      serving: form.serving.trim(), remarks: form.remarks.trim(), calories,
      proteinGrams: optionalNumber(form.proteinGrams),
      carbsGrams: optionalNumber(form.carbsGrams),
      fatGrams: optionalNumber(form.fatGrams) });
  };

  return <Dialog title={entry ? 'Edit food' : 'Log food'} description="Enter values from the serving you ate. Macros are optional." busy={busy} onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Meal"><select value={form.mealType} onChange={(event) => set('mealType', event.target.value)} className={fieldClass} style={fieldStyle}>{['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map((type) => <option key={type} value={type}>{type[0] + type.slice(1).toLowerCase()}</option>)}</select></Field>
      <Field label="Food name"><input autoFocus required maxLength={120} placeholder="e.g. Oats with milk" value={form.foodName} onChange={(event) => set('foodName', event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
      <Field label="Serving (optional for manual entry)"><input maxLength={80} placeholder="e.g. Entire omelette made with 6 eggs" value={form.serving} onChange={(event) => set('serving', event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
      <Field label="Ingredients / remarks (optional)"><textarea maxLength={1000} rows={3} placeholder="e.g. 6 large eggs, 1 tsp butter, 50 g onion, 30 g cheese. Include quantities and cooking method." value={form.remarks} onChange={(event) => set('remarks', event.target.value)} className={`${fieldClass} py-3`} style={fieldStyle} /></Field>
      <div className="space-y-2 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
        <button type="button" onClick={estimate} disabled={busy || estimating} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-extrabold text-white hover:bg-violet-400 disabled:opacity-60"><Sparkles size={17} aria-hidden="true" />{estimating ? 'Estimating nutrition…' : 'Estimate nutrition with AI'}</button>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Optional: sends food name, serving, and remarks to Azure AI. Replaces the four nutrition values, but never saves automatically. AI estimates are not exact; you can always enter or edit values yourself.</p>
        {estimating && <p role="status" className="text-xs text-violet-400">You can keep editing or save manually. Your edits will not be overwritten.</p>}
        {estimateMessage && <p role="status" className="text-xs text-violet-400">{estimateMessage}</p>}
        {estimateError && <p role="alert" className="text-xs text-red-400">{estimateError} Your existing values are unchanged; you can still enter and save them manually.</p>}
      </div>
      <NumberField label="Calories (kcal)" value={form.calories} onChange={(value) => set('calories', value)} required max={10000} step="1" />
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Protein (g)" value={form.proteinGrams} onChange={(value) => set('proteinGrams', value)} />
        <NumberField label="Carbs (g)" value={form.carbsGrams} onChange={(value) => set('carbsGrams', value)} />
        <NumberField label="Fat (g)" value={form.fatGrams} onChange={(value) => set('fatGrams', value)} />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Daily macro totals include only values you enter.</p>
      {(localError || error) && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{localError || error}</p>}
      {entry && <div className="pt-1">{confirmDelete ? <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3"><span className="text-xs">Delete this food entry?</span><button type="button" disabled={busy} onClick={onDelete} className="text-sm font-bold text-red-500">Confirm delete</button></div> : <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm font-bold text-red-500"><Trash2 size={16} /> Delete entry</button>}</div>}
      <div className="flex gap-3 pt-2"><button type="button" disabled={busy} onClick={onClose} className="min-h-12 flex-1 rounded-xl border text-sm font-bold" style={{ borderColor: 'var(--color-border)' }}>Cancel</button><button type="submit" disabled={busy} className="min-h-12 flex-1 rounded-xl bg-amber-500 text-sm font-extrabold text-black disabled:opacity-60">{busy ? 'Saving…' : 'Save food'}</button></div>
    </form>
  </Dialog>;
}

export function TargetEditor({ targets, busy, error, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    calories: targets?.calories ?? '',
    proteinGrams: targets?.proteinGrams ?? '',
    carbsGrams: targets?.carbsGrams ?? '',
    fatGrams: targets?.fatGrams ?? '',
  }));
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toValue = (value) => value === '' ? null : Number(value);

  const submit = (event) => {
    event.preventDefault();
    onSave({ calories: toValue(form.calories), proteinGrams: toValue(form.proteinGrams),
      carbsGrams: toValue(form.carbsGrams), fatGrams: toValue(form.fatGrams) });
  };

  return <Dialog title="Daily targets" description="Set your own targets. Leave any value empty if you don't track it." busy={busy} onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <NumberField label="Calories (kcal)" value={form.calories} onChange={(value) => set('calories', value)} min="1" max={10000} step="1" />
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Protein (g)" value={form.proteinGrams} onChange={(value) => set('proteinGrams', value)} min="0.1" />
        <NumberField label="Carbs (g)" value={form.carbsGrams} onChange={(value) => set('carbsGrams', value)} min="0.1" />
        <NumberField label="Fat (g)" value={form.fatGrams} onChange={(value) => set('fatGrams', value)} min="0.1" />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>These are tracking preferences, not a recommended diet. Clearing all fields removes your targets.</p>
      {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-2"><button type="button" disabled={busy} onClick={onClose} className="min-h-12 flex-1 rounded-xl border text-sm font-bold" style={{ borderColor: 'var(--color-border)' }}>Cancel</button><button type="submit" disabled={busy} className="min-h-12 flex-1 rounded-xl bg-amber-500 text-sm font-extrabold text-black disabled:opacity-60">{busy ? 'Saving…' : 'Save targets'}</button></div>
    </form>
  </Dialog>;
}
