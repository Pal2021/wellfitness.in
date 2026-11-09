package com.wellfitness.features.diet;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.diet.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {
    private final DietService dietService;
    private final MealSuggestionService suggestionService;
    private final NutritionEstimateClient nutritionEstimateClient;

    @PostMapping("/nutrition-estimate")
    public ResponseEntity<ApiResponse<NutritionValues>> estimateNutrition(
            @AuthenticationPrincipal User user, @Valid @RequestBody NutritionEstimateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(nutritionEstimateClient.estimate(request)));
    }

    @ExceptionHandler(NutritionEstimateUnavailableException.class)
    public ResponseEntity<ApiResponse<Void>> handleEstimateUnavailable(NutritionEstimateUnavailableException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("AI_UNAVAILABLE", ex.getMessage()));
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidBody() {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", "Invalid diet request body."));
    }

    @GetMapping("/day")
    public ResponseEntity<ApiResponse<DietDayResponse>> getDay(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(dietService.getDay(user.getId(), date)));
    }

    @PostMapping("/entries")
    public ResponseEntity<ApiResponse<MealEntryResponse>> addEntry(
            @AuthenticationPrincipal User user, @Valid @RequestBody MealEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dietService.addEntry(user.getId(), request), "Meal saved"));
    }

    @PutMapping("/entries/{entryId}")
    public ResponseEntity<ApiResponse<MealEntryResponse>> updateEntry(
            @AuthenticationPrincipal User user, @PathVariable UUID entryId,
            @Valid @RequestBody MealEntryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(dietService.updateEntry(user.getId(), entryId, request)));
    }

    @DeleteMapping("/entries/{entryId}")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(
            @AuthenticationPrincipal User user, @PathVariable UUID entryId) {
        dietService.deleteEntry(user.getId(), entryId);
        return ResponseEntity.ok(ApiResponse.success(null, "Meal deleted"));
    }

    @PutMapping("/targets")
    public ResponseEntity<ApiResponse<NutritionValues>> saveTargets(
            @AuthenticationPrincipal User user, @Valid @RequestBody NutritionTargetRequest request) {
        return ResponseEntity.ok(ApiResponse.success(dietService.saveTargets(user.getId(), request)));
    }

    @PostMapping("/suggestions")
    public ResponseEntity<ApiResponse<java.util.List<MealIdea>>> suggestMeals(
            @AuthenticationPrincipal User user, @Valid @RequestBody MealSuggestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                suggestionService.suggest(user.getId(), user.getGoal(), request)));
    }
}
