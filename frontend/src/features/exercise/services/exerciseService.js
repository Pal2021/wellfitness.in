import * as apiClient from "../../../services/apiClient";

/**
 * Fetch all exercises with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.muscleGroup - Filter by muscle group
 * @param {string} filters.equipment - Filter by equipment
 * @param {string} filters.search - Search term for exercise name
 * @returns {Promise<Array>} Array of exercises
 */
export const fetchAllExercises = async (filters = {}) => {
  try {
    const response = await apiClient.getExercises();
    let exercises = response.data?.data || [];

    // Apply client-side filtering
    if (filters.muscleGroup) {
      exercises = exercises.filter((ex) =>
        ex.muscleGroup
          ?.toLowerCase()
          .includes(filters.muscleGroup.toLowerCase()),
      );
    }

    if (filters.equipment) {
      exercises = exercises.filter((ex) =>
        ex.equipment?.toLowerCase().includes(filters.equipment.toLowerCase()),
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      exercises = exercises.filter((ex) =>
        ex.name?.toLowerCase().includes(searchTerm),
      );
    }

    return exercises;
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    throw error;
  }
};

/**
 * Fetch a single exercise by ID
 * @param {string} id - Exercise ID
 * @returns {Promise<Object>} Exercise details
 */
export const fetchExerciseById = async (id) => {
  try {
    const response = await apiClient.getExercise(id);
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch exercise ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new custom exercise
 * @param {Object} exerciseData - Exercise data
 * @returns {Promise<Object>} Created exercise
 */
export const createCustomExercise = async (exerciseData) => {
  try {
    const response = await apiClient.addExercise(exerciseData);
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to create exercise:", error);
    throw error;
  }
};

/**
 * Get unique muscle groups from exercises
 * @param {Array} exercises - Array of exercises
 * @returns {Array} Unique muscle groups
 */
export const getMuscleGroups = (exercises) => {
  const groups = new Set();
  exercises.forEach((ex) => {
    if (ex.muscleGroup) groups.add(ex.muscleGroup);
  });
  return Array.from(groups).sort();
};

/**
 * Get unique equipment types from exercises
 * @param {Array} exercises - Array of exercises
 * @returns {Array} Unique equipment types
 */
export const getEquipmentTypes = (exercises) => {
  const equipment = new Set();
  exercises.forEach((ex) => {
    if (ex.equipment) equipment.add(ex.equipment);
  });
  return Array.from(equipment).sort();
};
