import React from "react";
import { useNavigate } from "react-router-dom";

/* ──── Color Tokens (Material Design 3 from Stitch) ──── */
const C = {
  surface: "#131316",
  surfaceLow: "#1c1b1e",
  surfaceLowest: "#0e0e10",
  surfaceVariant: "#353437",
  onSurface: "#e5e1e5",
  onSurfaceVariant: "#d7c3ae",
  primary: "#ffc880",
  primaryContainer: "#f5a623",
  onPrimaryContainer: "#644000",
  amber500: "#f59e0b",
  outlineVariant: "#524534",
  zinc950: "#09090b",
  zinc900: "#18181b",
  zinc600: "#52525b",
  zinc500: "#71717a",
};

const FONT_HEADLINE = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'Manrope', sans-serif";

/* ──── Feature cards data ──── */
const FEATURES = [
  {
    title: "Smart Workout Tracking",
    desc: "Precision logging with velocity tracking and RPE integration. Your digital journal for absolute gains.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoCNlJC-VNBgmvupF3RdnOx0JiuQ5cQXAN9lUtaz3RH_rdjJt4QbJsrdamDm69VKz9gApcFwCk1sljuE30lOSRZbo1kVhbuxPsexbN7MsayXLz79IfKG34WDG5Z1Ly8Zg1iqXHFpv2F0wAf_tVQSncIxg6MQyj8CULvbyBQ3zuepGnu2H5GHUUzuKaoUvcefyFXNvKaPEO4BDpW6UZKCpjClB8Hyi3Ro8rmMF0bhzQtw-yq7UJB_MO4mRP1aRnTUr90uQ1Tt2cv4",
    icon: "edit_note",
    iconPos: "corner",
    imgOpacity: 0.3,
  },
  {
    title: "Progress Analytics",
    desc: "Visualize your volume, intensity, and frequency trends over time with high-fidelity data visualizations.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUHatE2Z39TqgvdiZ03pn1CB3GKcAk9XGCpZkFNMD4njraJBCj4miV6cvwm7bBVJq3G0vSDSzaVvthBAeOnDtvn2CLZI6PmOXo27icc1Nczbj6SaLhnvXVoEFhpDMK89j-jm2luJpPyXzOG90SMVqH8SuYi63tU-hvmMZeORzFlI2Qoi1s9-nLD-daMHj0FR1Z17siKVLJWVw4bLsCL6KI9Nod93Sy0_Zz2Yp4A87isJmU2GndWjoTFl3_pvx7g6DCfx-dEzq7ZIw",
    icon: "monitoring",
    iconPos: "corner",
    imgOpacity: 0.3,
  },
  {
    title: "Custom Splits",
    desc: "Dynamic routine management for hyper-personalized training cycles tailored to your morphology.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmeY93rBilvuWH4SUmnMG25hoKeFYrPHLLNEy34kmJOqsRkNCzjNgdVhUJQJJcN4-kXovY46jBsu5T_pMVZ80ztJpxaUyPBO0-T-o_zllL4RUeTO6T81vJRluGncsJwCbvCfMI3v1MNUdVuHgud0SSjpbdwIhACaAjqmsqq5Beh_IG8KykX962W858R0atfcFi064fMaDWkQXWMQkrO8HdisJ1BxdVmrQvPR6wq3op_I3UUhU9_lA0Gf3D7yq5YGktP0G9yULntV8",
    icon: "calendar_view_day",
    iconPos: "top",
    imgOpacity: 0.2,
  },
  {
    title: "PR Detection",
    desc: "Automated record tracking. Celebrate every milestone with verified data and milestone sharing.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCysMuQ9i7yJXx_CdLTHwvIj0yrFgGpI3vwlMWw8u-vu74JD8bPL9JattYx3QxRIEtXdG94HlfA-6PXpye0WJlxyJHL7L6BPs4wYOo5C2uC9VLVTj6R_0zOq3CjmI7uYKD9c4u_N8FphHOMLepsKB89eY_sGZ33PbNa_hIE4izF1Dg69fteWrOXar6AvyB9UYbHubd0E35gw0lXN0Yfobu8a6tvo4q-loe1EmKoOK-9AjpOjfnVvk659Xc54xDlWiJneMOx44qHMFs",
    icon: "trophy",
    iconPos: "top",
    imgOpacity: 0.3,
  },
  {
    title: "AI Coach",
    desc: "Real-time feedback on your training load and recovery metrics powered by neural networks.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK56ZpdgXji8YwadYhgq4oFaQwZQ5NQGYb8UTlZw8XN1DXQAJfP1gh-FbfwQRmKFDddV4OiYnLS0KPqeF36WVlX1AvHtIiXH8zZMStCwGEzmMsBeTRxiCYuh2QbPM5D3FAaC1c6QTVWMb2x9rEQvf2zGG4qxp0wnstK_NODu2m77zMzee1tZ8yE0dR2R-nec6yFN7A0W_jYm87HV6p39qwi-m7_eJKJB1H0kwpUa2jpePcE4oiX5HWodKpEizTOELLcNGhiVKW4Fw",
    icon: "neurology",
    iconPos: "top",
    imgOpacity: 0.2,
  },
  {
    title: "Diet & Nutrition",
    desc: "Precision macro tracking integrated directly with your training intensity for optimal fueling.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeJfWqSwHDRpdG28d0-81BPMUVvQokaflU54CXXkNafhUHca-545O9kt2eJl4h-6nin7NtUUExL0HKoYX_CDwHjkzueDACnaAe8PxLUg8ZFn4Xp_6xRzehNlfG7FDk1URBDPIVF67lv3oVf5UcMgUrmhl516lK7c2OxDjeH90aGUoBKOWWs63qVW1CbG5UBTnLiteuef_0nHzfJ2pZSLN5zwfG9DQ18Ic8D01DqpYWwhB7XnmxBwF5CFAp1kvR2fo5z_RPlLp7T5E",
    icon: "restaurant",
    iconPos: "top",
    imgOpacity: 0.2,
  },
];

