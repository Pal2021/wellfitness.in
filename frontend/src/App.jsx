import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./common/context/AuthContext";
import LandingScreen from "./features/onboarding/pages/LandingScreen";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import OnboardingScreen from "./features/onboarding/pages/OnboardingScreen";
import DashboardScreen from "./features/dashboard/pages/DashboardScreen";
import WorkoutScreen from "./features/workout/pages/WorkoutScreen";
import ExercisesScreen from "./features/exercise/pages/ExercisesScreen";
import SplitScreen from "./features/split/pages/SplitScreen";
import ProfileScreen from "./features/profile/pages/ProfileScreen";
import DietScreen from "./features/diet/pages/DietScreen";
import AiCoachScreen from "./features/ai/pages/AiCoachScreen";
import RewardsScreen from "./features/rewards/pages/RewardsScreen";
import CommunityScreen from "./features/community/pages/CommunityScreen";
import ProgressScreen from "./features/progress/pages/ProgressScreen";
import HistoryScreen from "./features/workout/pages/HistoryScreen";
import PhaseDetailScreen from "./features/dashboard/pages/PhaseDetailScreen";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/welcome" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user && user.onboardingComplete) return <Navigate to="/" replace />;
  if (user && !user.onboardingComplete)
    return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Landing & Auth */}
      <Route
        path="/welcome"
        element={
          <AuthRoute>
            <LandingScreen />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        }
      />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* Phase 1 — Working screens */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <WorkoutScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExercisesScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/split"
        element={
          <ProtectedRoute>
            <SplitScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryScreen />
          </ProtectedRoute>
        }
      />

      {/* Coming Soon — Placeholder screens */}
      <Route
        path="/diet"
        element={
          <ProtectedRoute>
            <DietScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AiCoachScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <ProtectedRoute>
            <RewardsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <CommunityScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/phase/:id"
        element={
          <ProtectedRoute>
            <PhaseDetailScreen />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
