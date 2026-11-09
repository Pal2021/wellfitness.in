package com.wellfitness.features.diet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NutritionEstimateRequest(
        @NotBlank @Size(max = 120) String foodName,
        @NotBlank @Size(max = 80) String serving,
        @Size(max = 1000) String remarks
) {}
