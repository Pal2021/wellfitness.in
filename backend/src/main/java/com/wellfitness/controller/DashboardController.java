package com.wellfitness.controller;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.streak.entity.UserStreak;
import com.wellfitness.features.split.entity.UserSplit;
import com.wellfitness.features.workout.entity.WorkoutSession;
import com.wellfitness.features.pr.entity.PersonalRecord;
import com.wellfitness.repository.PersonalRecordRepository;
import com.wellfitness.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final WorkoutService workoutService;
    private final StreakService streakService;
    private final SplitService splitService;
    private final PersonalRecordRepository personalRecordRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @AuthenticationPrincipal User user) {

        Map<String, Object> dashboard = new LinkedHashMap<>();

        // User info
        dashboard.put("name", user.getName());
        dashboard.put("goal", user.getGoal());

        // Streak
        UserStreak streak = streakService.getStreak(user.getId());
        Map<String, Object> streakMap = new LinkedHashMap<>();
        streakMap.put("current", streak.getCurrentStreak());
        streakMap.put("longest", streak.getLongestStreak());
        streakMap.put("lastWorkoutDate", streak.getLastWorkoutDate() != null ?
                streak.getLastWorkoutDate().toString() : null);
        dashboard.put("streak", streakMap);

        // Total workouts
        long totalWorkouts = workoutService.getTotalWorkoutCount(user.getId());
        dashboard.put("totalWorkouts", totalWorkouts);

        // Today's workout from active split
        try {
            UserSplit activeSplit = splitService.getActiveSplit(user.getId());
            DayOfWeek today = LocalDate.now().getDayOfWeek();
            String todayCode = today.getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase().substring(0, 3);

            activeSplit.getDays().stream()
                    .filter(d -> d.getDayOfWeek().equalsIgnoreCase(todayCode))
                    .findFirst()
                    .ifPresent(day -> {
                        Map<String, Object> todayWorkout = new LinkedHashMap<>();
                        todayWorkout.put("dayId", day.getId());
                        todayWorkout.put("label", day.getLabel());
                        todayWorkout.put("isRestDay", day.getIsRestDay());
                        todayWorkout.put("muscleGroups", day.getMuscleGroups());
                        todayWorkout.put("exerciseCount", day.getExercises().size());
                        todayWorkout.put("splitName", activeSplit.getName());

                        List<Map<String, Object>> exercisePreview = new ArrayList<>();
                        day.getExercises().stream().limit(4).forEach(sde ->
                                exercisePreview.add(Map.of(
                                        "name", sde.getExerciseName(),
                                        "sets", sde.getDefaultSets(),
                                        "reps", sde.getDefaultReps()
                                )));
                        todayWorkout.put("exercises", exercisePreview);
                        dashboard.put("todayWorkout", todayWorkout);
                    });
        } catch (Exception e) {
            dashboard.put("todayWorkout", null);
        }

        // Weekly volume (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<WorkoutSession> recentSessions = workoutService.getRecentSessions(user.getId(), 20);
        Map<String, BigDecimal> weeklyVolume = new LinkedHashMap<>();
        DayOfWeek[] daysOfWeek = DayOfWeek.values();
        for (DayOfWeek d : daysOfWeek) {
            weeklyVolume.put(d.getDisplayName(TextStyle.SHORT, Locale.ENGLISH), BigDecimal.ZERO);
        }
        recentSessions.stream()
                .filter(s -> s.getStartTime().isAfter(weekAgo))
                .forEach(s -> {
                    String day = s.getStartTime().getDayOfWeek()
                            .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                    weeklyVolume.merge(day, s.getTotalVolumeKg(), BigDecimal::add);
                });
        dashboard.put("weeklyVolume", weeklyVolume);

        // Recent PRs
        List<PersonalRecord> recentPRs = personalRecordRepository
                .findByUserIdOrderByAchievedAtDesc(user.getId());
        List<Map<String, Object>> prList = new ArrayList<>();
        recentPRs.stream().limit(5).forEach(pr ->
                prList.add(Map.of(
                        "exerciseName", pr.getExerciseName() != null ? pr.getExerciseName() : "Unknown",
                        "weightKg", pr.getWeightKg(),
                        "reps", pr.getReps(),
                        "estimated1rm", pr.getEstimated1rm(),
                        "achievedAt", pr.getAchievedAt().toString()
                )));
        dashboard.put("recentPRs", prList);

        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
