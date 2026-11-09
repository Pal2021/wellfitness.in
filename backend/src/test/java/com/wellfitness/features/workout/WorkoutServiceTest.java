package com.wellfitness.features.workout;

import com.wellfitness.common.exception.BadRequestException;
import com.wellfitness.features.exercise.ExerciseRepository;
import com.wellfitness.features.pr.PRDetectionService;
import com.wellfitness.features.split.SplitDayRepository;
import com.wellfitness.features.split.entity.SplitDay;
import com.wellfitness.features.split.entity.UserSplit;
import com.wellfitness.features.streak.StreakService;
import com.wellfitness.features.workout.dto.request.LogSetRequest;
import com.wellfitness.features.workout.entity.WorkoutSession;
import com.wellfitness.features.workout.entity.WorkoutSet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {
    @Mock WorkoutSessionRepository sessionRepository;
    @Mock WorkoutSetRepository setRepository;
    @Mock ExerciseRepository exerciseRepository;
    @Mock ProgressiveOverloadService overloadService;
    @Mock PRDetectionService prDetectionService;
    @Mock StreakService streakService;
    @Mock SplitDayRepository splitDayRepository;
    @InjectMocks WorkoutService workoutService;

    @Test
    void rejectsSplitDayOwnedByAnotherUser() {
        UUID userId = UUID.randomUUID();
        UUID dayId = UUID.randomUUID();
        SplitDay day = SplitDay.builder()
                .split(UserSplit.builder().userId(UUID.randomUUID()).isActive(true).build())
                .label("Push").isRestDay(false).build();
        when(sessionRepository.findByUserIdAndStatus(userId, "ACTIVE")).thenReturn(Optional.empty());
        when(splitDayRepository.findById(dayId)).thenReturn(Optional.of(day));

        assertThrows(BadRequestException.class, () -> workoutService.startSession(userId, dayId));
        verifyNoInteractions(setRepository);
    }

    @Test
    void doesNotFinishCompletedSessionAgain() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        WorkoutSession session = WorkoutSession.builder().id(sessionId).userId(userId).status("COMPLETED").build();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> workoutService.endSession(userId, sessionId));
        verifyNoInteractions(streakService);
    }

    @Test
    void cannotReadAnotherUsersSets() {
        UUID sessionId = UUID.randomUUID();
        WorkoutSession session = WorkoutSession.builder().id(sessionId).userId(UUID.randomUUID()).build();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> workoutService.getSessionSets(UUID.randomUUID(), sessionId));
        verifyNoInteractions(setRepository);
    }

    @Test
    void rejectsDuplicateSetNumberForExercise() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        UUID exerciseId = UUID.randomUUID();
        WorkoutSession session = WorkoutSession.builder().id(sessionId).userId(userId).status("ACTIVE").build();
        LogSetRequest request = LogSetRequest.builder().exerciseId(exerciseId).setNumber(1)
                .weightKg(new BigDecimal("40")).reps(8).build();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(setRepository.existsBySessionIdAndExerciseIdAndSetNumber(sessionId, exerciseId, 1)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> workoutService.logSet(userId, sessionId, request));
        verifyNoInteractions(exerciseRepository);
    }

    @Test
    void finishingSessionCalculatesVolumeAndUpdatesStreak() {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        WorkoutSession session = WorkoutSession.builder().id(sessionId).userId(userId).status("ACTIVE").build();
        List<WorkoutSet> sets = List.of(
                WorkoutSet.builder().weightKg(new BigDecimal("40.00")).reps(8).completed(true).build(),
                WorkoutSet.builder().weightKg(new BigDecimal("20.00")).reps(10).completed(true).build());
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(setRepository.findBySessionIdOrderByLoggedAtAsc(sessionId)).thenReturn(sets);
        when(sessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutSession finished = workoutService.endSession(userId, sessionId);

        assertEquals("COMPLETED", finished.getStatus());
        assertEquals(0, new BigDecimal("520.00").compareTo(finished.getTotalVolumeKg()));
        verify(streakService).updateStreakOnWorkoutComplete(userId);
    }

    @Test
    void groupsEveryCompletedExerciseSetBySession() {
        UUID userId = UUID.randomUUID();
        UUID exerciseId = UUID.randomUUID();
        WorkoutSession recent = WorkoutSession.builder().id(UUID.randomUUID())
                .startTime(LocalDateTime.of(2026, 11, 8, 10, 0))
                .splitDayLabel("Pull").build();
        WorkoutSession previous = WorkoutSession.builder().id(UUID.randomUUID())
                .startTime(LocalDateTime.of(2026, 11, 1, 10, 0)).build();
        List<WorkoutSet> sets = List.of(
                WorkoutSet.builder().session(recent).setNumber(1)
                        .weightKg(new BigDecimal("50")).reps(10).isPr(false).build(),
                WorkoutSet.builder().session(recent).setNumber(2)
                        .weightKg(new BigDecimal("55")).reps(8).isPr(true).build(),
                WorkoutSet.builder().session(previous).setNumber(1)
                        .weightKg(new BigDecimal("45")).reps(10).isPr(false).build());
        when(setRepository.findCompletedSessionHistoryForExercise(userId, exerciseId))
                .thenReturn(sets);

        var history = workoutService.getExerciseSessionHistory(userId, exerciseId);

        assertEquals(2, history.size());
        assertEquals(recent.getId(), history.get(0).sessionId());
        assertEquals(new BigDecimal("940"), history.get(0).volumeKg());
        assertEquals(new BigDecimal("55"), history.get(0).bestWeightKg());
        assertEquals(2, history.get(0).sets().size());
        assertEquals(true, history.get(0).sets().get(1).isPr());
        assertEquals(previous.getId(), history.get(1).sessionId());
        verify(setRepository).findCompletedSessionHistoryForExercise(userId, exerciseId);
    }
}
