import { useNavigate } from "react-router-dom";
import { colors, typography } from "../../../theme";
import "./LandingScreen.css";

const FEATURES = [
  {
    emoji: "🏋️",
    title: "Smart Workout Tracking",
    desc: "Log sets, reps, and weights with intelligent PR detection",
  },
  {
    emoji: "📊",
    title: "Progress Analytics",
    desc: "Track your strength gains with visual charts and reports",
  },
  {
    emoji: "📋",
    title: "Custom Splits",
    desc: "PPL, Upper/Lower, Bro Split, Arnold — or build your own",
  },
  {
    emoji: "🏆",
    title: "PR Detection",
    desc: "Automatic personal record tracking across all exercises",
  },
  {
    emoji: "🤖",
    title: "AI Coach",
    desc: "Get personalized training advice powered by AI (Coming Soon)",
  },
  {
    emoji: "🥗",
    title: "Diet & Nutrition",
    desc: "Indian food database with macro tracking (Coming Soon)",
  },
];

const BENEFITS = [
  { icon: "⚡", text: "Track workouts in seconds" },
  { icon: "📈", text: "See your strength progress over time" },
  { icon: "🎯", text: "Never forget what you lifted last session" },
  { icon: "🔥", text: "Build consistency with streak tracking" },
  { icon: "💪", text: "55+ exercises with custom additions" },
  { icon: "🆓", text: "Phase 1 is completely free" },
];

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-root"
      style={{
        minHeight: "100vh",
        animation: "fadeIn 0.5s ease",
        fontFamily: typography.FONT_FAMILY,
        // expose theme colors to CSS variables
        ["--amber"]: colors.AMBER,
        ["--bg-primary"]: colors.BG_PRIMARY,
        ["--bg-secondary"]: colors.BG_SECONDARY,
        ["--text-primary"]: colors.TEXT_PRIMARY,
        ["--text-secondary"]: colors.TEXT_SECONDARY,
      }}
    >
      {/* Hero */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="kicker">SMART GYM TRACKER</div>
            <h1 className="title">Wellfitness</h1>
            <div className="subtitle">Track. Lift. Progress.</div>
            <p className="description">
              The smart gym companion that remembers every rep, tracks your PRs,
              and helps you get stronger — session by session.
            </p>

            <div className="cta-row">
              <button
                aria-label="Get started"
                className="btn-primary"
                onClick={() => navigate("/login")}
              >
                Get Started — It's Free 💪
              </button>
              <button
                aria-label="Sign in"
                className="btn-outline"
                onClick={() => navigate("/login")}
              >
                Already have an account? Sign In
              </button>
            </div>

            <ul className="mini-features">
              <li>
                ⚡ Track workouts in seconds • 📊 Progress charts • 🏆 PR
                detection
              </li>
            </ul>
          </div>

          <div className="hero-right" aria-hidden>
            <div className="phone-mock">
              <div className="phone-topbar" />
              <div className="phone-body">
                <div className="chart-rect" />
                <div className="card-row">
                  <div className="stat-card">
                    <div className="stat-num">225</div>
                    <div className="stat-label">Bench</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-num">85</div>
                    <div className="stat-label">Squat</div>
                  </div>
                </div>
                <div className="button-placeholder">Log Set</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="features">
        <div className="section-head">
          <div className="tag">FEATURES</div>
          <h2>Everything You Need to Level Up</h2>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <article key={i} className="feature-card">
              <div className="emoji">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="section-head">
          <div className="tag">WHY WELLFITNESS?</div>
          <h2>Built for Serious Lifters</h2>
        </div>

        <ul className="benefits-list">
          {BENEFITS.map((b, i) => (
            <li key={i}>
              <span className="icon">{b.icon}</span>
              <span className="text">{b.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom CTA */}
      <footer className="bottom-cta">
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Get Started Free →
        </button>
      </footer>
    </div>
  );
}
