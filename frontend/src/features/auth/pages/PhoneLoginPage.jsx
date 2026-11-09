import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function PhoneLoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit number.');
      return;
    }

    setLoading(true);

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }

      const phoneWithCode = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneWithCode, window.recaptchaVerifier);
      
      // Store globally to use in VerifyOTPPage
      window.confirmationResult = confirmationResult;
      
      navigate(`/verify-otp?type=phone&phone=${encodeURIComponent(phoneWithCode)}`);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Check your number or try again later.');
      // Reset recaptcha if failed to allow retry
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div style={S.page} data-page="auth">
      <div style={S.container} className="animate-fade-in" data-container="auth">
        
        {/* Recaptcha Container (Invisible) */}
        <div id="recaptcha-container"></div>

        <header style={S.header}>
          <h1 style={S.brand}>Wellfitness</h1>
          <p style={S.subtitle}>PHONE AUTHENTICATION</p>
        </header>

        <div style={S.card} data-card="auth">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'var(--font-bold)', marginBottom: '8px' }}>
              Enter your phone number
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              We will send you a 6-digit confirmation code via SMS.
            </p>
          </div>

          <form onSubmit={handleSendOtp}>
            <div style={S.fieldGroup}>
              <label htmlFor="phone" style={S.label}>MOBILE NUMBER</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Country Code */}
                <div
                  style={{
                    ...inputStyle,
                    width: '72px',
                    flexShrink: 0,
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    cursor: 'default',
                  }}
                >
                  +91
                </div>
                {/* Phone Input */}
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  autoComplete="tel"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(245,165,36,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={S.errorBanner} className="animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...S.submitBtn,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <span style={S.spinner} /> : 'Send OTP'}
            </button>
          </form>

          <Link to="/login" style={S.backLink}>
            <ArrowLeft size={14} />
            BACK TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    marginBottom: '20px',
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
  errorBanner: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--color-error)',
    fontSize: 'var(--text-sm)',
    marginBottom: '20px',
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
    marginTop: '8px',
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
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '24px',
    fontSize: '11px',
    fontWeight: 'var(--font-medium)',
    letterSpacing: '0.15em',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    transition: 'color 200ms ease',
  },
};
