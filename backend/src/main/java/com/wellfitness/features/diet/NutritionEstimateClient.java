package com.wellfitness.features.diet;

import com.wellfitness.features.diet.dto.NutritionEstimateRequest;
import com.wellfitness.features.diet.dto.NutritionValues;

public interface NutritionEstimateClient {
    NutritionValues estimate(NutritionEstimateRequest request);
}
