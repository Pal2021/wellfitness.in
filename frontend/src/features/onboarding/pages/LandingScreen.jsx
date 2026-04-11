import React from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../../../theme";

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="bg-surface text-on-surface min-h-screen pb-16 md:pb-0"
        data-mode="connect"
        style={{ fontFamily: typography?.FONT_FAMILY }}
      >
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-[100] bg-zinc-950/40 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(19,19,22,0.4)]">
          <nav className="flex items-center px-6 py-4 max-w-7xl mx-auto justify-center">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-amber-500"
                data-icon="fitness_center"
              >
                fitness_center
              </span>
              <span className="text-2xl font-black italic tracking-widest text-amber-500 font-headline">
                WELLFITNESS
              </span>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[884px] flex items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Moody cinematic shot of a professional athlete performing a heavy barbell squat in a dark industrial gym"
              className="w-full h-full object-cover opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx4mE6ECeR6hz_7UgRXV26K_wd_NC_5FqZtr_qNlLah1jg605lc2ZKA8J5KBohiswJ-dEhcUxL2jMFGAgboFBHnlIW0KNJvb6dIEXhDnpX4W2iCUHJEddm5eV2B1-Q5YZGLLhYmuDXTXvHl8OWz8qltEqOmMC2IsYB82PdDW8O-fLdqPkIuxF-mhB0DHc39yplFpiBuI2DRxhpejvF2WhPTweJseIAVsvy3_9wDLmYautV-KeQFr1qDiT1IkhJhRhAGZ2ikpEGCO8"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-8xl font-headline font-extrabold tracking-tighter mb-6 leading-tight">
              Never Forget What <br />
              <span className="text-transparent bg-clip-text titanium-gradient">
                You Lifted
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl font-body leading-relaxed mb-12">
              WellFitness remembers every rep, set, and session. Elite
              performance requires meticulous data. Log your journey, crush your
              plateaus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 {/* PRIMARY CTA — goes to /register */}
                 // ✅ CHANGE THIS — was /register
<button
  onClick={() => navigate("/login")}
  className="titanium-gradient-bg text-black px-10 py-5 rounded-xl font-headline font-extrabold text-lg tracking-tight hover:scale-105 transition-transform"
>
  Get Started — It's Free 💪
</button>

// ✅ THIS IS ALREADY CORRECT — keep as /login
<button
  onClick={() => navigate("/login")}
  className="border border-amber-500/40 text-amber-500 px-10 py-5 rounded-xl font-headline font-extrabold text-lg tracking-tight hover:border-amber-500 hover:bg-amber-500/10 transition-all"
>
  Already have an account? Sign In
