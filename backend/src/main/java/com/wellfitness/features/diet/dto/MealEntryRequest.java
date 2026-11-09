package com.wellfitness.features.diet.dto;

import com.wellfitness.features.diet.MealType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MealEntryRequest(
        @NotNull LocalDate loggedDate,
        @NotNull MealType mealType,
        @NotBlank @Size(max = 120) String foodName,
        @Size(max = 80) String serving,
        @NotNull @Min(0) @Max(10000) Integer calories,
        @DecimalMin("0.0") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal proteinGrams,
        @DecimalMin("0.0") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal carbsGrams,
        @DecimalMin("0.0") @DecimalMax("1000.0") @Digits(integer = 4, fraction = 1) BigDecimal fatGrams,
        @Size(max = 1000) String remarks
) {}
