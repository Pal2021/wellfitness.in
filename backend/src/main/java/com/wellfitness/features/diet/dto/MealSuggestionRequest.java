package com.wellfitness.features.diet.dto;

import com.wellfitness.features.diet.MealType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MealSuggestionRequest(
        @NotNull LocalDate date,
        @NotNull MealType mealType,
        @Size(max = 500) String preferences
) {}
