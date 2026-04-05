import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import ExercisesScreen from "./screens/ExercisesScreen";
import SplitScreen from "./screens/SplitScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DietScreen from "./screens/DietScreen";
import AiCoachScreen from "./screens/AiCoachScreen";
import RewardsScreen from "./screens/RewardsScreen";
import CommunityScreen from "./screens/CommunityScreen";
import ProgressScreen from "./screens/ProgressScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PhaseDetailScreen from "./screens/PhaseDetailScreen";

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
            <LoginScreen />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <RegisterScreen />
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
