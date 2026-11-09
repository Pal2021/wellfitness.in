import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ArrowUpRight, Dumbbell, Phone, Check, LoaderCircle } from 'lucide-react';
import { login as apiLogin, googleAuth } from '../../../services/apiClient';
import { useAuth } from '../../../common/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ── State ───────────────────────────────── */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ── Submit (Email Flow) ─────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      const payloadData = res.data?.data || res.data;
      const { token, ...user } = payloadData;
      login(token, user);

      if (user.onboardingComplete === false) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google Flow (OAuth2.0) ─────────────── */
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    document.body.style.cursor = 'wait';
    try {
      const res = await googleAuth(credentialResponse.credential);
      const payloadData = res.data?.data || res.data;
      const { token, ...user } = payloadData;
      login(token, user);
      
      if (user.onboardingComplete === false) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed. Try again.');
    } finally {
      document.body.style.cursor = 'default';
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In cancelled.');
  };

  /* ── Phone Navigation ────────────────────── */
  const handlePhoneSignIn = () => {
    navigate('/phone-login');
  };

  const googleContainer = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(280);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setGoogleWidth(Math.min(400, Math.floor(entry.contentRect.width)));
    });
    observer.observe(googleContainer.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="wf-login">
      <header className="wf-login__header">
        <Link to="/" className="wf-login__brand" aria-label="Wellfitness home"><span><Dumbbell size={22} aria-hidden="true" /></span>WELLFITNESS</Link>
        <Link to="/" className="wf-login__back"><ArrowLeft size={16} aria-hidden="true" /> Back to home</Link>
      </header>
      <div className="wf-login__layout">
        <section className="wf-login__intro" aria-labelledby="login-intro-title">
          <p className="wf-login__eyebrow"><span /> YOUR NEXT CHAPTER STARTS HERE</p>
          <h1 id="login-intro-title">Small steps.<br />Stronger <em>you.</em></h1>
          <p className="wf-login__description">Pick up where you left off. Your workouts, progress, and daily wins, all in one place.</p>
          <ul className="wf-login__benefits">
            {['Keep every set and rep in one place', 'See your progress, session by session', 'Build a routine that works for you'].map(text => <li key={text}><Check size={16} aria-hidden="true" />{text}</li>)}
          </ul>
          <div className="wf-login__note"><Dumbbell size={24} aria-hidden="true" /><div><strong>Show up. Track it. Keep going.</strong><p>Consistency starts with your next session.</p></div></div>
        </section>
        <section className="wf-login__card" aria-labelledby="login-title">
          <div className="wf-login__card-heading"><span className="wf-login__eyebrow">BACK TO YOUR ROUTINE</span><h2 id="login-title">Welcome back.</h2><p>Sign in to your Wellfitness account.</p></div>
          <form onSubmit={handleSubmit} className="wf-login__form" aria-busy={loading}>
            <div className="wf-login__field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required aria-describedby={error ? 'login-error' : undefined} /></div>
            <div className="wf-login__field"><label htmlFor="login-password">Password</label><div className="wf-login__password"><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required aria-describedby={error ? 'login-error' : undefined} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></div>
            {error && <p id="login-error" role="alert" className="wf-login__error">{error}</p>}
            <button type="submit" disabled={loading} className="wf-login__submit">{loading ? <><LoaderCircle size={19} className="wf-login__spinner" aria-hidden="true" /> Signing in...</> : <>Sign in <ArrowUpRight size={19} aria-hidden="true" /></>}</button>
          </form>
          <div className="wf-login__divider"><span />or continue with<span /></div>
          <div className="wf-login__alternatives">
            <div className="wf-login__google" ref={googleContainer}><GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap theme="outline" size="large" width={googleWidth} shape="rectangular" text="continue_with_google" /></div>
            <button type="button" onClick={handlePhoneSignIn} className="wf-login__phone"><Phone size={17} aria-hidden="true" /> Continue with phone</button>
          </div>
          <p className="wf-login__signup">New to Wellfitness? <Link to="/register">Create an account <ArrowUpRight size={14} aria-hidden="true" /></Link></p>
        </section>
      </div>
      <footer className="wf-login__footer">YOUR EFFORT. YOUR PROGRESS. YOUR WELLFITNESS.</footer>
    </main>
  );
}
