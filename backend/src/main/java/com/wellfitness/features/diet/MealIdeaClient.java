package com.wellfitness.features.diet;

import com.wellfitness.features.diet.dto.MealIdea;
import com.wellfitness.features.diet.dto.NutritionValues;

import java.time.LocalDate;
import java.util.List;

public interface MealIdeaClient {
    List<MealIdea> suggest(LocalDate date, MealType mealType, String goal,
                           List<String> loggedFoods, NutritionValues totals,
                           NutritionValues targets, String preferences);
}
