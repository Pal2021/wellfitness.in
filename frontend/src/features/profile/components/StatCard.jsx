import { createElement } from 'react';

export default function StatCard({ icon: Icon, value, label, loading }) {
  return (
    <div className="min-w-0 rounded-2xl border p-3 sm:p-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      {createElement(Icon, { size: 21, className: 'mb-3 text-amber-500', 'aria-hidden': true })}
      {loading ? <span className="block h-8 w-12 animate-pulse rounded" style={{ background: 'var(--color-bg-tertiary)' }} /> : <strong className="block text-2xl font-black tabular-nums sm:text-3xl">{value}</strong>}
      <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide sm:text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  );
}
