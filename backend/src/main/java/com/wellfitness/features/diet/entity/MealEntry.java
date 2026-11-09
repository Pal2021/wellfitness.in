package com.wellfitness.features.diet.entity;

import com.wellfitness.features.diet.MealType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "meal_entries", indexes = @Index(name = "idx_meal_user_date", columnList = "user_id,logged_date"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealEntry {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID userId;

    @Column(name = "logged_date", nullable = false)
    private LocalDate loggedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    @Column(name = "food_name", nullable = false, length = 120)
    private String foodName;

    @Column(length = 80)
    private String serving;

    @Column(length = 1000)
    private String remarks;

    @Column(nullable = false)
    private Integer calories;

    @Column(name = "protein_grams", precision = 6, scale = 1)
    private BigDecimal proteinGrams;

    @Column(name = "carbs_grams", precision = 6, scale = 1)
    private BigDecimal carbsGrams;

    @Column(name = "fat_grams", precision = 6, scale = 1)
    private BigDecimal fatGrams;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
