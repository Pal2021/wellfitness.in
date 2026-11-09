package com.wellfitness.features.diet;

public class NutritionEstimateUnavailableException extends RuntimeException {
    public NutritionEstimateUnavailableException() {
        super("Nutrition estimation is unavailable right now. Please enter nutrition values manually.");
    }
}
