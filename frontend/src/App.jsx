import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./common/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Component, useEffect, useState } from "react";
import { ThemeProvider } from "./common/context/ThemeContext";
import BottomNav from "./common/components/BottomNav";
import SideNav from "./common/components/SideNav";

// ── Feature page imports ───────────────────────────────
import LandingPage from "./features/landing/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import PhoneLoginPage from "./features/auth/pages/PhoneLoginPage";
import VerifyOTPPage from "./features/auth/pages/VerifyOTPPage";
import OnboardingScreen from "./features/onboarding/pages/OnboardingScreen";
import DashboardScreen from "./features/dashboard/pages/DashboardScreen";
import WorkoutScreen from "./features/workout/pages/WorkoutScreen";
import WorkoutLogScreen from "./features/workout/pages/WorkoutLogScreen";
import HistoryScreen from "./features/workout/pages/HistoryScreen";
import ExercisesScreen from "./features/exercise/pages/ExercisesScreen";
import ExerciseDetailScreen from "./features/exercise/pages/ExerciseDetailScreen";
import SplitScreen from "./features/split/pages/SplitScreen";
import ProfileScreen from "./features/profile/pages/ProfileScreen";
import ProgressScreen from "./features/progress/pages/ProgressScreen";
import AiCoachScreen from "./features/ai/pages/AiCoachScreen";
import DietScreen from "./features/diet/pages/DietScreen";

// ──────────────────────────────────────────────
// ProtectedRoute — redirects to /login if unauthenticated
// ──────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { Menu } from "lucide-react";

// ──────────────────────────────────────────────
// ProtectedLayout — responsive shell:
//   Mobile  (<768px): BottomNav fixed at bottom
//   Desktop (≥768px): SideNav on left + content on right
// ──────────────────────────────────────────────
function ProtectedLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /* ── Desktop shell ── */
  if (isDesktop) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", position: "relative" }}>
        {/* Sticky sidebar */}
        <SideNav isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Floating toggle button when sidebar is collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={handleToggleSidebar}
            aria-label="Expand sidebar"
            style={{
              position: "fixed",
              top: "16px",
              left: "16px",
              zIndex: 99,
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(20, 20, 20, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(245, 158, 11, 0.15)";
              e.currentTarget.style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(20, 20, 20, 0.8)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <Menu size={20} />
          </button>
        )}

        {/* Page content — scrollable, full remaining width */}
        <main
          style={{
            flex: 1,
            minHeight: "100vh",
            overflowY: "auto",
            background: "var(--color-bg-primary)",
            transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {children}
        </main>
      </div>
    );
  }

  /* ── Mobile shell ── */
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}


// ──────────────────────────────────────────────
// Root route (Landing vs Dashboard)
// ──────────────────────────────────────────────
function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <LandingPage />
  );
}

// ──────────────────────────────────────────────
// App
// ──────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/phone-login" element={<PhoneLoginPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />

      {/* Onboarding — no bottom nav */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingScreen />
          </ProtectedRoute>
        }
      />

      {/* Protected routes — BottomNav shown globally via ProtectedLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/workout"
        element={
          <ProtectedLayout>
            <WorkoutScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/workout/log"
        element={
          <ProtectedLayout>
            <WorkoutLogScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/workout/history"
        element={
          <ProtectedLayout>
            <HistoryScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedLayout>
            <ExercisesScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/exercises/:id"
        element={
          <ProtectedLayout>
            <ExerciseDetailScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/splits"
        element={
          <ProtectedLayout>
            <SplitScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfileScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedLayout>
            <ProgressScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedLayout>
            <AiCoachScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/diet"
        element={
          <ProtectedLayout>
            <DietScreen />
          </ProtectedLayout>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111] px-6 text-center text-white">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-sm text-white/60">The page could not be displayed. Reload it to try again.</p>
          <button onClick={() => window.location.reload()} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-black">Reload page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "473083426303-lo1u95qd7ptter1pshqe3eaqqutbqgkl.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <BrowserRouter>
          <AppErrorBoundary>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </AppErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
