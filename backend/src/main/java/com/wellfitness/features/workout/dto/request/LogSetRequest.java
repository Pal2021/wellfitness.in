package com.wellfitness.features.workout.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogSetRequest {

    @NotNull(message = "Exercise ID is required")
    private UUID exerciseId;

    @NotNull(message = "Set number is required")
    @Min(value = 1, message = "Set number must be at least 1")
    private Integer setNumber;

    @NotNull(message = "Weight is required")
    @Min(value = 0, message = "Weight cannot be negative")
    private BigDecimal weightKg;

    @NotNull(message = "Reps is required")
    @Min(value = 1, message = "Reps must be at least 1")
    private Integer reps;

    private Integer rpe;
}
