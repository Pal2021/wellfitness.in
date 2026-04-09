package com.wellfitness.features.onboarding;

import com.wellfitness.features.onboarding.dto.OnboardingRequest;
import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.split.entity.UserSplit;
import com.wellfitness.features.streak.entity.UserStreak;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.features.streak.UserStreakRepository;
import com.wellfitness.features.split.SplitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final UserRepository userRepository;
    private final SplitService splitService;
    private final UserStreakRepository userStreakRepository;

    @PostMapping("/complete")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeOnboarding(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OnboardingRequest request) {

        // Update user profile data
        if (request.getGoal() != null) user.setGoal(request.getGoal());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
        if (request.getDaysPerWeek() != null) user.setDaysPerWeek(request.getDaysPerWeek());
        if (request.getNotificationTime() != null) user.setNotificationTime(request.getNotificationTime());
        user.setOnboardingComplete(true);
        userRepository.save(user);

        // Create user split from selected template
        UserSplit split = splitService.createFromTemplate(user.getId(), request.getTemplateId());

        // Initialize streak record
        if (!userStreakRepository.existsByUserId(user.getId())) {
            UserStreak streak = UserStreak.builder()
                    .userId(user.getId())
                    .currentStreak(0)
                    .longestStreak(0)
                    .streakFreezes(1)
                    .build();
            userStreakRepository.save(streak);
        }

        return ResponseEntity.ok(ApiResponse.success(
                Map.of("onboardingComplete", true, "splitName", split.getName()),
                "Onboarding completed successfully"
        ));
    }
}
