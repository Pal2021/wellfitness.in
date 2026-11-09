package com.wellfitness.features.diet;

import com.wellfitness.features.diet.entity.NutritionTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NutritionTargetRepository extends JpaRepository<NutritionTarget, UUID> {
}
