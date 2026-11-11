import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { register as apiRegister, googleAuth } from '../../../services/apiClient';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../common/context/AuthContext';
import { finishAuthentication } from '../../../common/guestIntent';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ── Form state ──────────────────────────── */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  /* ── UI state ────────────────────────────── */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const googleContainer = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setGoogleWidth(Math.min(400, Math.floor(entry.contentRect.width)));
    });
    observer.observe(googleContainer.current);
    return () => observer.disconnect();
  }, []);

  /* ── Validation ──────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Minimum 8 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ──────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      // Step 1: Register via Spring Boot (sends verification email behind the scenes)
      const res = await apiRegister({ name, email, password });
      const payloadData = res.data?.data || res.data;
      const { token } = payloadData;
      
      // Step 2: Store pending details and navigate to OTP Verification
      sessionStorage.setItem('pendingToken', token);
      localStorage.setItem('pendingEmail', email);

      navigate('/verify-otp?type=email');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google (OAuth2.0) ───────────────────── */
  const handleGoogleSuccess = async (credentialResponse) => {
    setFormError('');
    document.body.style.cursor = 'wait';
    try {
      const res = await googleAuth(credentialResponse.credential);
      const payloadData = res.data?.data || res.data;
      const { token, ...user } = payloadData;
      login(token, user);
      
      finishAuthentication(navigate, user);
    } catch (err) {
      console.error(err);
      setFormError('Google sign-in failed. Try again.');
    } finally {
      document.body.style.cursor = 'default';
    }
  };

  const handleGoogleError = () => {
    setFormError('Google Sign-In cancelled.');
  };

  /* ── Shared input style ──────────────────── */
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-bg-input)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    outline: 'none',
    transition: 'all 200ms ease',
  };

  const inputErrorStyle = (field) =>
    errors[field] ? { borderColor: 'var(--color-error)' } : {};

  const focusHandlers = (field) => ({
    onFocus: (e) => {
      if (!errors[field]) {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.boxShadow = '0 0 0 2px rgba(245,165,36,0.12)';
      }
    },
    onBlur: (e) => {
      e.target.style.borderColor = errors[field] ? 'var(--color-error)' : 'var(--color-border)';
      e.target.style.boxShadow = 'none';
    },
  });

  return (
    <div style={S.page} data-page="auth">
      <div style={S.container} className="animate-fade-in-up" data-container="auth">
        {/* ── Brand Header ─────────────────── */}
        <header style={S.header}>
          <h1 style={S.brand}>Wellfitness</h1>
          <p style={S.subtitle}>CREATE YOUR ACCOUNT</p>
        </header>

        {/* ── Card ─────────────────────────── */}
        <div style={S.card} data-card="auth">
          <form onSubmit={handleSubmit}>

            {/* ── Full Name ────────────────── */}
            <div style={S.fieldGroup}>
              <label htmlFor="reg-name" style={S.label}>FULL NAME</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                style={{ ...inputStyle, ...inputErrorStyle('name') }}
                {...focusHandlers('name')}
              />
              {errors.name && <p style={S.fieldError}>{errors.name}</p>}
            </div>

            {/* ── Email ────────────────────── */}
            <div style={S.fieldGroup}>
              <label htmlFor="reg-email" style={S.label}>EMAIL ADDRESS</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                style={{ ...inputStyle, ...inputErrorStyle('email') }}
                {...focusHandlers('email')}
              />
              {errors.email && <p style={S.fieldError}>{errors.email}</p>}
            </div>

            {/* ── Password ─────────────────── */}
            <div style={S.fieldGroup}>
              <label htmlFor="reg-password" style={S.label}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  style={{ ...inputStyle, ...inputErrorStyle('password'), paddingRight: '48px' }}
                  {...focusHandlers('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={S.eyeBtn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={S.fieldError}>{errors.password}</p>}
            </div>

            {/* ── Confirm Password ─────────── */}
            <div style={S.fieldGroup}>
              <label htmlFor="reg-confirm" style={S.label}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  style={{ ...inputStyle, ...inputErrorStyle('confirmPassword'), paddingRight: '48px' }}
                  {...focusHandlers('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  style={S.eyeBtn}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p style={S.fieldError}>{errors.confirmPassword}</p>}
            </div>

            {/* ── Form Error ───────────────── */}
            {formError && (
              <div style={S.errorBanner} className="animate-shake">
                {formError}
              </div>
            )}

            {/* ── Create Account Button ────── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...S.submitBtn,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <span style={S.spinner} /> : 'Create Account'}
            </button>
          </form>

          {/* ── Login link ─────────────────── */}
          <p style={S.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={S.switchLink}>Login</Link>
          </p>

          {/* ── Divider ────────────────────── */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>ALTERNATIVE</span>
            <div style={S.dividerLine} />
          </div>

          {/* ── Google Component ──────────────── */}
          <div ref={googleContainer} className="wf-register__google" style={S.googleContainer}>
            {googleWidth > 0 && <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width={googleWidth}
              shape="rectangular"
              text="signup_with"
            />}
          </div>

          {/* ── Back to Home ───────────────── */}
          <Link to="/" style={S.backLink}>
            <ArrowLeft size={14} />
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Styles Object 
   ══════════════════════════════════════════════ */
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'var(--color-bg-primary)',
    padding: '40px 16px',
  },
  container: {
    width: '100%',
    maxWidth: '430px',
  },
  header: {
    marginBottom: '28px',
    paddingLeft: '4px',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-primary)',
    lineHeight: 'var(--leading-tight)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-medium)',
    color: 'var(--color-primary)',
    opacity: 0.6,
    letterSpacing: '0.15em',
    marginTop: '4px',
  },
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    padding: '28px 24px 24px',
  },
  fieldGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'var(--font-semibold)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  fieldError: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-error)',
    marginTop: '4px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    display: 'flex',
    padding: 0,
  },
  errorBanner: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--color-error)',
    fontSize: 'var(--text-sm)',
    marginBottom: '18px',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--font-bold)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-inverse)',
    background: 'var(--gradient-button)',
    border: 'none',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2.5px solid rgba(10,10,10,0.3)',
    borderTopColor: 'var(--color-text-inverse)',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.6s linear infinite',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    marginTop: '20px',
  },
  switchLink: {
    color: 'var(--color-primary)',
    fontWeight: 'var(--font-semibold)',
    textDecoration: 'none',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--color-border)',
  },
  dividerText: {
    fontSize: '10px',
    fontWeight: 'var(--font-medium)',
    letterSpacing: '0.2em',
    color: 'var(--color-text-muted)',
  },
  googleContainer: {
    width: '100%',
    minWidth: 0,
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '20px',
    fontSize: '11px',
    fontWeight: 'var(--font-medium)',
    letterSpacing: '0.15em',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    transition: 'color 200ms ease',
  },
};
