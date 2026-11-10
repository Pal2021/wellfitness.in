package com.wellfitness.features.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.diet.MealEntryRepository;
import com.wellfitness.features.diet.NutritionTargetRepository;
import com.wellfitness.features.diet.entity.MealEntry;
import com.wellfitness.features.profile.BodyMeasurementRepository;
import com.wellfitness.features.profile.entity.BodyMeasurement;
import com.wellfitness.features.workout.WorkoutSessionRepository;
import com.wellfitness.features.workout.WorkoutSetRepository;
import com.wellfitness.features.workout.entity.WorkoutSession;
import com.wellfitness.features.workout.entity.WorkoutSet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CoachDataTools {
    private final MealEntryRepository meals;
    private final NutritionTargetRepository targets;
    private final WorkoutSessionRepository sessions;
    private final WorkoutSetRepository sets;
    private final BodyMeasurementRepository measurements;

    @Transactional(readOnly = true)
    public Map<String, Object> overview(User user) {
        LocalDate today = LocalDate.now();
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("asOfDate", today);
        context.put("goal", user.getGoal());
        context.put("experience", user.getExperience());
        context.put("plannedTrainingDaysPerWeek", user.getDaysPerWeek());
        context.put("currentWeightKg", user.getBodyweightKg());
        context.put("heightCm", user.getHeightCm());
        if (user.getBodyweightKg() != null && user.getHeightCm() != null && user.getHeightCm() > 0) {
            BigDecimal metres = BigDecimal.valueOf(user.getHeightCm()).movePointLeft(2);
            context.put("currentBmi", user.getBodyweightKg()
                    .divide(metres.multiply(metres), 1, RoundingMode.HALF_UP));
        }
        context.put("bodyMeasurementHistoryAvailable", measurements.existsByUserId(user.getId()));
        context.put("recentBodyMeasurements", bodyHistory(user.getId(), today.minusDays(29), today));
        targets.findById(user.getId()).ifPresent(target -> {
            Map<String, Object> values = new LinkedHashMap<>();
            values.put("calories", target.getCalories());
            values.put("proteinGrams", target.getProteinGrams());
            values.put("carbsGrams", target.getCarbsGrams());
            values.put("fatGrams", target.getFatGrams());
            context.put("userSetNutritionTargets", values);
        });
        context.put("recentDiet", dietHistory(user.getId(), today.minusDays(6), today));
        context.put("recentWorkouts", workoutHistory(user.getId(), today.minusDays(30), today, 5));
        return context;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> run(UUID userId, String name, JsonNode arguments) {
        return switch (name) {
            case "get_diet_history" -> dietHistory(userId,
                    date(arguments, "startDate"), date(arguments, "endDate"));
            case "get_workout_history" -> workoutHistory(userId,
                    date(arguments, "startDate"), date(arguments, "endDate"), 60);
            case "get_exercise_history" -> exerciseHistory(userId, arguments);
            case "get_body_history" -> bodyHistory(userId,
                    date(arguments, "startDate"), date(arguments, "endDate"));
            default -> Map.of("error", "Unknown tool");
        };
    }

    private LocalDate date(JsonNode arguments, String field) {
        try {
            return LocalDate.parse(arguments.path(field).asText());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Invalid " + field);
        }
    }

    private void checkRange(LocalDate start, LocalDate end, int maxDays) {
        if (start.isBefore(LocalDate.of(2000, 1, 1)) || end.isAfter(LocalDate.now().plusDays(1))
                || start.isAfter(end) || ChronoUnit.DAYS.between(start, end) >= maxDays) {
            throw new IllegalArgumentException("Date range must be 1 to " + maxDays + " days");
        }
    }

    private Map<String, Object> dietHistory(UUID userId, LocalDate start, LocalDate end) {
        checkRange(start, end, 31);
        Map<LocalDate, DayTotals> days = new LinkedHashMap<>();
        for (MealEntry meal : meals.findByUserIdAndLoggedDateBetweenOrderByLoggedDateAscCreatedAtAsc(
                userId, start, end)) {
            days.computeIfAbsent(meal.getLoggedDate(), ignored -> new DayTotals()).add(meal);
        }
        List<Map<String, Object>> data = days.entrySet().stream().map(entry -> {
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("date", entry.getKey());
            day.put("mealCount", entry.getValue().count);
            day.put("entriesWithCompleteMacros", entry.getValue().completeMacros);
            day.put("calories", entry.getValue().calories);
            day.put("proteinGrams", entry.getValue().protein);
            day.put("carbsGrams", entry.getValue().carbs);
            day.put("fatGrams", entry.getValue().fat);
            day.put("foods", entry.getValue().foods);
            return day;
        }).toList();
        return Map.of("startDate", start, "endDate", end, "loggedDays", data,
                "note", "Days missing from loggedDays have no meal entries; they are not zero-intake days.");
    }

    private Map<String, Object> workoutHistory(UUID userId, LocalDate start, LocalDate end, int limit) {
        checkRange(start, end, 366);
        List<WorkoutSession> found = sessions.findCompletedInRange(userId,
                start.atStartOfDay(), end.plusDays(1).atStartOfDay(), PageRequest.of(0, limit + 1));
        boolean hasMore = found.size() > limit;
        List<Map<String, Object>> data = found.stream().limit(limit).map(session -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", session.getStartTime().toLocalDate());
            item.put("splitDay", session.getSplitDayLabel());
            item.put("totalVolumeKg", session.getTotalVolumeKg());
            item.put("completedSetCount", session.getSets().stream()
                    .filter(set -> Boolean.TRUE.equals(set.getCompleted())).count());
            return item;
        }).toList();
        return Map.of("startDate", start, "endDate", end, "sessions", data, "hasMore", hasMore);
    }

    private Map<String, Object> exerciseHistory(UUID userId, JsonNode arguments) {
        String name = arguments.path("exerciseName").asText("").trim();
        if (name.length() < 2 || name.length() > 100 || name.contains("%") || name.contains("_")) {
            return Map.of("error", "Provide an exercise name of 2 to 100 characters");
        }
        JsonNode pageValue = arguments.path("page");
        if (!pageValue.isInt() || pageValue.intValue() < 0 || pageValue.intValue() > 100) {
            return Map.of("error", "Page must be an integer from 0 to 100");
        }
        int page = pageValue.intValue();
        Page<WorkoutSet> found = sets.findCoachExerciseHistory(userId,
                name.replaceAll("\\s+", ""), PageRequest.of(page, 60));
        List<Map<String, Object>> data = found.stream().map(set -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", set.getSession().getStartTime().toLocalDate());
            item.put("exercise", set.getExerciseName());
            item.put("setNumber", set.getSetNumber());
            item.put("weightKg", set.getWeightKg());
            item.put("reps", set.getReps());
            item.put("rpe", set.getRpe());
            return item;
        }).toList();
        return Map.of("exerciseQuery", name, "page", page, "sets", data,
                "hasMore", found.hasNext(), "totalMatchingSets", found.getTotalElements(),
                "note", "Only completed sets in completed workouts are included. Request the next page when hasMore is true.");
    }

    private Map<String, Object> bodyHistory(UUID userId, LocalDate start, LocalDate end) {
        checkRange(start, end, 366);
        List<Map<String, Object>> data = measurements
                .findByUserIdAndLoggedDateBetweenOrderByLoggedDateAsc(userId, start, end)
                .stream().map(this::measurementData).toList();
        return Map.of("startDate", start, "endDate", end, "measurements", data,
                "note", "Measurements are recorded when profile weight or height is saved. Past values before tracking began are unavailable.");
    }

    private Map<String, Object> measurementData(BodyMeasurement value) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("date", value.getLoggedDate());
        data.put("weightKg", value.getWeightKg());
        data.put("heightCm", value.getHeightCm());
        if (value.getWeightKg() != null && value.getHeightCm() != null && value.getHeightCm() > 0) {
            BigDecimal metres = BigDecimal.valueOf(value.getHeightCm()).movePointLeft(2);
            data.put("bmi", value.getWeightKg().divide(metres.multiply(metres), 1, RoundingMode.HALF_UP));
        }
        return data;
    }

    private static final class DayTotals {
        int count;
        int calories;
        int completeMacros;
        BigDecimal protein = BigDecimal.ZERO;
        BigDecimal carbs = BigDecimal.ZERO;
        BigDecimal fat = BigDecimal.ZERO;
        List<String> foods = new ArrayList<>();

        void add(MealEntry meal) {
            count++;
            calories += meal.getCalories();
            if (meal.getProteinGrams() != null && meal.getCarbsGrams() != null
                    && meal.getFatGrams() != null) completeMacros++;
            protein = protein.add(zero(meal.getProteinGrams()));
            carbs = carbs.add(zero(meal.getCarbsGrams()));
            fat = fat.add(zero(meal.getFatGrams()));
            if (foods.size() < 8) foods.add(meal.getFoodName());
        }

        private BigDecimal zero(BigDecimal number) {
            return number == null ? BigDecimal.ZERO : number;
        }
    }
}
