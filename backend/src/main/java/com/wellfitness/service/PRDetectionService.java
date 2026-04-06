package com.wellfitness.service;

import com.wellfitness.features.pr.entity.PersonalRecord;
import com.wellfitness.repository.PersonalRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * RULE 2 — PR Detection using Brzycki Formula.
 * estimated_1rm = weight / (1.0278 - 0.0278 × reps)
 * If new_1rm > best_previous → isPR = true.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PRDetectionService {

    private final PersonalRecordRepository personalRecordRepository;

    /**
     * Calculate estimated 1RM using Brzycki formula and check if it's a new PR.
     * Returns true if a new PR was set.
     */
    @Transactional
    public boolean checkAndUpdatePR(UUID userId, UUID exerciseId, String exerciseName,
                                    BigDecimal weightKg, int reps, UUID sessionId) {
        if (reps <= 0 || weightKg.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        // Brzycki Formula: estimated_1rm = weight / (1.0278 - 0.0278 × reps)
        BigDecimal denominator = BigDecimal.valueOf(1.0278)
                .subtract(BigDecimal.valueOf(0.0278).multiply(BigDecimal.valueOf(reps)));

        // Avoid division by zero or negative (happens when reps > 37)
        if (denominator.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        BigDecimal estimated1rm = weightKg.divide(denominator, 2, RoundingMode.HALF_UP);

        Optional<PersonalRecord> existingPR =
                personalRecordRepository.findByUserIdAndExerciseId(userId, exerciseId);

        if (existingPR.isPresent()) {
            PersonalRecord pr = existingPR.get();
            if (estimated1rm.compareTo(pr.getEstimated1rm()) > 0) {
                // New PR — update existing record
                pr.setWeightKg(weightKg);
                pr.setReps(reps);
                pr.setEstimated1rm(estimated1rm);
                pr.setAchievedAt(LocalDateTime.now());
                pr.setSessionId(sessionId);
                personalRecordRepository.save(pr);
                log.info("New PR for user {} on {}: {}kg × {} (1RM: {}kg)",
                        userId, exerciseName, weightKg, reps, estimated1rm);
                return true;
            }
            return false;
        } else {
            // First time — create new record (this is always a PR)
            PersonalRecord pr = PersonalRecord.builder()
                    .userId(userId)
                    .exerciseId(exerciseId)
                    .exerciseName(exerciseName)
                    .weightKg(weightKg)
                    .reps(reps)
                    .estimated1rm(estimated1rm)
                    .achievedAt(LocalDateTime.now())
                    .sessionId(sessionId)
                    .build();
            personalRecordRepository.save(pr);
            log.info("First PR for user {} on {}: {}kg × {} (1RM: {}kg)",
                    userId, exerciseName, weightKg, reps, estimated1rm);
            return true;
        }
    }
}
