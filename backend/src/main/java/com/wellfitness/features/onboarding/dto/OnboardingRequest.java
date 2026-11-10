package com.wellfitness.features.onboarding.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequest {

    @NotBlank
    @Pattern(regexp = "LOSE_WEIGHT|GAIN_WEIGHT|BUILD_MUSCLE|GET_STRONGER|STAY_FIT")
    private String goal;
    private String experience;
    private Integer daysPerWeek;

    @NotNull(message = "Body weight is required")
    @DecimalMin("20.0")
    @DecimalMax("500.0")
    @Digits(integer = 3, fraction = 2)
    private BigDecimal bodyweightKg;

    @NotNull(message = "Height is required")
    @Min(80)
    @Max(250)
    private Integer heightCm;

    @NotNull(message = "Template ID is required")
    private UUID templateId;

    private String notificationTime;
}