</button>
            </div>
          </div>
        </section>

        {/* Features Section: Horizontal Slider */}
        <section className="py-24 overflow-hidden">
          <div className="px-6 max-w-7xl mx-auto mb-12">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase mb-2 text-white">
                FEATURES
              </h2>
              <p className="text-on-surface-variant text-sm font-medium tracking-wide max-w-md">
                Professional grade tools for the dedicated athlete.
              </p>
            </div>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory px-6 gap-6 pb-8">
            {/* Smart Tracking */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-end relative overflow-hidden group">
              <img
                alt="Weight plates close up"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgoCNlJC-VNBgmvupF3RdnOx0JiuQ5cQXAN9lUtaz3RH_rdjJt4QbJsrdamDm69VKz9gApcFwCk1sljuE30lOSRZbo1kVhbuxPsexbN7MsayXLz79IfKG34WDG5Z1Ly8Zg1iqXHFpv2F0wAf_tVQSncIxg6MQyj8CULvbyBQ3zuepGnu2H5GHUUzuKaoUvcefyFXNvKaPEO4BDpW6UZKCpjClB8Hyi3Ro8rmMF0bhzQtw-yq7UJB_MO4mRP1aRnTUr90uQ1Tt2cv4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <span
                  className="material-symbols-outlined text-9xl"
                  data-icon="edit_note"
                >
                  edit_note
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  Smart Workout Tracking
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Precision logging with velocity tracking and RPE integration.
                  Your digital journal for absolute gains.
                </p>
              </div>
            </div>
            {/* Progress Analytics */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-end relative overflow-hidden group">
              <img
                alt="Gym setting with performance focus"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUHatE2Z39TqgvdiZ03pn1CB3GKcAk9XGCpZkFNMD4njraJBCj4miV6cvwm7bBVJq3G0vSDSzaVvthBAeOnDtvn2CLZI6PmOXo27icc1Nczbj6SaLhnvXVoEFhpDMK89j-jm2luJpPyXzOG90SMVqH8SuYi63tU-hvmMZeORzFlI2Qoi1s9-nLD-daMHj0FR1Z17siKVLJWVw4bLsCL6KI9Nod93Sy0_Zz2Yp4A87isJmU2GndWjoTFl3_pvx7g6DCfx-dEzq7ZIw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <span
                  className="material-symbols-outlined text-9xl"
                  data-icon="monitoring"
                >
                  monitoring
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  Progress Analytics
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Visualize your volume, intensity, and frequency trends over
                  time with high-fidelity data visualizations.
                </p>
              </div>
            </div>
            {/* Custom Splits */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
              <img
                alt="Structured gym environment"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmeY93rBilvuWH4SUmnMG25hoKeFYrPHLLNEy34kmJOqsRkNCzjNgdVhUJQJJcN4-kXovY46jBsu5T_pMVZ80ztJpxaUyPBO0-T-o_zllL4RUeTO6T81vJRluGncsJwCbvCfMI3v1MNUdVuHgud0SSjpbdwIhACaAjqmsqq5Beh_IG8KykX962W858R0atfcFi064fMaDWkQXWMQkrO8HdisJ1BxdVmrQvPR6wq3op_I3UUhU9_lA0Gf3D7yq5YGktP0G9yULntV8"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span
                  className="material-symbols-outlined text-primary text-4xl mb-4"
                  data-icon="calendar_view_day"
                >
                  calendar_view_day
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  Custom Splits
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Dynamic routine management for hyper-personalized training
                  cycles tailored to your morphology.
                </p>
              </div>
            </div>
            {/* PR Detection */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
              <img
                alt="Barbell on floor PR context"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCysMuQ9i7yJXx_CdLTHwvIj0yrFgGpI3vwlMWw8u-vu74JD8bPL9JattYx3QxRIEtXdG94HlfA-6PXpye0WJlxyJHL7L6BPs4wYOo5C2uC9VLVTj6R_0zOq3CjmI7uYKD9c4u_N8FphHOMLepsKB89eY_sGZ33PbNa_hIE4izF1Dg69fteWrOXar6AvyB9UYbHubd0E35gw0lXN0Yfobu8a6tvo4q-loe1EmKoOK-9AjpOjfnVvk659Xc54xDlWiJneMOx44qHMFs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span
                  className="material-symbols-outlined text-primary text-4xl mb-4"
                  data-icon="trophy"
                >
                  trophy
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  PR Detection
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Automated record tracking. Celebrate every milestone with
                  verified data and milestone sharing.
                </p>
              </div>
            </div>
            {/* AI Coach */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
              <img
                alt="Advanced fitness technology visualization"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK56ZpdgXji8YwadYhgq4oFaQwZQ5NQGYb8UTlZw8XN1DXQAJfP1gh-FbfwQRmKFDddV4OiYnLS0KPqeF36WVlX1AvHtIiXH8zZMStCwGEzmMsBeTRxiCYuh2QbPM5D3FAaC1c6QTVWMb2x9rEQvf2zGG4qxp0wnstK_NODu2m77zMzee1tZ8yE0dR2R-nec6yFN7A0W_jYm87HV6p39qwi-m7_eJKJB1H0kwpUa2jpePcE4oiX5HWodKpEizTOELLcNGhiVKW4Fw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span
                  className="material-symbols-outlined text-primary text-4xl mb-4"
                  data-icon="neurology"
                >
                  neurology
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  AI Coach
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Real-time feedback on your training load and recovery metrics
                  powered by neural networks.
                </p>
              </div>
            </div>
            {/* Diet & Nutrition */}
            <div className="flex-shrink-0 w-[85%] sm:w-[400px] snap-center glass-card rounded-2xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden group">
              <img
                alt="Meal prep and fueling"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeJfWqSwHDRpdG28d0-81BPMUVvQokaflU54CXXkNafhUHca-545O9kt2eJl4h-6nin7NtUUExL0HKoYX_CDwHjkzueDACnaAe8PxLUg8ZFn4Xp_6xRzehNlfG7FDk1URBDPIVF67lv3oVf5UcMgUrmhl516lK7c2OxDjeH90aGUoBKOWWs63qVW1CbG5UBTnLiteuef_0nHzfJ2pZSLN5zwfG9DQ18Ic8D01DqpYWwhB7XnmxBwF5CFAp1kvR2fo5z_RPlLp7T5E"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span
                  className="material-symbols-outlined text-primary text-4xl mb-4"
                  data-icon="restaurant"
                >
                  restaurant
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-headline font-extrabold mb-3 text-white">
                  Diet &amp; Nutrition
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Precision macro tracking integrated directly with your
                  training intensity for optimal fueling.
                </p>
              </div>
            </div>
            {/* Spacer for "Hint of next card" at end */}
            <div className="flex-shrink-0 w-12 sm:w-20"></div>
          </div>
          {/* Navigation Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="w-8 h-1 titanium-gradient rounded-full"></div>
            <div className="w-2 h-1 bg-surface-variant rounded-full"></div>
            <div className="w-2 h-1 bg-surface-variant rounded-full"></div>
            <div className="w-2 h-1 bg-surface-variant rounded-full"></div>
          </div>
        </section>

        {/* Why Section */}
        <section className="bg-surface-container-low py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-16 items-center max-w-4xl mx-auto">
              <div>
                <h2 className="text-4xl md:text-7xl font-headline font-extrabold tracking-tighter mb-8 text-white">
                  FEATURES
                </h2>
                <p className="text-on-surface-variant text-lg mb-12">
                  We don't just log workouts; we architect strength. Built for
                  those who demand the highest standards from their digital
                  tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {/* Benefit 1 */}
                  <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/10">
                    <span
                      className="material-symbols-outlined text-primary mb-4"
                      data-icon="timer"
                    >
                      timer
                    </span>
                    <h4 className="font-headline font-extrabold mb-2 text-white">
                      Log sets in seconds
                    </h4>
                    <p className="text-on-surface-variant text-xs">
                      Minimal friction, maximum focus. Back to the iron faster.
                    </p>
                  </div>
                  {/* Benefit 2 */}
                  <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/10">
                    <span
                      className="material-symbols-outlined text-primary mb-4"
                      data-icon="trending_up"
                    >
                      trending_up
                    </span>
                    <h4 className="font-headline font-extrabold mb-2 text-white">
                      See strength progress
                    </h4>
                    <p className="text-on-surface-variant text-xs">
                      Clear trendlines showing your upward trajectory.
                    </p>
                  </div>
                  {/* Benefit 3 */}
                  <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/10">
                    <span
                      className="material-symbols-outlined text-primary mb-4"
                      data-icon="history"
                    >
                      history
                    </span>
                    <h4 className="font-headline font-extrabold mb-2 text-white">
                      Never forget last session
                    </h4>
                    <p className="text-on-surface-variant text-xs">
                      Instant access to previous numbers for progressive
                      overload.
                    </p>
                  </div>
                  {/* Benefit 4 */}
                  <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/10">
                    <span
                      className="material-symbols-outlined text-primary mb-4"
                      data-icon="all_inclusive"
                    >
                      all_inclusive
                    </span>
                    <h4 className="font-headline font-extrabold mb-2 text-white">
                      Build consistency
                    </h4>
                    <p className="text-on-surface-variant text-xs">
                      Visualizing streaks that keep you accountable daily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full relative bg-zinc-950 border-t border-zinc-900 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-amber-500 text-3xl"
                data-icon="fitness_center"
              >
                fitness_center
              </span>
              <span className="text-3xl font-black italic tracking-widest text-amber-500 font-headline">
                WELLFITNESS
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 font-manrope text-xs tracking-widest uppercase font-bold text-zinc-500">
              <a
                className="hover:text-white transition-colors duration-300"
                href="#"
              >
                Manifesto
              </a>
              <a
                className="hover:text-white transition-colors duration-300"
                href="#"
              >
                Protocol
              </a>
              <a
                className="hover:text-white transition-colors duration-300"
                href="#"
              >
                Access
              </a>
              <a
                className="hover:text-white transition-colors duration-300"
                href="#"
              >
                Privacy
              </a>
            </div>
            <p className="font-manrope text-[10px] tracking-[0.2em] text-zinc-600">
              © 2024 WELLFITNESS KINETIC LABORATORY
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
