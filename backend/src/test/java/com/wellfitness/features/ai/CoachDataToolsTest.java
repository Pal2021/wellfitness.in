package com.wellfitness.features.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellfitness.features.diet.MealEntryRepository;
import com.wellfitness.features.diet.MealType;
import com.wellfitness.features.diet.NutritionTargetRepository;
import com.wellfitness.features.diet.entity.MealEntry;
import com.wellfitness.features.profile.BodyMeasurementRepository;
import com.wellfitness.features.workout.WorkoutSessionRepository;
import com.wellfitness.features.workout.WorkoutSetRepository;
import com.wellfitness.features.workout.entity.WorkoutSession;
import com.wellfitness.features.workout.entity.WorkoutSet;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CoachDataToolsTest {
    @Autowired MealEntryRepository meals;
    @Autowired NutritionTargetRepository targets;
    @Autowired WorkoutSessionRepository sessions;
    @Autowired WorkoutSetRepository sets;
    @Autowired BodyMeasurementRepository measurements;

    @Test
    void toolsReturnOnlyAuthenticatedUsersMealsAndExerciseSets() {
        UUID owner = UUID.randomUUID();
        UUID stranger = UUID.randomUUID();
        LocalDate today = LocalDate.now();
        meals.save(MealEntry.builder().userId(owner).loggedDate(today).mealType(MealType.LUNCH)
                .foodName("Rice and dal").calories(450).build());
        meals.save(MealEntry.builder().userId(stranger).loggedDate(today).mealType(MealType.LUNCH)
                .foodName("Private meal").calories(900).build());
        saveSet(owner, "Lat Pulldown", new BigDecimal("50"));
        saveSet(stranger, "Lat Pulldown", new BigDecimal("100"));
        sessions.flush();

        CoachDataTools tools = new CoachDataTools(meals, targets, sessions, sets, measurements);
        var dietArgs = new ObjectMapper().createObjectNode()
                .put("startDate", today.toString()).put("endDate", today.toString());
        Map<String, Object> diet = tools.run(owner, "get_diet_history", dietArgs);
        List<?> days = (List<?>) diet.get("loggedDays");
        assertThat(days).hasSize(1);
        assertThat(((Map<?, ?>) days.get(0)).get("calories")).isEqualTo(450);

        var exerciseArgs = new ObjectMapper().createObjectNode()
                .put("exerciseName", "lat pull down").put("page", 0);
        Map<String, Object> exercise = tools.run(owner, "get_exercise_history", exerciseArgs);
        List<?> loggedSets = (List<?>) exercise.get("sets");
        assertThat(loggedSets).hasSize(1);
        assertThat((BigDecimal) ((Map<?, ?>) loggedSets.get(0)).get("weightKg"))
                .isEqualByComparingTo("50");
    }

    private void saveSet(UUID userId, String name, BigDecimal weight) {
        WorkoutSession session = WorkoutSession.builder().userId(userId).status("COMPLETED").build();
        WorkoutSet set = WorkoutSet.builder().session(session).exerciseId(UUID.randomUUID())
                .exerciseName(name).setNumber(1).weightKg(weight).reps(10).completed(true).build();
        session.getSets().add(set);
        sessions.save(session);
    }
}
