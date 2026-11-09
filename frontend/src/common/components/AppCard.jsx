/**
 * AppCard — Reusable card container component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'default'|'elevated'|'glass'} [props.variant='default']
 * @param {string} [props.className]
 */
export default function AppCard({
  children,
  variant = 'default',
  className = '',
  ...rest
}) {
  const variantClass = {
    default: 'card',
    elevated: 'card-elevated',
    glass: 'glass',
  }[variant];

  return (
    <div className={`${variantClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}
