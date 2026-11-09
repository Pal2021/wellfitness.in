package com.wellfitness.features.workout.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExerciseProgressSummary(
        UUID exerciseId,
        String exerciseName,
        long sessionCount,
        LocalDateTime lastPerformedAt) {
}
