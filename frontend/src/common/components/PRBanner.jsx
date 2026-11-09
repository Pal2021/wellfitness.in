/**
 * PRBanner — Personal Record celebration banner
 *
 * @param {Object} props
 * @param {string} props.exercise - Exercise name
 * @param {string} props.record - New PR value (e.g., "100 kg × 5")
 * @param {string} [props.className]
 */
export default function PRBanner({ exercise, record, className = '' }) {
  return (
    <div className={`pr-banner animate-scale-in ${className}`}>
      <span>🏆</span>
      <div>
        <p className="font-bold">New PR!</p>
        <p className="text-sm">{exercise} — {record}</p>
      </div>
    </div>
  );
}
