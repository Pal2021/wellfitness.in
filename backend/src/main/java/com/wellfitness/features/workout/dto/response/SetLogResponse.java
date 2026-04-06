package com.wellfitness.features.workout.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetLogResponse {

    private UUID setId;
    private UUID exerciseId;
    private String exerciseName;
    private int setNumber;
    private BigDecimal weightKg;
    private int reps;
    private Integer rpe;
    private boolean completed;
    private boolean isPr;

    // Previous session data (F08)
    private Map<String, Object> previousSet;

    // Progressive overload suggestion (F09)
    private Map<String, Object> overloadSuggestion;
}
