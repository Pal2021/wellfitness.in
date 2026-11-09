import { createElement } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function QuickAction({ icon: Icon, label, detail, onClick }) {
  return (
    <button type="button" onClick={onClick} className="group flex min-h-21 w-full items-center gap-3 rounded-2xl border p-4 text-left transition hover:border-amber-500/40 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-amber-500" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">{createElement(Icon, { size: 20, 'aria-hidden': true })}</span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{label}</span><span className="mt-0.5 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>{detail}</span></span>
      <ArrowUpRight size={17} className="shrink-0 text-amber-500" aria-hidden="true" />
    </button>
  );
}
