/**
 * Divider — Horizontal divider line
 *
 * @param {Object} props
 * @param {string} [props.className]
 */
export default function Divider({ className = '' }) {
  return (
    <hr
      className={`divider ${className}`}
      style={{
        border: 'none',
        borderTop: '1px solid var(--color-border)',
        margin: 'var(--space-4) 0',
      }}
    />
  );
}
