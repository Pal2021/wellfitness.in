/**
 * VolumeBar — Visual bar chart for volume tracking
 *
 * @param {Object} props
 * @param {number} props.value - Current value (0–100)
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.label]
 * @param {string} [props.className]
 */
export default function VolumeBar({
  value,
  max = 100,
  label,
  className = '',
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={`volume-bar ${className}`}>
      {label && <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>}
      <div
        style={{
          width: '100%',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-bg-tertiary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-primary)',
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
}
