/**
 * AppButton — Primary reusable button component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {Function} [props.onClick] - Click handler
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading] - Shows spinner and disables button
 * @param {boolean} [props.fullWidth] - Stretches to container width
 * @param {boolean} [props.disabled] - Disabled state
 * @param {'button'|'submit'} [props.type='button'] - Button type
 * @param {string} [props.className] - Additional CSS classes
 */
export default function AppButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading;

  /* ---- Size tokens ---- */
  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: 'var(--text-sm)' },
    md: { padding: '12px 24px', fontSize: 'var(--text-base)' },
    lg: { padding: '16px 32px', fontSize: 'var(--text-lg)' },
  };

  /* ---- Base style ---- */
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--font-bold)',
    borderRadius: 'var(--radius-xl)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'all 200ms ease',
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    outline: 'none',
    letterSpacing: '0.01em',
    ...sizeMap[size],
  };

  /* ---- Variant styles ---- */
  const variants = {
    primary: {
      background: 'var(--gradient-button)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-glow-sm)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1.5px solid var(--color-primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      border: 'none',
    },
  };

  const style = { ...base, ...variants[variant] };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      style={style}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(245, 165, 36, 0.1)';
        } else {
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = 'var(--shadow-glow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'transparent';
        } else {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }
      }}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: '1em',
        height: '1em',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.6s linear infinite',
      }}
      aria-hidden="true"
    />
  );
}
