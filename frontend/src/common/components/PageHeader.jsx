/**
 * PageHeader — Reusable page header with title and optional back button
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.rightAction]
 * @param {Function} [props.onBack]
 * @param {string} [props.className]
 */
export default function PageHeader({
  title,
  subtitle,
  rightAction,
  onBack,
  className = '',
}) {
  return (
    <header className={`page-header ${className}`}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} aria-label="Go back">
            ←
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}
