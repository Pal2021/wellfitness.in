import { createElement } from 'react';
import { ChevronRight } from 'lucide-react';

export default function SettingsItem({ icon: Icon, label, value, onClick, first = false }) {
  return (
    <button type="button" onClick={onClick} className={`group flex min-h-18 w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-amber-500/5 focus-visible:outline-2 focus-visible:outline-amber-500 sm:px-5 ${first ? '' : 'border-t'}`} style={{ borderColor: 'var(--color-border)' }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">{createElement(Icon, { size: 20, 'aria-hidden': true })}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{label}</span>
        <span className="mt-0.5 block truncate text-xs" style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-amber-500/70 transition group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  );
}
