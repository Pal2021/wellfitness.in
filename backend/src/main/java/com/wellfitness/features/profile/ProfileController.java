package com.wellfitness.features.profile;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.common.exception.BadRequestException;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final BodyMeasurementService bodyMeasurements;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(toProfile(user)));
    }

    private Map<String, Object> toProfile(User user) {
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
        return profile;
    }

    @PutMapping
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> updates) {

        if (updates.containsKey("name")) {
            String name = text(updates, "name").trim();
            if (name.isEmpty() || name.length() > 100) throw new BadRequestException("Name must be 1 to 100 characters");
            user.setName(name);
        }
        if (updates.containsKey("goal")) {
            String goal = text(updates, "goal");
            if (!Set.of("LOSE_WEIGHT", "GAIN_WEIGHT", "BUILD_MUSCLE", "GET_STRONGER", "STAY_FIT").contains(goal))
                throw new BadRequestException("Choose a valid fitness goal");
            user.setGoal(goal);
        }
        if (updates.containsKey("experience")) {
            String experience = text(updates, "experience");
            if (!Set.of("BEGINNER", "INTERMEDIATE", "ADVANCED").contains(experience))
                throw new BadRequestException("Choose a valid experience level");
            user.setExperience(experience);
        }
        if (updates.containsKey("bodyweightKg")) {
            try {
                Object rawWeight = updates.get("bodyweightKg");
                if (!(rawWeight instanceof Number) && !(rawWeight instanceof String))
                    throw new BadRequestException("Enter a valid body weight");
                BigDecimal weight = new BigDecimal(rawWeight.toString());
                if (weight.compareTo(BigDecimal.valueOf(20)) < 0 || weight.compareTo(BigDecimal.valueOf(500)) > 0 || weight.scale() > 2)
                    throw new BadRequestException("Weight must be 20 to 500 kg with at most two decimal places");
                user.setBodyweightKg(weight);
            } catch (NumberFormatException ex) {
                throw new BadRequestException("Enter a valid body weight");
            }
        }
        if (updates.containsKey("heightCm")) {
            int height = integer(updates, "heightCm");
            if (height < 80 || height > 250) throw new BadRequestException("Height must be 80 to 250 cm");
            user.setHeightCm(height);
        }
        if (updates.containsKey("daysPerWeek")) {
            int days = integer(updates, "daysPerWeek");
            if (days < 1 || days > 7) throw new BadRequestException("Training days must be 1 to 7");
            user.setDaysPerWeek(days);
        }
        if (updates.containsKey("notificationTime")) {
            String time = text(updates, "notificationTime");
            if (!time.isBlank()) {
                if (!time.matches("\\d{2}:\\d{2}")) throw new BadRequestException("Use a valid time in HH:mm format");
                try {
                    LocalTime.parse(time);
                } catch (DateTimeParseException ex) {
                    throw new BadRequestException("Use a valid time in HH:mm format");
                }
            }
            user.setNotificationTime(time);
        }
        if (updates.containsKey("unitsWeight")) {
            String units = text(updates, "unitsWeight");
            if (!Set.of("KG", "LB").contains(units)) throw new BadRequestException("Weight units must be KG or LB");
            user.setUnitsWeight(units);
        }
        if (updates.containsKey("unitsHeight")) {
            String units = text(updates, "unitsHeight");
            if (!Set.of("CM", "IN").contains(units)) throw new BadRequestException("Height units must be CM or IN");
            user.setUnitsHeight(units);
        }
        if (updates.containsKey("profilePhotoUrl")) {
            String url = text(updates, "profilePhotoUrl").trim();
            if (url.length() > 500 || (!url.isEmpty() && !url.matches("https?://[^\\s]+")))
                throw new BadRequestException("Photo URL must be a valid http or https link under 500 characters");
            user.setProfilePhotoUrl(url);
        }

        userRepository.save(user);
        if (updates.containsKey("bodyweightKg") || updates.containsKey("heightCm")) {
            bodyMeasurements.recordToday(user);
        }
        return ResponseEntity.ok(ApiResponse.success(toProfile(user), "Profile updated successfully"));
    }

    private String text(Map<String, Object> updates, String field) {
        Object value = updates.get(field);
        if (!(value instanceof String)) throw new BadRequestException("Invalid " + field);
        return (String) value;
    }

    private int integer(Map<String, Object> updates, String field) {
        try {
            return Integer.parseInt(updates.get(field).toString());
        } catch (NullPointerException | NumberFormatException ex) {
            throw new BadRequestException("Invalid " + field);
        }
    }
}
