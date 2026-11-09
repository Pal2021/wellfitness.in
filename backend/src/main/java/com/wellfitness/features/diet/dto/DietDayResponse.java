package com.wellfitness.features.diet.dto;

import java.time.LocalDate;
import java.util.List;

public record DietDayResponse(
        LocalDate date,
        List<MealEntryResponse> entries,
        NutritionValues totals,
        NutritionValues targets
) {}
