package com.wellfitness.features.exercise;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.exercise.entity.Exercise;
import com.wellfitness.features.exercise.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Exercise>>> getExercises(
            @RequestParam(required = false) String muscle_group,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String search) {
        List<Exercise> exercises = exerciseService.getAllExercises(muscle_group, equipment, search);
        return ResponseEntity.ok(ApiResponse.success(exercises));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Exercise>> getExerciseById(@PathVariable UUID id) {
        Exercise exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(ApiResponse.success(exercise));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Exercise>> createExercise(@RequestBody Exercise exercise) {
        Exercise saved = exerciseService.saveExercise(exercise);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Exercise created"));
    }
}

