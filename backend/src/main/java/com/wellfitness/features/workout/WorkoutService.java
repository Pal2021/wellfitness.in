package com.wellfitness.features.workout;

import com.wellfitness.features.workout.dto.request.LogSetRequest;
import com.wellfitness.features.workout.dto.response.SetLogResponse;
import com.wellfitness.common.exception.BadRequestException;
import com.wellfitness.common.exception.ResourceNotFoundException;
import com.wellfitness.features.workout.entity.WorkoutSession;
import com.wellfitness.features.workout.entity.WorkoutSet;
import com.wellfitness.features.exercise.entity.Exercise;
import com.wellfitness.features.split.entity.SplitDay;
import com.wellfitness.features.workout.WorkoutSessionRepository;
import com.wellfitness.features.workout.WorkoutSetRepository;
import com.wellfitness.features.exercise.ExerciseRepository;
import com.wellfitness.features.split.SplitDayRepository;
import com.wellfitness.features.split.SplitDayExerciseRepository;
import com.wellfitness.features.split.SplitTemplateRepository;
import com.wellfitness.features.split.SplitTemplateDayRepository;
import com.wellfitness.features.split.UserSplitRepository;
import com.wellfitness.features.streak.UserStreakRepository;
import com.wellfitness.features.pr.PersonalRecordRepository;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.features.pr.PRDetectionService;
import com.wellfitness.features.streak.StreakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutSessionRepository sessionRepository;
    private final WorkoutSetRepository setRepository;
    private final ExerciseRepository exerciseRepository;
    private final ProgressiveOverloadService overloadService;
    private final PRDetectionService prDetectionService;
    private final StreakService streakService;
    private final SplitDayRepository splitDayRepository;

    @Transactional
    public WorkoutSession startSession(UUID userId, UUID splitDayId) {
        // Check for existing active session
        sessionRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .ifPresent(s -> {
                    throw new BadRequestException("You already have an active workout session. End it first.");
                });

        String dayLabel = null;
        if (splitDayId != null) {
            dayLabel = splitDayRepository.findById(splitDayId)
                    .map(SplitDay::getLabel)
                    .orElse(null);
        }

        WorkoutSession session = WorkoutSession.builder()
                .userId(userId)
                .splitDayId(splitDayId)
                .splitDayLabel(dayLabel)
                .startTime(LocalDateTime.now())
                .status("ACTIVE")
                .build();

        session = sessionRepository.save(session);
        log.info("Started workout session {} for user {}", session.getId(), userId);
        return session;
    }

    @Transactional
    public SetLogResponse logSet(UUID userId, UUID sessionId, LogSetRequest request) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkoutSession", "id", sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("Session does not belong to you");
        }
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new BadRequestException("Session is not active");
        }

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", request.getExerciseId()));

        // Create and save the set
        WorkoutSet workoutSet = WorkoutSet.builder()
                .session(session)
                .exerciseId(request.getExerciseId())
                .exerciseName(exercise.getName())
                .setNumber(request.getSetNumber())
                .weightKg(request.getWeightKg())
                .reps(request.getReps())
                .rpe(request.getRpe())
                .completed(true)
                .loggedAt(LocalDateTime.now())
                .build();

        // F10: PR Detection
        boolean isPr = prDetectionService.checkAndUpdatePR(
                userId, exercise.getId(), exercise.getName(),
                request.getWeightKg(), request.getReps(), sessionId);
        workoutSet.setIsPr(isPr);

        workoutSet = setRepository.save(workoutSet);

        // F08: Get previous session data
        Map<String, Object> previousSet = overloadService.getPreviousSetData(
                userId, request.getExerciseId(), request.getSetNumber());

        // F09: Get overload suggestion for next set
        Map<String, Object> overloadSuggestion = overloadService.getSuggestion(
                userId, request.getExerciseId(), request.getSetNumber() + 1);

        return SetLogResponse.builder()
                .setId(workoutSet.getId())
                .exerciseId(exercise.getId())
                .exerciseName(exercise.getName())
                .setNumber(workoutSet.getSetNumber())
                .weightKg(workoutSet.getWeightKg())
                .reps(workoutSet.getReps())
                .rpe(workoutSet.getRpe())
                .completed(true)
                .isPr(isPr)
                .previousSet(previousSet)
                .overloadSuggestion(overloadSuggestion)
                .build();
    }

    /**
     * RULE 4 — On session END: total_volume_kg = SUM(weight_kg × reps) for completed sets.
     */
    @Transactional
    public WorkoutSession endSession(UUID userId, UUID sessionId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkoutSession", "id", sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("Session does not belong to you");
        }

        // Calculate total volume (RULE 4)
        List<WorkoutSet> sets = setRepository.findBySessionIdOrderByLoggedAtAsc(sessionId);
        BigDecimal totalVolume = sets.stream()
                .filter(WorkoutSet::getCompleted)
                .map(s -> s.getWeightKg().multiply(BigDecimal.valueOf(s.getReps())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        session.setTotalVolumeKg(totalVolume);
        session.setEndTime(LocalDateTime.now());
        session.setStatus("COMPLETED");

        // Update streak (RULE 3)
        streakService.updateStreakOnWorkoutComplete(userId);

        log.info("Ended session {} for user {}: {} sets, {}kg total volume",
                sessionId, userId, sets.size(), totalVolume);

        return sessionRepository.save(session);
    }

    public WorkoutSession getActiveSession(UUID userId) {
        return sessionRepository.findByUserIdAndStatus(userId, "ACTIVE").orElse(null);
    }

    public WorkoutSession getSessionById(UUID sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkoutSession", "id", sessionId));
    }

    public Page<WorkoutSession> getHistory(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return sessionRepository.findByUserIdAndStatusOrderByStartTimeDesc(
                userId, "COMPLETED", pageable);
    }

    public List<WorkoutSet> getSessionSets(UUID sessionId) {
        return setRepository.findBySessionIdOrderByLoggedAtAsc(sessionId);
    }

    public long getTotalWorkoutCount(UUID userId) {
        return sessionRepository.countByUserIdAndStatus(userId, "COMPLETED");
    }

    public List<WorkoutSession> getRecentSessions(UUID userId, int limit) {
        return sessionRepository.findRecentCompleted(userId, PageRequest.of(0, limit));
    }

    public List<WorkoutSet> getExerciseHistory(UUID userId, UUID exerciseId) {
        List<WorkoutSet> sets = setRepository.findPreviousSetsForExercise(userId, exerciseId);
        return sets.size() > 30 ? sets.subList(0, 30) : sets;
    }
}
