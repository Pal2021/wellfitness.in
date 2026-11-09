import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getProfile } from '../../services/apiClient';

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────
const AuthContext = createContext(null);

// ──────────────────────────────────────────────
// Action types
// ──────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  REHYDRATE_SUCCESS: 'REHYDRATE_SUCCESS',
  REHYDRATE_FAIL: 'REHYDRATE_FAIL',
};

// ──────────────────────────────────────────────
// Initial state
// ──────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isLoading: true,   // true until rehydration attempt finishes
  isAuthenticated: false,
};

// ──────────────────────────────────────────────
// Reducer
// ──────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.REHYDRATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.REHYDRATE_FAIL:
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
}

// ──────────────────────────────────────────────
// Provider component
// ──────────────────────────────────────────────

/**
 * AuthProvider wraps the application and provides authentication state
 * and action methods to all child components via React Context.
 *
 * On mount it attempts to rehydrate the session from a stored JWT token
 * by calling GET /profile. If the token is invalid or missing, the user
 * is treated as unauthenticated.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate on mount
  useEffect(() => {
    async function rehydrate() {
      const storedToken = localStorage.getItem('authToken');

      if (!storedToken) {
        dispatch({ type: AUTH_ACTIONS.REHYDRATE_FAIL });
        return;
      }

      try {
        const response = await getProfile();
        dispatch({
          type: AUTH_ACTIONS.REHYDRATE_SUCCESS,
          payload: {
            user: response.data.data,
            token: storedToken,
          },
        });
      } catch {
        // Token invalid or expired — clear and treat as logged out
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.REHYDRATE_FAIL });
      }
    }

    rehydrate();
  }, []);

  /**
   * Persist a successful login.
   * @param {string} token - JWT token
   * @param {Object} user - User profile object
   */
  const login = useCallback((token, user) => {
    localStorage.setItem('authToken', token);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { token, user },
    });
  }, []);

  /**
   * Clear all auth state and redirect to login.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    window.location.href = '/login';
  }, []);

  /**
   * Merge partial user data into the current user state.
   * Useful after profile edits or onboarding completion.
   * @param {Object} data - Partial user object to merge
   */
  const updateUser = useCallback((data) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: data });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

/**
 * Access the authentication context.
 * Must be used within an <AuthProvider>.
 *
 * @returns {{ user: Object|null, token: string|null, isLoading: boolean, isAuthenticated: boolean, login: Function, logout: Function, updateUser: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
