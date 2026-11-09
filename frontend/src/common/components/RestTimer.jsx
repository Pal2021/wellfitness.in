/**
 * RestTimer — Countdown rest timer between sets
 *
 * @param {Object} props
 * @param {number} props.seconds - Rest duration in seconds
 * @param {Function} [props.onComplete] - Callback when timer finishes
 * @param {string} [props.className]
 */
export default function RestTimer({ seconds, onComplete, className = '' }) {
  // TODO: Implement countdown logic with useEffect + useState
  return (
    <div className={`rest-timer ${className}`}>
      <p className="text-2xl font-bold">{seconds}s</p>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Rest</p>
    </div>
  );
}
