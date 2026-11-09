import { useState } from 'react';
import { X } from 'lucide-react';

const fields = {
  identity: { title: 'Edit profile', description: 'Update the name and photo shown on your profile.' },
  training: { title: 'Training preferences', description: 'Set your experience and weekly training target.' },
  weight: { title: 'Body weight', description: 'Update your current body weight.' },
  height: { title: 'Height', description: 'Update your height.' },
  reminder: { title: 'Workout time', description: 'Save the time you prefer to train.' },
  units: { title: 'Display units', description: 'Choose how measurements appear on your profile.' },
};

const inputClass = 'mt-2 min-h-12 w-full rounded-xl border px-4 text-sm outline-none focus:border-amber-500';
const inputStyle = { background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' };

function initialValues(user) {
  const weightInLb = user?.unitsWeight === 'LB';
  const heightInInches = user?.unitsHeight === 'IN';
  return {
    name: user?.name || '',
    profilePhotoUrl: user?.profilePhotoUrl || '',
    experience: user?.experience || '',
    daysPerWeek: user?.daysPerWeek || '',
    weight: user?.bodyweightKg ? (weightInLb ? (Number(user.bodyweightKg) * 2.20462).toFixed(1) : user.bodyweightKg) : '',
    height: user?.heightCm ? (heightInInches ? (Number(user.heightCm) / 2.54).toFixed(1) : user.heightCm) : '',
    notificationTime: /^\d{2}:\d{2}$/.test(user?.notificationTime || '') ? user.notificationTime : '',
    unitsWeight: user?.unitsWeight || 'KG',
    unitsHeight: user?.unitsHeight || 'CM',
  };
}

export default function ProfileEditor({ type, user, saving, error, onSave, onClose }) {
  const [draft, setDraft] = useState(() => initialValues(user));
  const [localError, setLocalError] = useState('');
  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    setLocalError('');
    let payload;
    if (type === 'identity') {
      payload = { name: draft.name.trim(), profilePhotoUrl: draft.profilePhotoUrl.trim() };
      if (!payload.name) return setLocalError('Please enter your name.');
    } else if (type === 'training') {
      payload = { experience: draft.experience, daysPerWeek: Number(draft.daysPerWeek) };
      if (!payload.experience || payload.daysPerWeek < 1 || payload.daysPerWeek > 7) return setLocalError('Choose your experience and 1 to 7 training days.');
    } else if (type === 'weight') {
      const kg = draft.weight === '' ? null : Number(draft.weight) * (user?.unitsWeight === 'LB' ? 0.45359237 : 1);
      if (kg === null || !Number.isFinite(kg) || kg < 20 || kg > 500) return setLocalError('Enter a weight between 20 and 500 kg.');
      payload = { bodyweightKg: Number(kg.toFixed(2)) };
    } else if (type === 'height') {
      const cm = draft.height === '' ? null : Number(draft.height) * (user?.unitsHeight === 'IN' ? 2.54 : 1);
      if (cm === null || !Number.isFinite(cm) || cm < 80 || cm > 250) return setLocalError('Enter a height between 80 and 250 cm.');
      payload = { heightCm: Math.round(cm) };
    } else if (type === 'reminder') {
      payload = { notificationTime: draft.notificationTime };
    } else {
      payload = { unitsWeight: draft.unitsWeight, unitsHeight: draft.unitsHeight };
    }
    onSave(payload);
  };

  const label = (text, children) => <label className="block text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{text}{children}</label>;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="profile-editor-title" onKeyDown={(event) => { if (event.key === 'Escape' && !saving) onClose(); }} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-3xl border p-5 shadow-2xl sm:rounded-3xl sm:p-7" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">Profile settings</p><h2 id="profile-editor-title" className="mt-1 text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>{fields[type].title}</h2><p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{fields[type].description}</p></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close settings" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--color-border)' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {type === 'identity' && <>
            {label('Display name', <input autoFocus required maxLength={100} value={draft.name} onChange={(event) => set('name', event.target.value)} className={inputClass} style={inputStyle} />)}
            {label('Photo URL (optional)', <input type="url" maxLength={500} placeholder="https://example.com/photo.jpg" value={draft.profilePhotoUrl} onChange={(event) => set('profilePhotoUrl', event.target.value)} className={inputClass} style={inputStyle} />)}
          </>}
          {type === 'training' && <>
            {label('Experience level', <select autoFocus required value={draft.experience} onChange={(event) => set('experience', event.target.value)} className={inputClass} style={inputStyle}><option value="">Select a level</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select>)}
            {label('Training days per week', <select required value={draft.daysPerWeek} onChange={(event) => set('daysPerWeek', event.target.value)} className={inputClass} style={inputStyle}><option value="">Choose days</option>{[1, 2, 3, 4, 5, 6, 7].map((day) => <option key={day} value={day}>{day} {day === 1 ? 'day' : 'days'}</option>)}</select>)}
          </>}
          {type === 'weight' && label(`Body weight (${user?.unitsWeight === 'LB' ? 'lb' : 'kg'})`, <input autoFocus required type="number" min="1" max="1103" step="0.01" inputMode="decimal" value={draft.weight} onChange={(event) => set('weight', event.target.value)} className={inputClass} style={inputStyle} />)}
          {type === 'height' && label(`Height (${user?.unitsHeight === 'IN' ? 'in' : 'cm'})`, <input autoFocus required type="number" min="1" max="250" step={user?.unitsHeight === 'IN' ? '0.1' : '1'} inputMode="decimal" value={draft.height} onChange={(event) => set('height', event.target.value)} className={inputClass} style={inputStyle} />)}
          {type === 'reminder' && <>
            {label('Preferred workout time', <input autoFocus type="time" value={draft.notificationTime} onChange={(event) => set('notificationTime', event.target.value)} className={inputClass} style={inputStyle} />)}
            <button type="button" onClick={() => set('notificationTime', '')} className="text-sm font-bold text-amber-500">Clear time</button>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>This saves your preferred time. Device notifications are not enabled yet.</p>
          </>}
          {type === 'units' && <div className="grid grid-cols-2 gap-3">
            {label('Weight', <select autoFocus value={draft.unitsWeight} onChange={(event) => set('unitsWeight', event.target.value)} className={inputClass} style={inputStyle}><option value="KG">Kilograms (kg)</option><option value="LB">Pounds (lb)</option></select>)}
            {label('Height', <select value={draft.unitsHeight} onChange={(event) => set('unitsHeight', event.target.value)} className={inputClass} style={inputStyle}><option value="CM">Centimetres (cm)</option><option value="IN">Inches (in)</option></select>)}
          </div>}
          {(localError || error) && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{localError || error}</p>}
          <div className="flex gap-3 pt-2"><button type="button" onClick={onClose} disabled={saving} className="min-h-12 flex-1 rounded-xl border text-sm font-bold" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Cancel</button><button type="submit" disabled={saving} className="min-h-12 flex-1 rounded-xl bg-amber-500 px-4 text-sm font-extrabold text-black transition hover:bg-amber-400 disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button></div>
        </form>
      </section>
    </div>
  );
}
