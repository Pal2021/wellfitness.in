import api from './api';

// ══════════════════════════════════════════════
//  AUTH  (/auth)
// ══════════════════════════════════════════════

/**
 * Register a new user account.
 * @param {Object} data - Registration payload (email, password, name, etc.)
 * @returns {Promise<import('axios').AxiosResponse>} Server response
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * Log in with credentials.
 * @param {Object} data - Login payload (email, password)
 * @returns {Promise<import('axios').AxiosResponse>} Response containing JWT token
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Verify a user's email address via token link.
 * @param {string} token - Email verification token
 * @returns {Promise<import('axios').AxiosResponse>} Verification result
 */
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`);

/**
 * Send an OTP to a mobile number.
 * @param {string} phone - Mobile phone number
 * @returns {Promise<import('axios').AxiosResponse>} Send result
 */
export const sendMobileOtp = (phone) => api.post('/auth/otp/mobile/send', { phone });

/**
 * Verify an OTP sent to a mobile number.
 * @param {Object} data - Verification payload (phone, otp)
 * @returns {Promise<import('axios').AxiosResponse>} Verification result
 */
export const verifyMobileOtp = (data) => api.post('/auth/otp/mobile/verify', data);

/**
 * Send an OTP to an email address.
 * @param {string} email - Email address to send OTP to
 * @returns {Promise<import('axios').AxiosResponse>} Send result
 */
export const sendEmailOtp = (email) => api.post('/auth/otp/email/send', { email });

/**
 * Verify an OTP sent to an email address.
 * @param {Object} data - Verification payload (email, otp)
 * @returns {Promise<import('axios').AxiosResponse>} Verification result
 */
export const verifyEmailOtp = (data) => api.post('/auth/otp/email/verify', data);

/**
 * Authenticate via Google Sign-In.
 * @param {string} idToken - Google ID token
 * @returns {Promise<import('axios').AxiosResponse>} Response containing JWT token
 */
export const googleAuth = (credential) => api.post('/auth/google', { credential });

/**
 * Authenticate via Firebase Phone Auth.
 * @param {Object} data - Firebase phone auth payload
 * @returns {Promise<import('axios').AxiosResponse>} Response containing JWT token
 */
export const firebasePhone = (data) => api.post('/auth/firebase/phone', data);

// ══════════════════════════════════════════════
//  WORKOUTS  (/workouts)
// ══════════════════════════════════════════════

/**
 * Start a new workout session.
 * @returns {Promise<import('axios').AxiosResponse>} New session data
 */
export const startWorkout = (splitDayId) =>
  api.post('/workouts/start', splitDayId ? { splitDayId } : {});

/**
 * End an active workout session.
 * @param {string|number} sessionId - Workout session ID
 * @returns {Promise<import('axios').AxiosResponse>} Completed session data
 */
export const endWorkout = (sessionId) => api.post(`/workouts/${sessionId}/end`);

/**
 * Get the currently active workout session, if any.
 * @returns {Promise<import('axios').AxiosResponse>} Active session or null
 */
export const getActiveWorkout = () => api.get('/workouts/active');

/**
 * Get full workout history for the authenticated user.
 * @returns {Promise<import('axios').AxiosResponse>} Array of past sessions
 */
export const getWorkoutHistory = (page = 0, size = 20) =>
  api.get('/workouts/history', { params: { page, size } });

/**
 * Get details of a specific workout session.
 * @param {string|number} sessionId - Workout session ID
 * @returns {Promise<import('axios').AxiosResponse>} Session details
 */
export const getWorkout = (sessionId) => api.get(`/workouts/${sessionId}`);

/**
 * Get all sets logged in a workout session.
 * @param {string|number} sessionId - Workout session ID
 * @returns {Promise<import('axios').AxiosResponse>} Array of sets
 */
export const getWorkoutSets = (sessionId) => api.get(`/workouts/${sessionId}/sets`);

/**
 * Add a new set to a workout session.
 * @param {string|number} sessionId - Workout session ID
 * @param {Object} data - Set data (exerciseId, weight, reps, etc.)
 * @returns {Promise<import('axios').AxiosResponse>} Created set
 */
export const addSet = (sessionId, data) => api.post(`/workouts/${sessionId}/sets`, data);

/**
 * Get historical data for a specific exercise across all workouts.
 * @param {string|number} exerciseId - Exercise ID
 * @returns {Promise<import('axios').AxiosResponse>} Exercise history
 */
export const getExerciseHistory = (exerciseId) =>
  api.get(`/workouts/exercise-history/${exerciseId}`);

/** Exercises with at least one completed workout session. */
export const getExerciseProgress = () => api.get('/workouts/exercise-progress');

/** Every completed session and set for one exercise. */
export const getExerciseSessionHistory = (exerciseId) =>
  api.get(`/workouts/exercise-progress/${exerciseId}`);

// ══════════════════════════════════════════════
//  SPLITS  (/splits, /split-templates)
// ══════════════════════════════════════════════

/**
 * Create a user split from a template.
 * @param {Object} data - Template selection payload
 * @returns {Promise<import('axios').AxiosResponse>} Created split
 */
export const copyFromTemplate = (data) => api.post('/splits/from-template', data);

/**
 * Get the user's active training split.
 * @returns {Promise<import('axios').AxiosResponse>} Active split or null
 */
export const getActiveSplit = () => api.get('/splits/active');

/**
 * Update a specific day within a split.
 * @param {string|number} splitId - Split ID
 * @param {string|number} dayId - Day ID within the split
 * @param {Object} data - Updated day data
 * @returns {Promise<import('axios').AxiosResponse>} Updated day
 */
export const updateSplitDay = (splitId, dayId, data) =>
  api.put(`/splits/${splitId}/days/${dayId}`, data);

/**
 * Add an exercise to a split day.
 * @param {string|number} splitId - Split ID
 * @param {string|number} dayId - Day ID
 * @param {string|number} exerciseId - Exercise ID to add
 * @returns {Promise<import('axios').AxiosResponse>} Updated day
 */
export const addExerciseToDay = (splitId, dayId, exerciseId) =>
  api.post(`/splits/${splitId}/days/${dayId}/exercises/${exerciseId}`);

/**
 * Remove an exercise from a split day.
 * @param {string|number} splitId - Split ID
 * @param {string|number} dayId - Day ID
 * @param {string|number} exerciseId - Exercise ID to remove
 * @returns {Promise<import('axios').AxiosResponse>} Updated day
 */
export const removeExerciseFromDay = (splitId, dayId, exerciseId) =>
  api.delete(`/splits/${splitId}/days/${dayId}/exercises/${exerciseId}`);

/**
 * Get all available split templates.
 * @returns {Promise<import('axios').AxiosResponse>} Array of templates
 */
export const getTemplates = () => api.get('/split-templates');

/**
 * Get recommended split templates for the user.
 * @returns {Promise<import('axios').AxiosResponse>} Array of recommended templates
 */
export const getRecommendedTemplates = (days, experience) => api.get(`/split-templates/recommended?days=${days}&experience=${experience}`);

/**
 * Get the days (schedule) of a specific split template.
 * @param {string|number} id - Template ID
 * @returns {Promise<import('axios').AxiosResponse>} Array of template days
 */
export const getTemplateDays = (id) => api.get(`/split-templates/${id}/days`);

// ══════════════════════════════════════════════
//  PROFILE & ONBOARDING
// ══════════════════════════════════════════════

/**
 * Get the authenticated user's profile.
 * @returns {Promise<import('axios').AxiosResponse>} User profile data
 */
export const getProfile = () => api.get('/profile');

/**
 * Update the authenticated user's profile.
 * @param {Object} data - Profile fields to update
 * @returns {Promise<import('axios').AxiosResponse>} Updated profile
 */
export const updateProfile = (data) => api.put('/profile', data);

/**
 * Submit onboarding questionnaire answers.
 * @param {Object} data - Onboarding payload (goals, experience, etc.)
 * @returns {Promise<import('axios').AxiosResponse>} Completion result
 */
export const completeOnboarding = (data) => api.post('/onboarding/complete', data);

// ══════════════════════════════════════════════
//  EXERCISES
// ══════════════════════════════════════════════

/**
 * Get all exercises in the library.
 * @returns {Promise<import('axios').AxiosResponse>} Array of exercises
 */
export const getExercises = () => api.get('/exercises');

/**
 * Add a custom exercise to the library.
 * @param {Object} data - Exercise data (name, muscleGroup, etc.)
 * @returns {Promise<import('axios').AxiosResponse>} Created exercise
 */
export const addExercise = (data) => api.post('/exercises', data);

/**
 * Get details of a specific exercise.
 * @param {string|number} id - Exercise ID
 * @returns {Promise<import('axios').AxiosResponse>} Exercise details
 */
export const getExercise = (id) => api.get(`/exercises/${id}`);

// ══════════════════════════════════════════════
//  DASHBOARD & TRACKING
// ══════════════════════════════════════════════

/**
 * Get the user's dashboard summary data.
 * @returns {Promise<import('axios').AxiosResponse>} Dashboard stats
 */
export const getDashboard = () => api.get('/dashboard');

/**
 * Get the user's personal records.
 * @returns {Promise<import('axios').AxiosResponse>} Array of PRs
 */
export const getPRs = () => api.get('/prs');

/**
 * Get the user's workout streaks.
 * @returns {Promise<import('axios').AxiosResponse>} Streak data
 */
export const getStreaks = () => api.get('/streaks');

// Diet diary and Azure AI meal ideas
export const getDietDay = (date) => api.get('/diet/day', { params: { date } });
export const addMealEntry = (data) => api.post('/diet/entries', data);
export const updateMealEntry = (id, data) => api.put(`/diet/entries/${id}`, data);
export const deleteMealEntry = (id) => api.delete(`/diet/entries/${id}`);
export const saveNutritionTargets = (data) => api.put('/diet/targets', data);
export const getMealSuggestions = (data) => api.post('/diet/suggestions', data);
export const estimateMealNutrition = (data) => api.post('/diet/nutrition-estimate', data, { timeout: 70000 });

// Personal AI Coach. History is bounded; the backend loads the current user's data.
export const askCoach = (message, history = []) =>
  api.post('/coach/ask', { message, history }, { timeout: 240000 });
