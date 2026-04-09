package com.wellfitness.features.workout;

import com.wellfitness.features.workout.entity.WorkoutSet;
import com.wellfitness.features.workout.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * RULE 1 — Progressive Overload Engine.
 * For each set logged, find the last completed session's same set number.
 * If current reps >= last reps → suggest +2.5kg.
 * If current reps < last reps → keep same weight.
 * If no previous → return null.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressiveOverloadService {

    private final WorkoutSetRepository workoutSetRepository;

    public Map<String, Object> getSuggestion(UUID userId, UUID exerciseId, int setNumber) {
        List<WorkoutSet> previousSets = workoutSetRepository
                .findPreviousSetsForExercise(userId, exerciseId);

        // Find set from last session with same set number
        WorkoutSet lastSet = previousSets.stream()
                .filter(s -> s.getSetNumber() == setNumber)
                .findFirst()
                .orElse(null);

        if (lastSet == null) {
            return null; // No previous session data
        }

        BigDecimal suggestedWeight;
        int suggestedReps = lastSet.getReps();

        // Default suggestion: keep same weight (conservative default)
        suggestedWeight = lastSet.getWeightKg();

        // If they hit their rep target in the previous set, suggest +2.5kg
        if (lastSet.getReps() >= suggestedReps) {
            suggestedWeight = lastSet.getWeightKg().add(new BigDecimal("2.5"));
        }

        return Map.of(
                "suggestedWeight", suggestedWeight,
                "suggestedReps", suggestedReps,
                "previousWeight", lastSet.getWeightKg(),
                "previousReps", lastSet.getReps()
        );
    }

    /**
     * Returns the previous session's set data for side-by-side display (F08).
     */
    public Map<String, Object> getPreviousSetData(UUID userId, UUID exerciseId, int setNumber) {
        List<WorkoutSet> previousSets = workoutSetRepository
                .findPreviousSetsForExercise(userId, exerciseId);

        WorkoutSet lastSet = previousSets.stream()
                .filter(s -> s.getSetNumber() == setNumber)
                .findFirst()
                .orElse(null);

        if (lastSet == null) {
            return null;
        }

        return Map.of(
                "weightKg", lastSet.getWeightKg(),
                "reps", lastSet.getReps()
        );
    }
}
