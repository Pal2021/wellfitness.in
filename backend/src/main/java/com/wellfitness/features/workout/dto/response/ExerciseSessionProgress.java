package com.wellfitness.features.workout.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ExerciseSessionProgress(
        UUID sessionId,
        LocalDateTime startTime,
        String splitDayLabel,
        BigDecimal volumeKg,
        BigDecimal bestWeightKg,
        List<ExerciseSetProgress> sets) {

    public record ExerciseSetProgress(
            int setNumber,
            BigDecimal weightKg,
            int reps,
            Integer rpe,
            boolean isPr) {
    }
}
