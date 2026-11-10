package com.wellfitness.features.profile;

import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.profile.entity.BodyMeasurement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BodyMeasurementService {
    private final BodyMeasurementRepository measurements;

    public void recordToday(User user) {
        if (user.getBodyweightKg() == null && user.getHeightCm() == null) return;
        LocalDate today = LocalDate.now();
        BodyMeasurement measurement = measurements.findByUserIdAndLoggedDate(user.getId(), today)
                .orElseGet(BodyMeasurement::new);
        measurement.setUserId(user.getId());
        measurement.setLoggedDate(today);
        measurement.setWeightKg(user.getBodyweightKg());
        measurement.setHeightCm(user.getHeightCm());
        measurements.save(measurement);
    }
}
