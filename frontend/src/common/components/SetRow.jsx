/**
 * SetRow — Single set row in a workout exercise card
 *
 * @param {Object} props
 * @param {number} props.setNumber
 * @param {number} [props.weight]
 * @param {number} [props.reps]
 * @param {boolean} [props.completed]
 * @param {Function} [props.onToggle]
 * @param {string} [props.className]
 */
export default function SetRow({
  setNumber,
  weight,
  reps,
  completed = false,
  onToggle,
  className = '',
}) {
  return (
    <div className={`set-row flex items-center gap-4 ${className}`}>
      <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)', minWidth: '2rem' }}>
        {setNumber}
      </span>
      <span className="text-sm">{weight ?? '—'} kg</span>
      <span className="text-sm">×</span>
      <span className="text-sm">{reps ?? '—'}</span>
      {onToggle && (
        <button onClick={onToggle} className="ml-auto">
          {completed ? '✅' : '⬜'}
        </button>
      )}
    </div>
  );
}
