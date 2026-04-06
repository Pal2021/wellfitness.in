package com.wellfitness.service;

import com.wellfitness.features.streak.entity.UserStreak;
import com.wellfitness.repository.UserStreakRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * RULE 3 — Streak Tracker.
 * On session COMPLETED:
 *   yesterday → streak + 1
 *   today → no change
 *   older → reset to 1
 * Tracks longest streak separately.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserStreakRepository userStreakRepository;

    @Transactional
    public UserStreak updateStreakOnWorkoutComplete(UUID userId) {
        UserStreak streak = userStreakRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserStreak newStreak = UserStreak.builder()
                            .userId(userId)
                            .currentStreak(0)
                            .longestStreak(0)
                            .streakFreezes(1)
                            .build();
                    return userStreakRepository.save(newStreak);
                });

        LocalDate today = LocalDate.now();
        LocalDate lastWorkout = streak.getLastWorkoutDate();

        if (lastWorkout == null) {
            // First workout ever
            streak.setCurrentStreak(1);
        } else if (lastWorkout.equals(today)) {
            // Already worked out today — no change
            return streak;
        } else if (lastWorkout.equals(today.minusDays(1))) {
            // Worked out yesterday — streak continues
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        } else {
            // Missed days — reset streak
            streak.setCurrentStreak(1);
        }

        // Update longest streak if current exceeds it
        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        streak.setLastWorkoutDate(today);
        streak.setUpdatedAt(LocalDateTime.now());

        log.info("Updated streak for user {}: current={}, longest={}",
                userId, streak.getCurrentStreak(), streak.getLongestStreak());

        return userStreakRepository.save(streak);
    }

    public UserStreak getStreak(UUID userId) {
        return userStreakRepository.findByUserId(userId)
                .orElseGet(() -> UserStreak.builder()
                        .userId(userId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .streakFreezes(1)
                        .build());
    }
}
