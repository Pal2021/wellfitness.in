import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import * as splitService from '../services/splitService';

export default function ChangeSplitModal({ onClose, onSplitChanged, currentSplitName }) {
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    splitService.getAllTemplates()
      .then((items) => { if (!cancelled) setTemplates(items); })
      .catch((requestError) => { if (!cancelled) setError(requestError.message || 'Could not load split templates.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === 'Escape' && !applying) onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applying, onClose]);

  const applyTemplate = async () => {
    if (!selectedId) return;
    try {
      setApplying(true);
      setError('');
      await splitService.changeSplitFromTemplate(selectedId);
      await onSplitChanged();
      onClose();
    } catch (requestError) {
      setError(requestError.message || 'Could not change your split.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" onClick={onClose} disabled={applying} aria-label="Close split templates" className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="change-split-title" className="relative flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#161616] text-white shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 pb-4 pt-5 sm:px-6">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-amber-400">Choose your plan</p>
            <h2 id="change-split-title" className="text-xl font-black">Split templates</h2>
            <p className="mt-1 text-xs leading-relaxed text-white/55">{currentSplitName ? 'Applying a template replaces your current split.' : 'Pick a starting point. You can adjust exercises later.'}</p>
          </div>
          <button type="button" onClick={onClose} disabled={applying} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70"><X size={20} /></button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-6">
          {loading && <p role="status" className="py-10 text-center text-sm text-white/60">Loading templates…</p>}
          {error && <div role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}{templates.length === 0 && <button type="button" onClick={() => { setError(''); setLoading(true); setReloadKey((value) => value + 1); }} className="ml-2 font-bold underline">Try again</button>}</div>}
          {!loading && !error && templates.length === 0 && <p className="py-10 text-center text-sm text-white/60">No templates are available right now.</p>}
          {!loading && templates.map((template) => {
            const selected = selectedId === template.id;
            return <button type="button" key={template.id} onClick={() => setSelectedId(template.id)} disabled={applying} aria-pressed={selected} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${selected ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}>
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/30'}`}>{selected && <Check size={14} strokeWidth={3} aria-hidden="true" />}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">{template.name}</span>
                {template.description && <span className="mt-1 block text-xs leading-relaxed text-white/55">{template.description}</span>}
                <span className="mt-2 block text-[11px] font-bold uppercase tracking-wider text-amber-400">{[template.frequencyDays ? `${template.frequencyDays} days / week` : null, template.difficulty].filter(Boolean).join(' · ')}</span>
              </span>
            </button>;
          })}
        </div>

        <footer className="border-t border-white/10 bg-[#161616] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <button type="button" onClick={applyTemplate} disabled={!selectedId || applying} className="min-h-12 w-full rounded-xl bg-amber-500 px-5 text-sm font-extrabold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-45">{applying ? 'Applying split…' : 'Use selected split'}</button>
        </footer>
      </section>
    </div>
  );
}
