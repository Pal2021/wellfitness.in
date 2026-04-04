package com.wellfitness.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellfitness.exception.BadRequestException;
import com.wellfitness.exception.ResourceNotFoundException;
import com.wellfitness.model.*;
import com.wellfitness.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SplitService {

    private final UserSplitRepository userSplitRepository;
    private final SplitDayRepository splitDayRepository;
    private final SplitDayExerciseRepository splitDayExerciseRepository;
    private final SplitTemplateRepository splitTemplateRepository;
    private final SplitTemplateDayRepository splitTemplateDayRepository;
    private final ExerciseRepository exerciseRepository;
    private final ObjectMapper objectMapper;

    /**
     * Deep-copy a template into a personalized user split.
     * Resolves exercise names to UUIDs from the exercise table.
     */
    @Transactional
    public UserSplit createFromTemplate(UUID userId, UUID templateId) {
        SplitTemplate template = splitTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("SplitTemplate", "id", templateId));

        // Deactivate any existing active split
        userSplitRepository.findByUserIdAndIsActiveTrue(userId)
                .ifPresent(existing -> {
                    existing.setIsActive(false);
                    userSplitRepository.save(existing);
                });

        // Create new user split
        UserSplit userSplit = UserSplit.builder()
                .userId(userId)
                .templateId(templateId)
                .name(template.getName())
                .isActive(true)
                .build();

        userSplit = userSplitRepository.save(userSplit);

        // Copy template days and exercises
        List<SplitTemplateDay> templateDays =
                splitTemplateDayRepository.findByTemplateIdOrderByDisplayOrder(templateId);

        for (SplitTemplateDay templateDay : templateDays) {
            SplitDay splitDay = SplitDay.builder()
                    .split(userSplit)
                    .dayOfWeek(templateDay.getDayOfWeek())
                    .label(templateDay.getLabel())
                    .isRestDay(templateDay.getIsRestDay())
                    .displayOrder(templateDay.getDisplayOrder())
                    .build();

            splitDay = splitDayRepository.save(splitDay);

            // Parse exercise JSON from template day and create SplitDayExercise entries
            if (!templateDay.getIsRestDay() && templateDay.getExercises() != null
                    && !templateDay.getExercises().equals("[]")) {
                try {
                    List<Map<String, Object>> exerciseList =
                            objectMapper.readValue(templateDay.getExercises(),
                                    new TypeReference<List<Map<String, Object>>>() {});

                    int order = 1;
                    StringBuilder muscleGroups = new StringBuilder();

                    for (Map<String, Object> exData : exerciseList) {
                        String exerciseName = (String) exData.get("name");
                        int sets = (Integer) exData.get("sets");
                        int reps = (Integer) exData.get("reps");

                        exerciseRepository.findByNameIgnoreCase(exerciseName).ifPresent(exercise -> {
                            if (!muscleGroups.toString().contains(exercise.getMuscleGroup())) {
                                if (muscleGroups.length() > 0) muscleGroups.append(", ");
                                muscleGroups.append(exercise.getMuscleGroup());
                            }
                        });

                        UUID exerciseId = exerciseRepository.findByNameIgnoreCase(exerciseName)
                                .map(Exercise::getId)
                                .orElse(null);

                        if (exerciseId != null) {
                            SplitDayExercise sde = SplitDayExercise.builder()
                                    .splitDay(splitDay)
                                    .exerciseId(exerciseId)
                                    .exerciseName(exerciseName)
                                    .displayOrder(order++)
                                    .defaultSets(sets)
                                    .defaultReps(reps)
                                    .build();
                            splitDayExerciseRepository.save(sde);
                        } else {
                            log.warn("Exercise not found during template copy: {}", exerciseName);
                        }
                    }

                    splitDay.setMuscleGroups(muscleGroups.toString());
                    splitDayRepository.save(splitDay);

                } catch (Exception e) {
                    log.error("Error parsing exercises for template day {}: {}",
                            templateDay.getLabel(), e.getMessage());
                }
            }

            userSplit.getDays().add(splitDay);
        }

        log.info("Created user split '{}' for user {}", userSplit.getName(), userId);
        return userSplit;
    }

    public UserSplit getActiveSplit(UUID userId) {
        return userSplitRepository.findByUserIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No active split found for user"));
    }

    public SplitDay getSplitDay(UUID dayId) {
        return splitDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("SplitDay", "id", dayId));
    }

    @Transactional
    public SplitDay updateDay(UUID splitId, UUID dayId, String label, Boolean isRestDay) {
        SplitDay day = splitDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("SplitDay", "id", dayId));

        if (label != null) day.setLabel(label);
        if (isRestDay != null) day.setIsRestDay(isRestDay);

        return splitDayRepository.save(day);
    }

    @Transactional
    public SplitDayExercise addExerciseToDay(UUID splitId, UUID dayId, UUID exerciseId) {
        SplitDay day = splitDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("SplitDay", "id", dayId));

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", exerciseId));

        int nextOrder = day.getExercises().size() + 1;

        SplitDayExercise sde = SplitDayExercise.builder()
                .splitDay(day)
                .exerciseId(exerciseId)
                .exerciseName(exercise.getName())
                .displayOrder(nextOrder)
                .defaultSets(3)
                .defaultReps(10)
                .build();

        return splitDayExerciseRepository.save(sde);
    }

    @Transactional
    public void removeExerciseFromDay(UUID splitId, UUID dayId, UUID exerciseId) {
        SplitDay day = splitDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("SplitDay", "id", dayId));

        day.getExercises().removeIf(sde -> sde.getExerciseId().equals(exerciseId));
        splitDayRepository.save(day);
    }
}
