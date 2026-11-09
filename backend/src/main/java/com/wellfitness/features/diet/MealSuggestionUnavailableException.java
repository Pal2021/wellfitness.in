package com.wellfitness.features.diet;

public class MealSuggestionUnavailableException extends RuntimeException {
    public MealSuggestionUnavailableException() {
        super("Meal ideas are unavailable right now. Please try again later.");
    }
}
