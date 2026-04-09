package com.wellfitness.features.split;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.split.entity.SplitDay;
import com.wellfitness.features.split.entity.SplitDayExercise;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.split.entity.UserSplit;
import com.wellfitness.features.split.SplitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/splits")
@RequiredArgsConstructor
public class SplitController {

    private final SplitService splitService;

    @PostMapping("/from-template")
    public ResponseEntity<ApiResponse<UserSplit>> createFromTemplate(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        UUID templateId = UUID.fromString(body.get("templateId"));
        UserSplit split = splitService.createFromTemplate(user.getId(), templateId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(split, "Split created from template"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<UserSplit>> getActiveSplit(
            @AuthenticationPrincipal User user) {
        UserSplit split = splitService.getActiveSplit(user.getId());
        return ResponseEntity.ok(ApiResponse.success(split));
    }

    @PutMapping("/{splitId}/days/{dayId}")
    public ResponseEntity<ApiResponse<SplitDay>> updateDay(
            @PathVariable UUID splitId,
            @PathVariable UUID dayId,
            @RequestBody Map<String, Object> body) {
        String label = (String) body.get("label");
        Boolean isRestDay = body.containsKey("isRestDay") ? (Boolean) body.get("isRestDay") : null;
        SplitDay day = splitService.updateDay(splitId, dayId, label, isRestDay);
        return ResponseEntity.ok(ApiResponse.success(day, "Day updated"));
    }

    @PostMapping("/{splitId}/days/{dayId}/exercises/{exerciseId}")
    public ResponseEntity<ApiResponse<SplitDayExercise>> addExercise(
            @PathVariable UUID splitId,
            @PathVariable UUID dayId,
            @PathVariable UUID exerciseId) {
        SplitDayExercise sde = splitService.addExerciseToDay(splitId, dayId, exerciseId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(sde, "Exercise added to day"));
    }

    @DeleteMapping("/{splitId}/days/{dayId}/exercises/{exerciseId}")
    public ResponseEntity<ApiResponse<Void>> removeExercise(
            @PathVariable UUID splitId,
            @PathVariable UUID dayId,
            @PathVariable UUID exerciseId) {
        splitService.removeExerciseFromDay(splitId, dayId, exerciseId);
        return ResponseEntity.ok(ApiResponse.success(null, "Exercise removed from day"));
    }
}
