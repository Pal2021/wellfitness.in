/**
 * SectionLabel — Section heading with optional action
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className]
 */
export default function SectionLabel({ label, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`} style={{ marginBottom: 'var(--space-3)' }}>
      <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </h2>
      {action && <div>{action}</div>}
    </div>
  );
}
