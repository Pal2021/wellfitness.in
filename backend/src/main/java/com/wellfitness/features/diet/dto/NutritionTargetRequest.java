package com.wellfitness.features.diet.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record NutritionTargetRequest(
        @Min(1) @Max(10000) Integer calories,
        @DecimalMin("0.1") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal proteinGrams,
        @DecimalMin("0.1") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal carbsGrams,
        @DecimalMin("0.1") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal fatGrams
) {}
