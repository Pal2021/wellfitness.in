package com.wellfitness.service;

import com.wellfitness.common.exception.ResourceNotFoundException;
import com.wellfitness.features.exercise.entity.Exercise;
import com.wellfitness.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getAllExercises(String muscleGroup, String equipment, String search) {
        return exerciseRepository.findFiltered(muscleGroup, equipment, search);
    }

    public Exercise getExerciseById(UUID id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "id", id));
    }

    public Exercise getExerciseByName(String name) {
        return exerciseRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", "name", name));
    }

    public Exercise saveExercise(Exercise exercise) {
        log.info("Creating custom exercise: {}", exercise.getName());
        return exerciseRepository.save(exercise);
    }
}
