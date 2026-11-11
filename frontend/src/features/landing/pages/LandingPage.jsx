import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check,
  Clock3, Cpu, Dumbbell, LayoutList, LineChart, Sparkles,
  Utensils, UserRound, Zap,
} from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: Dumbbell, title: 'Track workouts', text: 'Record exercises, sets, reps, and weights in each session.', path: '/workout' },
  { icon: LayoutList, title: 'Build your split', text: 'Organize training days around your goal and schedule.', path: '/splits' },
  { icon: BookOpen, title: 'Explore exercises', text: 'Browse movements and find exercises for your next session.', path: '/exercises' },
  { icon: Clock3, title: 'Review history', text: 'See completed sessions and what you lifted before.', path: '/workout/history' },
  { icon: LineChart, title: 'Follow progress', text: 'Compare every logged session for each exercise over time.', path: '/progress' },
  { icon: Cpu, title: 'Ask your AI Coach', text: 'Get answers that use your goal, body metrics, meals, and training.', path: '/ai-coach' },
  { icon: Utensils, title: 'Log food', text: 'Keep a daily diary with calories, macros, and meal ideas.', path: '/diet' },
  { icon: UserRound, title: 'Make it yours', text: 'Set your goal, body measurements, and profile preferences.', path: '/profile' },
];

const steps = [
  { number: '01', title: 'Explore freely', text: 'Open the dashboard and tabs to see clearly marked sample data. No account is needed to look around.' },
  { number: '02', title: 'Start your own record', text: 'Sign up when you start a workout, log food, or ask the AI Coach. Onboarding sets your goal and training plan.' },
  { number: '03', title: 'Build on every session', text: 'Your saved workouts, meals, and measurements make progress views and AI answers more personal.' },
];

