import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../common/context/AuthContext';
import { verifyEmailOtp, sendEmailOtp } from '../../../services/apiClient';
import OTPInput from '../../../common/components/OTPInput';

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Resend state
  const [countdown, setCountdown] = useState(60);
  const [resendMsg, setResendMsg] = useState('');

  // Target identifier
  const [targetIdentifier, setTargetIdentifier] = useState('');

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingEmail');
    if (!pendingEmail) {
      navigate('/register', { replace: true });
      return;
    }
    setTargetIdentifier(pendingEmail);
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setResendMsg('');

    try {
      const res = await verifyEmailOtp({ email: targetIdentifier, otp });
      const payloadData = res.data?.data || res.data;
      const { token, ...user } = payloadData;
      localStorage.removeItem('pendingEmail');
      sessionStorage.removeItem('pendingToken');
      login(token, user);
      navigate(user.onboardingComplete === false ? '/onboarding' : '/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setError('');
    setResendMsg('');

    try {
      await sendEmailOtp(targetIdentifier);
      setResendMsg('Code resent!');
      setCountdown(60);
    } catch {
      setError('Failed to resend. Try again later.');
    }
  };

  return (
    <div style={S.page} data-page="auth">
      <div style={S.container} className="animate-fade-in" data-container="auth">
        
        <header style={S.header}>
          <h1 style={S.brand}>Wellfitness</h1>
          <p style={S.subtitle}>VERIFICATION</p>
        </header>

        <div style={S.card} data-card="auth">
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'var(--font-bold)', marginBottom: '8px' }}>
              Verify your email
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              We sent a 6-digit code to <br/>
              <strong style={{ color: 'var(--color-text-primary)' }}>{targetIdentifier}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            
            <div style={{ marginBottom: '24px' }}>
              <OTPInput 
                length={6} 
                onChange={(val) => {
                  setOtp(val);
                  if (val.length === 6) setError('');
                }} 
                error={!!error}
              />
            </div>

            {error && (
              <div style={{...S.errorBanner, marginTop: '-8px', marginBottom: '16px'}} className="animate-shake">
                {error}
              </div>
            )}
            
            {resendMsg && (
              <div style={{
                color: 'var(--color-success)', 
                fontSize: 'var(--text-sm)', 
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {resendMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                ...S.submitBtn,
                opacity: (loading || otp.length !== 6) ? 0.65 : 1,
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <span style={S.spinner} /> : 'Verify'}
            </button>
          </form>

          <div style={S.resendWrapper}>
            <span style={{ color: 'var(--color-text-muted)' }}>Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              style={{
                ...S.resendBtn,
                color: countdown > 0 ? 'var(--color-text-muted)' : 'var(--color-primary)',
                cursor: countdown > 0 ? 'default' : 'pointer'
              }}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
            </button>
          </div>

          <Link to="/register" style={S.backLink}>
            <ArrowLeft size={14} />
            BACK
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
    textAlign: 'center',
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
    padding: '32px 24px 24px',
  },
  errorBanner: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: 'var(--color-error)',
    fontSize: 'var(--text-sm)',
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
  resendWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    marginTop: '24px',
    fontSize: '12px',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    fontSize: '13px',
    fontWeight: 'var(--font-bold)',
    fontFamily: 'var(--font-sans)',
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
