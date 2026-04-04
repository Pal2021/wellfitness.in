package com.wellfitness.controller;

import com.wellfitness.dto.request.LogSetRequest;
import com.wellfitness.dto.response.ApiResponse;
import com.wellfitness.dto.response.PagedResponse;
import com.wellfitness.dto.response.SetLogResponse;
import com.wellfitness.model.User;
import com.wellfitness.model.WorkoutSession;
import com.wellfitness.model.WorkoutSet;
import com.wellfitness.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<WorkoutSession>> startSession(
            @AuthenticationPrincipal User user,
            @RequestBody(required = false) Map<String, String> body) {
        UUID splitDayId = null;
        if (body != null && body.containsKey("splitDayId")) {
            splitDayId = UUID.fromString(body.get("splitDayId"));
        }
        WorkoutSession session = workoutService.startSession(user.getId(), splitDayId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(session, "Workout started"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<WorkoutSession>> getActiveSession(
            @AuthenticationPrincipal User user) {
        WorkoutSession session = workoutService.getActiveSession(user.getId());
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @PostMapping("/{sessionId}/sets")
    public ResponseEntity<ApiResponse<SetLogResponse>> logSet(
            @AuthenticationPrincipal User user,
            @PathVariable UUID sessionId,
            @Valid @RequestBody LogSetRequest request) {
        SetLogResponse response = workoutService.logSet(user.getId(), sessionId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, response.isPr() ? "New PR! 🏆" : "Set logged"));
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<ApiResponse<WorkoutSession>> endSession(
            @AuthenticationPrincipal User user,
            @PathVariable UUID sessionId) {
        WorkoutSession session = workoutService.endSession(user.getId(), sessionId);
        return ResponseEntity.ok(ApiResponse.success(session, "Workout completed! 💪"));
    }

    @GetMapping("/history")
    public ResponseEntity<PagedResponse<WorkoutSession>> getHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<WorkoutSession> pageResult = workoutService.getHistory(user.getId(), page, size);
        return ResponseEntity.ok(PagedResponse.of(
                pageResult.getContent(), page, size, pageResult.getTotalElements()));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<WorkoutSession>> getSession(
            @PathVariable UUID sessionId) {
        WorkoutSession session = workoutService.getSessionById(sessionId);
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @GetMapping("/{sessionId}/sets")
    public ResponseEntity<ApiResponse<List<WorkoutSet>>> getSessionSets(
            @PathVariable UUID sessionId) {
        List<WorkoutSet> sets = workoutService.getSessionSets(sessionId);
        return ResponseEntity.ok(ApiResponse.success(sets));
    }

    @GetMapping("/exercise-history/{exerciseId}")
    public ResponseEntity<ApiResponse<List<WorkoutSet>>> getExerciseHistory(
            @AuthenticationPrincipal User user,
            @PathVariable UUID exerciseId) {
        List<WorkoutSet> sets = workoutService.getExerciseHistory(user.getId(), exerciseId);
        return ResponseEntity.ok(ApiResponse.success(sets));
    }
}
