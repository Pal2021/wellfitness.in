/**
 * AppInput — Reusable input component with label, error, and right element support.
 *
 * @param {Object} props
 * @param {string} [props.label] - Label text above the input
 * @param {string} props.name - Input name attribute
 * @param {string} [props.type='text'] - Input type (text, email, password, tel, number)
 * @param {string} props.value - Controlled input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Error message to display below input
 * @param {React.ReactNode} [props.rightElement] - Slot for icons inside the input (right side)
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.id] - Custom ID (defaults to name)
 * @param {string} [props.autoComplete] - Autocomplete attribute
 */
export default function AppInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  rightElement,
  disabled = false,
  className = '',
  id,
  autoComplete,
  ...rest
}) {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="app-input"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingRight: rightElement ? '3rem' : '1rem',
            fontSize: 'var(--text-base)',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-tertiary)',
            border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            outline: 'none',
            transition: 'all 200ms ease',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.15)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
          {...rest}
        />

        {/* Right element (icons, toggles, etc.) */}
        {rightElement && (
          <div
            className="absolute top-1/2 right-3 flex items-center"
            style={{ transform: 'translateY(-50%)' }}
          >
            {rightElement}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          className="text-xs animate-fade-in-up"
          style={{
            color: 'var(--color-error)',
            marginTop: '2px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
