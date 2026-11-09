package com.wellfitness.features.diet.dto;

import com.wellfitness.features.diet.MealType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record MealEntryResponse(
        UUID id,
        LocalDate loggedDate,
        MealType mealType,
        String foodName,
        String serving,
        Integer calories,
        BigDecimal proteinGrams,
        BigDecimal carbsGrams,
        BigDecimal fatGrams,
        String remarks
) {}
