package com.wellfitness.features.profile;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(
            @AuthenticationPrincipal User user) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("goal", user.getGoal() != null ? user.getGoal() : "");
        profile.put("experience", user.getExperience() != null ? user.getExperience() : "");
        profile.put("bodyweightKg", user.getBodyweightKg() != null ? user.getBodyweightKg() : "");
        profile.put("heightCm", user.getHeightCm() != null ? user.getHeightCm() : "");
        profile.put("daysPerWeek", user.getDaysPerWeek() != null ? user.getDaysPerWeek() : 0);
        profile.put("onboardingComplete", user.getOnboardingComplete());
        profile.put("notificationTime", user.getNotificationTime() != null ? user.getNotificationTime() : "");
        profile.put("unitsWeight", user.getUnitsWeight());
        profile.put("unitsHeight", user.getUnitsHeight());
        profile.put("profilePhotoUrl", user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() : "");
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<ApiResponse<String>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> updates) {

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("goal")) user.setGoal((String) updates.get("goal"));
        if (updates.containsKey("experience")) user.setExperience((String) updates.get("experience"));
        if (updates.containsKey("bodyweightKg"))
            user.setBodyweightKg(new BigDecimal(updates.get("bodyweightKg").toString()));
        if (updates.containsKey("heightCm"))
            user.setHeightCm(Integer.parseInt(updates.get("heightCm").toString()));
        if (updates.containsKey("daysPerWeek"))
            user.setDaysPerWeek(Integer.parseInt(updates.get("daysPerWeek").toString()));
        if (updates.containsKey("notificationTime"))
            user.setNotificationTime((String) updates.get("notificationTime"));
        if (updates.containsKey("unitsWeight")) user.setUnitsWeight((String) updates.get("unitsWeight"));
        if (updates.containsKey("unitsHeight")) user.setUnitsHeight((String) updates.get("unitsHeight"));

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", "Profile updated successfully"));
    }
}
