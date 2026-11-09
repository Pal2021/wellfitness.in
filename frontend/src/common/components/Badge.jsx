/**
 * Badge — Small status/label badge
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'default'|'success'|'warning'|'error'|'info'} [props.variant='default']
 * @param {string} [props.className]
 */
export default function Badge({
  children,
  variant = 'default',
  className = '',
}) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