export default function LandingPage() {
  return (
    <div className="wf-landing">
      <a className="wf-landing__skip" href="#landing-main">Skip to content</a>
      <header className="wf-landing__header wf-landing__container">
        <Link className="wf-landing__brand" to="/" aria-label="WellFitness home">
          <span className="wf-landing__brand-mark"><Zap size={21} fill="currentColor" aria-hidden="true" /></span>
          <span>WellFitness<span className="wf-landing__brand-dot">.</span></span>
        </Link>
        <nav className="wf-landing__nav" aria-label="Landing page navigation">
          <a className="wf-landing__nav-link" href="#features">Features</a>
          <a className="wf-landing__nav-link" href="#how-it-works">How it works</a>
          <Link className="wf-landing__nav-link" to="/login">Log in</Link>
          <Link className="wf-landing__button wf-landing__button--small" to="/dashboard">Explore dashboard <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>

      <main id="landing-main">
        <section className="wf-landing__hero wf-landing__container" aria-labelledby="landing-title">
          <div className="wf-landing__hero-copy">
            <p className="wf-landing__eyebrow"><span /> TRAIN · EAT · GROW</p>
            <h1 id="landing-title">A clearer path to <span>stronger you.</span></h1>
            <p className="wf-landing__intro">Plan workouts, log every set and meal, see your progress, and ask an AI Coach that learns from the fitness record you build.</p>
            <div className="wf-landing__hero-actions">
              <Link className="wf-landing__button" to="/dashboard">Start your journey <ArrowRight size={19} aria-hidden="true" /></Link>
              <a className="wf-landing__text-link" href="#features">See everything inside <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="wf-landing__guest-note"><Check size={17} aria-hidden="true" /> Explore the dashboard and sample data before signing up.</p>
          </div>

          <div className="wf-landing__preview" aria-label="Illustrative workout dashboard preview">
            <div className="wf-landing__preview-head"><span>YOUR TRAINING SPACE</span><span className="wf-landing__sample">SAMPLE PREVIEW</span></div>
            <div className="wf-landing__preview-hero"><span className="wf-landing__preview-kicker">TODAY'S FOCUS</span><strong>Show up for your next rep.</strong><p>A simple place to keep training, food, and progress together.</p></div>
            <div className="wf-landing__preview-stats">
              <div><Dumbbell size={19} aria-hidden="true" /><strong>Workout</strong><span>Log each set</span></div>
              <div><Utensils size={19} aria-hidden="true" /><strong>Diet</strong><span>See daily totals</span></div>
              <div><LineChart size={19} aria-hidden="true" /><strong>Progress</strong><span>Follow your lifts</span></div>
            </div>
            <div className="wf-landing__preview-coach"><Sparkles size={20} aria-hidden="true" /><div><strong>AI Coach</strong><span>Answers grounded in your saved activity</span></div><ArrowUpRight size={18} aria-hidden="true" /></div>
          </div>
        </section>

        <section id="features" className="wf-landing__features wf-landing__container" aria-labelledby="features-title">
          <div className="wf-landing__section-heading"><p className="wf-landing__eyebrow">EVERYTHING IN ONE PLACE</p><h2 id="features-title">Your whole fitness routine, connected.</h2><p>Browse these tabs with sample data. Your own record starts when you choose to save something.</p></div>
          <div className="wf-landing__feature-grid">
            {features.map(({ icon: Icon, title, text, path }) => {
              const FeatureIcon = Icon;
              return <Link className="wf-landing__feature" to={path} key={path}>
                <span className="wf-landing__feature-icon"><FeatureIcon size={23} aria-hidden="true" /></span>
                <h3>{title}</h3><p>{text}</p><span className="wf-landing__feature-action">Explore tab <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>;
            })}
          </div>
        </section>

        <section className="wf-landing__ai wf-landing__container" aria-labelledby="ai-title">
          <div className="wf-landing__ai-copy"><p className="wf-landing__eyebrow"><Sparkles size={16} aria-hidden="true" /> WELLFITNESS AI</p><h2 id="ai-title">A coach with your context.</h2><p>After you create a profile and start logging, the AI Coach can use your fitness goal, body measurements, diet diary, and workout history to answer your questions. It can look up older records when a question needs them.</p><Link className="wf-landing__button" to="/ai-coach">Explore AI Coach <ArrowRight size={18} aria-hidden="true" /></Link></div>
          <div className="wf-landing__ai-details">
            <div><Cpu size={22} aria-hidden="true" /><div><h3>Personal training answers</h3><p>Ask about an exercise, a trend, or what to focus on next.</p></div></div>
            <div><Utensils size={22} aria-hidden="true" /><div><h3>Meal ideas</h3><p>Get ideas based on your goal, daily diary, and nutrition targets.</p></div></div>
            <div><Sparkles size={22} aria-hidden="true" /><div><h3>Editable nutrition estimates</h3><p>Estimate a food's calories and macros, review them, then choose what to save.</p></div></div>
          </div>
        </section>

        <section id="how-it-works" className="wf-landing__steps wf-landing__container" aria-labelledby="steps-title"><div className="wf-landing__section-heading"><p className="wf-landing__eyebrow"><CalendarDays size={16} aria-hidden="true" /> GET STARTED</p><h2 id="steps-title">Explore first. Make it yours when you're ready.</h2></div><div className="wf-landing__steps-grid">{steps.map((step) => <div className="wf-landing__step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>

        <section className="wf-landing__closing wf-landing__container" aria-labelledby="closing-title"><div><p className="wf-landing__eyebrow">READY WHEN YOU ARE</p><h2 id="closing-title">Take a look inside.</h2><p>See the dashboard, browse the tabs, and start building your own record when it feels right.</p></div><Link className="wf-landing__button" to="/dashboard">Explore dashboard <ArrowRight size={18} aria-hidden="true" /></Link></section>
      </main>

      <footer className="wf-landing__footer wf-landing__container"><Link className="wf-landing__brand" to="/" aria-label="WellFitness home"><Zap size={19} fill="currentColor" aria-hidden="true" /> WellFitness<span className="wf-landing__brand-dot">.</span></Link><p>Train with purpose. See your progress.</p><span>© {new Date().getFullYear()} WellFitness</span></footer>
    </div>
  );
}
