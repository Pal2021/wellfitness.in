package com.wellfitness.features.diet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "nutrition_targets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionTarget {
    @Id
    @Column(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID userId;

    private Integer calories;

    @Column(name = "protein_grams", precision = 6, scale = 1)
    private BigDecimal proteinGrams;

    @Column(name = "carbs_grams", precision = 6, scale = 1)
    private BigDecimal carbsGrams;

    @Column(name = "fat_grams", precision = 6, scale = 1)
    private BigDecimal fatGrams;
}
