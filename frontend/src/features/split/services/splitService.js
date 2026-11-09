import * as apiClient from "../../../services/apiClient";

export const getActiveUserSplit = async () => {
  try {
    const response = await apiClient.getActiveSplit();
    return response.data?.data || null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    console.error("Failed to fetch active split:", error);
    throw error;
  }
};

export const getAllTemplates = async () => {
  try {
    const response = await apiClient.getTemplates();
    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    throw error;
  }
};

export const changeSplitFromTemplate = async (templateId) => {
  try {
    const response = await apiClient.copyFromTemplate({ templateId });
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to change split:", error);
    throw error;
  }
};

export const addExerciseToSplitDay = async (splitId, dayId, exerciseId) => {
  try {
    const response = await apiClient.addExerciseToDay(splitId, dayId, exerciseId);
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to add exercise to split day:", error);
    throw error;
  }
};

export const removeExerciseFromSplitDay = async (splitId, dayId, exerciseId) => {
  try {
    const response = await apiClient.removeExerciseFromDay(splitId, dayId, exerciseId);
    return response.data?.data || null;
  } catch (error) {
    console.error("Failed to remove exercise from split day:", error);
    throw error;
  }
};
