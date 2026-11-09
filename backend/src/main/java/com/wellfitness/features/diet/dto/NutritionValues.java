package com.wellfitness.features.diet.dto;

import java.math.BigDecimal;

public record NutritionValues(Integer calories, BigDecimal proteinGrams, BigDecimal carbsGrams, BigDecimal fatGrams) {}
