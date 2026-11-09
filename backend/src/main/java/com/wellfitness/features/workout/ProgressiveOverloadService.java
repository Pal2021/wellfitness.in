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
 * Compare the logged set with the same set in the previous completed session.
 * Matching or exceeding its weight and reps suggests +2.5 kg for the next set.
 * Otherwise keep the weight just used. No previous set means no suggestion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressiveOverloadService {

    private final WorkoutSetRepository workoutSetRepository;

    public Map<String, Object> getSuggestion(UUID userId, UUID exerciseId, int setNumber,
                                             BigDecimal currentWeightKg, int currentReps) {
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

        BigDecimal suggestedWeight = currentWeightKg;
        if (currentWeightKg.compareTo(BigDecimal.ZERO) > 0
                && currentWeightKg.compareTo(lastSet.getWeightKg()) >= 0
                && currentReps >= lastSet.getReps()) {
            suggestedWeight = currentWeightKg.add(new BigDecimal("2.5"));
        }

        return Map.of(
                "suggestedWeight", suggestedWeight,
                "suggestedReps", lastSet.getReps(),
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