const BENEFITS = [
  { icon: "timer", title: "Log sets in seconds", desc: "Minimal friction, maximum focus. Back to the iron faster." },
  { icon: "trending_up", title: "See strength progress", desc: "Clear trendlines showing your upward trajectory." },
  { icon: "history", title: "Never forget last session", desc: "Instant access to previous numbers for progressive overload." },
  { icon: "all_inclusive", title: "Build consistency", desc: "Visualizing streaks that keep you accountable daily." },
];

/* ──── Inline-style component CSS (embedded <style>) ──── */
const PAGE_CSS = `
  .ob-cta-btn {
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  .ob-cta-btn:hover {
    transform: scale(1.05);
  }
  .ob-feature-card:hover .ob-card-img {
    transform: scale(1.1);
  }
  .ob-feature-card:hover .ob-corner-icon {
    opacity: 0.4;
  }
  .ob-footer-link {
    transition: color 0.3s ease;
  }
  .ob-footer-link:hover {
    color: #fff !important;
  }
`;

export default function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div style={{
        background: C.surface,
        color: C.onSurface,
        fontFamily: FONT_BODY,
        minHeight: "100vh",
        overflowX: "hidden",
      }}>

        {/* ═══ TopAppBar ═══ */}
        <header style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          background: "rgba(9,9,11,0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 12px 32px -4px rgba(19,19,22,0.4)",
        }}>
          <nav style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 24px",
            maxWidth: 1280,
            margin: "0 auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: C.amber500, fontSize: 24 }}>
                fitness_center
              </span>
              <span style={{
                fontSize: 24,
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "0.1em",
                color: C.amber500,
                fontFamily: FONT_HEADLINE,
              }}>
                WELLFITNESS
              </span>
            </div>
          </nav>
        </header>

        {/* ═══ Hero Section ═══ */}
        <section style={{
          position: "relative",
          minHeight: 884,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 80,
          overflow: "hidden",
        }}>
          {/* Background image */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img
              alt="Cinematic dark gym athlete barbell squat"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx4mE6ECeR6hz_7UgRXV26K_wd_NC_5FqZtr_qNlLah1jg605lc2ZKA8J5KBohiswJ-dEhcUxL2jMFGAgboFBHnlIW0KNJvb6dIEXhDnpX4W2iCUHJEddm5eV2B1-Q5YZGLLhYmuDXTXvHl8OWz8qltEqOmMC2IsYB82PdDW8O-fLdqPkIuxF-mhB0DHc39yplFpiBuI2DRxhpejvF2WhPTweJseIAVsvy3_9wDLmYautV-KeQFr1qDiT1IkhJhRhAGZ2ikpEGCO8"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, display: "block" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, rgba(19,19,22,0.2) 0%, rgba(19,19,22,0.6) 50%, ${C.surface} 100%)`,
            }} />
          </div>

          {/* Hero content */}
          <div style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}>
            <h1 style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontFamily: FONT_HEADLINE,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              marginBottom: 24,
            }}>
              Never Forget What<br />
              <span className="titanium-gradient" style={{
                backgroundImage: "linear-gradient(135deg, #ffc880 0%, #f5a623 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}>
                You Lifted
              </span>
            </h1>
            <p style={{
              maxWidth: 672,
              margin: "0 auto 48px",
              color: C.onSurfaceVariant,
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              fontFamily: FONT_BODY,
              lineHeight: 1.7,
            }}>
              WellFitness remembers every rep, set, and session. Elite performance
              requires meticulous data. Log your journey, crush your plateaus.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <button
                className="ob-cta-btn"
                onClick={() => navigate("/login")}
                style={{
                  background: "linear-gradient(135deg, #ffc880 0%, #f5a623 100%)",
                  color: C.onPrimaryContainer,
                  padding: "20px 40px",
                  borderRadius: 12,
                  fontFamily: FONT_HEADLINE,
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.025em",
                  border: "none",
                  boxShadow: "0 0 30px rgba(245,166,35,0.3)",
                }}
              >
                Sign Up For Free
              </button>
            </div>
          </div>
        </section>

        {/* ═══ Features Slider ═══ */}
        <section style={{ padding: "96px 0", overflow: "hidden" }}>
          {/* Section header */}
          <div style={{ padding: "0 24px", maxWidth: 1280, margin: "0 auto 48px", textAlign: "center" }}>
            <h2 style={{
              fontSize: "clamp(3rem, 7vw, 4.5rem)",
              fontFamily: FONT_HEADLINE,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              FEATURES
            </h2>
            <p style={{ color: C.onSurfaceVariant, fontSize: 14, fontWeight: 500, letterSpacing: "0.025em", maxWidth: 448, margin: "0 auto" }}>
              Professional grade tools for the dedicated athlete.
            </p>
          </div>

          {/* Horizontal scroll cards */}
          <div className="hide-scrollbar" style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "0 24px",
            gap: 24,
            paddingBottom: 32,
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="ob-feature-card"
                style={{
                  flexShrink: 0,
                  width: "85%",
                  maxWidth: 400,
                  scrollSnapAlign: "center",
                  borderRadius: 16,
                  padding: 32,
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: f.iconPos === "corner" ? "flex-end" : "space-between",
                  position: "relative",
                  overflow: "hidden",
                  background: "rgba(53,52,55,0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Card background image */}
                <img
                  alt={f.title}
                  className="ob-card-img"
                  src={f.img}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: f.imgOpacity,
                    transition: "transform 0.5s ease",
                    display: "block",
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                }} />

                {/* Corner icon (for first two cards) */}
                {f.iconPos === "corner" && (
                  <div className="ob-corner-icon" style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 32,
                    opacity: 0.2,
                    transition: "opacity 0.3s ease",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 128 }}>
                      {f.icon}
                    </span>
                  </div>
                )}

                {/* Top icon (for remaining cards) */}
                {f.iconPos === "top" && (
                  <div style={{ position: "relative", zIndex: 10 }}>
                    <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 36, display: "block", marginBottom: 16 }}>
                      {f.icon}
                    </span>
                  </div>
                )}

                {/* Card text content */}
                <div style={{ position: "relative", zIndex: 10 }}>
                  <h3 style={{
                    fontSize: 24,
                    fontFamily: FONT_HEADLINE,
                    fontWeight: 800,
                    marginBottom: 12,
                    color: "#fff",
                  }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
            {/* End spacer */}
            <div style={{ flexShrink: 0, width: 48 }} />
          </div>

          {/* Scroll indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
            <div style={{ width: 32, height: 4, borderRadius: 999, background: "linear-gradient(135deg, #ffc880, #f5a623)" }} />
            <div style={{ width: 8, height: 4, borderRadius: 999, background: C.surfaceVariant }} />
            <div style={{ width: 8, height: 4, borderRadius: 999, background: C.surfaceVariant }} />
            <div style={{ width: 8, height: 4, borderRadius: 999, background: C.surfaceVariant }} />
          </div>
        </section>

        {/* ═══ Why / Benefits Section ═══ */}
        <section style={{
          background: C.surfaceLow,
          padding: "96px 24px",
          overflow: "hidden",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ maxWidth: 896, margin: "0 auto" }}>
              <h2 style={{
                fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
                fontFamily: FONT_HEADLINE,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                marginBottom: 32,
              }}>
                FEATURES
              </h2>
              <p style={{ color: C.onSurfaceVariant, fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
                We don't just log workouts; we architect strength. Built for
                those who demand the highest standards from their digital tools.
              </p>

              {/* Benefits grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
                maxWidth: 896,
                margin: "0 auto",
              }}>
                {BENEFITS.map((b, i) => (
                  <div key={i} style={{
                    padding: 24,
                    borderRadius: 16,
                    background: C.surfaceLowest,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    border: `1px solid rgba(82,69,52,0.1)`,
                  }}>
                    <span className="material-symbols-outlined" style={{ color: C.primary, marginBottom: 16, display: "block", fontSize: 24 }}>
                      {b.icon}
                    </span>
                    <h4 style={{ fontFamily: FONT_HEADLINE, fontWeight: 800, marginBottom: 8, color: "#fff" }}>
                      {b.title}
                    </h4>
                    <p style={{ color: C.onSurfaceVariant, fontSize: 12, lineHeight: 1.6 }}>
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer style={{
          width: "100%",
          background: C.zinc950,
          borderTop: `1px solid ${C.zinc900}`,
          padding: "64px 24px",
        }}>
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: C.amber500, fontSize: 30 }}>
                fitness_center
              </span>
              <span style={{
                fontSize: 30,
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "0.1em",
                color: C.amber500,
                fontFamily: FONT_HEADLINE,
              }}>
                WELLFITNESS
              </span>
            </div>

            {/* Links */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 40,
              fontFamily: FONT_BODY,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: C.zinc500,
            }}>
              {["Manifesto", "Protocol", "Access", "Privacy"].map((link) => (
                <a key={link} className="ob-footer-link" href="#" style={{ color: C.zinc500 }}>
                  {link}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: 10,
              letterSpacing: "0.2em",
              color: C.zinc600,
            }}>
              © 2024 WELLFITNESS KINETIC LABORATORY
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}