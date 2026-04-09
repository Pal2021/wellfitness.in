package com.wellfitness.features.streak;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.streak.entity.UserStreak;
import com.wellfitness.features.streak.StreakService;
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
