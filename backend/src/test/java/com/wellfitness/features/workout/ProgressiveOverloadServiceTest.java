package com.wellfitness.features.workout;

import com.wellfitness.features.workout.entity.WorkoutSet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressiveOverloadServiceTest {
    @Mock WorkoutSetRepository workoutSetRepository;
    @InjectMocks ProgressiveOverloadService service;

    @Test
    void suggestsIncreaseAfterMatchingPreviousWeightAndReps() {
        UUID userId = UUID.randomUUID();
        UUID exerciseId = UUID.randomUUID();
        when(workoutSetRepository.findPreviousSetsForExercise(userId, exerciseId))
                .thenReturn(List.of(previousSet()));

        Map<String, Object> suggestion = service.getSuggestion(
                userId, exerciseId, 1, new BigDecimal("80.00"), 10);

        assertEquals(0, new BigDecimal("82.50").compareTo((BigDecimal) suggestion.get("suggestedWeight")));
        assertEquals(10, suggestion.get("suggestedReps"));
    }

    @Test
    void keepsWeightWhenRepsFallBelowPreviousSession() {
        UUID userId = UUID.randomUUID();
        UUID exerciseId = UUID.randomUUID();
        when(workoutSetRepository.findPreviousSetsForExercise(userId, exerciseId))
                .thenReturn(List.of(previousSet()));

        Map<String, Object> suggestion = service.getSuggestion(
                userId, exerciseId, 1, new BigDecimal("80.00"), 8);

        assertEquals(0, new BigDecimal("80.00").compareTo((BigDecimal) suggestion.get("suggestedWeight")));
    }

    private WorkoutSet previousSet() {
        return WorkoutSet.builder().setNumber(1).weightKg(new BigDecimal("80.00"))
                .reps(10).completed(true).build();
    }
}
