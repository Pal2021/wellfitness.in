package com.wellfitness.controller;

import com.wellfitness.dto.response.ApiResponse;
import com.wellfitness.model.User;
import com.wellfitness.model.UserStreak;
import com.wellfitness.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserStreak>> getStreak(
            @AuthenticationPrincipal User user) {
        UserStreak streak = streakService.getStreak(user.getId());
        return ResponseEntity.ok(ApiResponse.success(streak));
    }
}
