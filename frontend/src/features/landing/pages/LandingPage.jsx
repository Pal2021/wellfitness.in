import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Dumbbell, History, LayoutList, TrendingUp, Zap } from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  { icon: Dumbbell, title: 'Make every set count.', description: 'Keep your reps, weights, and exercises together. Less guesswork, more focus on your next set.', label: 'WORKOUT TRACKING' },
  { icon: TrendingUp, title: 'See how far you’ve come.', description: 'Follow your strength over time and turn the work you put in into progress you can see.', label: 'YOUR PROGRESS' },
  { icon: History, title: 'Pick up where you left off.', description: 'Look back at previous sessions so you always know what you lifted last time.', label: 'SESSION HISTORY' },
  { icon: LayoutList, title: 'Give your training a plan.', description: 'Organize your workout split and build a routine that fits the way you train.', label: 'WORKOUT SPLITS' },
];

export default function LandingPage() {
  return (
    <div className="wf-landing">
      <a className="wf-landing__skip" href="#landing-main">Skip to content</a>
      <header className="wf-landing__header wf-landing__container">
        <Link className="wf-landing__brand" to="/" aria-label="WellFitness home">
          <span className="wf-landing__brand-icon"><Zap size={22} fill="currentColor" aria-hidden="true" /></span>
          <span>WellFitness<span className="wf-landing__brand-dot">.</span></span>
        </Link>
        <nav className="wf-landing__nav" aria-label="Public navigation">
          <Link className="wf-landing__login" to="/login">Log in <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link className="wf-landing__button wf-landing__button--small" to="/register">Get started <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="wf-landing__hero wf-landing__container" aria-labelledby="landing-title">
          <div className="wf-landing__hero-copy">
            <p className="wf-landing__eyebrow"><span /> YOUR TRAINING. ALL TOGETHER.</p>
            <h1 id="landing-title">Show up.<br />Lift strong.<br /><span>Keep growing.</span></h1>
            <p className="wf-landing__intro">Never forget what you lifted. Track every set, build your routine, and make your next session your best one yet.</p>
            <div className="wf-landing__hero-actions">
              <Link className="wf-landing__button" to="/register">Start your journey <ArrowRight size={19} aria-hidden="true" /></Link>
              <Link className="wf-landing__text-link" to="/login">Already a member? <span>Log in</span></Link>
            </div>
            <div className="wf-landing__hero-note"><Check size={15} aria-hidden="true" /> Built for your first rep. And every rep after.</div>
          </div>

          <div className="wf-landing__visual">
            <div className="wf-landing__visual-top"><span>THE WELLFITNESS MINDSET</span><ArrowUpRight size={22} aria-hidden="true" /></div>
            <div className="wf-landing__equipment" aria-hidden="true">
              <div className="wf-landing__orbit wf-landing__orbit--outer" />
              <div className="wf-landing__orbit wf-landing__orbit--inner" />
              <Dumbbell className="wf-landing__dumbbell" size={200} strokeWidth={1.15} />
              <span className="wf-landing__equipment-label">ONE REP AT A TIME</span>
            </div>
            <div className="wf-landing__visual-bottom">
              <p>Small steps.<br /><span>Stronger you.</span></p>
              <span className="wf-landing__visual-badge"><TrendingUp size={20} aria-hidden="true" /></span>
            </div>
            <div className="wf-landing__visual-caption"><span className="wf-landing__status-dot" /> A little stronger, every session.</div>
          </div>
        </section>

        <div className="wf-landing__principles wf-landing__container" aria-label="Training principles">
          <span><span className="wf-landing__principle-number">01</span> Train with intention</span>
          <span><span className="wf-landing__principle-number">02</span> Track your effort</span>
          <span><span className="wf-landing__principle-number">03</span> Build your momentum</span>
        </div>

        <section className="wf-landing__features wf-landing__container" aria-labelledby="landing-features-title">
          <div className="wf-landing__section-heading">
            <div><p className="wf-landing__eyebrow">LESS FRICTION. MORE FOCUS.</p><h2 id="landing-features-title">Your effort deserves<br />a better training partner.</h2></div>
            <p>Simple tools for the work that matters.<br />From your warm-up to your next personal best.</p>
          </div>
          <div className="wf-landing__feature-grid">
            {FEATURES.map((feature) => (
              <article className="wf-landing__feature" key={feature.label}>
                <span className="wf-landing__feature-icon"><feature.icon size={24} strokeWidth={1.6} aria-hidden="true" /></span>
                <p className="wf-landing__feature-label">{feature.label}</p>
                <h3>{feature.title}</h3>
                <p className="wf-landing__feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wf-landing__closing wf-landing__container" aria-labelledby="landing-cta-title">
          <div className="wf-landing__closing-panel">
            <div><p className="wf-landing__eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2 id="landing-cta-title">Bring the effort.<br />We’ll keep the record.</h2><p>A fresh start. A familiar routine. Make it yours.</p></div>
            <Link className="wf-landing__button" to="/register">Create your account <ArrowRight size={19} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <footer className="wf-landing__footer wf-landing__container">
        <Link className="wf-landing__brand" to="/" aria-label="WellFitness home"><Zap size={20} fill="currentColor" aria-hidden="true" /><span>WellFitness<span className="wf-landing__brand-dot">.</span></span></Link>
        <p>Built for the work. Made for you.</p>
        <span>© {new Date().getFullYear()} WellFitness</span>
      </footer>
    </div>
  );
}
