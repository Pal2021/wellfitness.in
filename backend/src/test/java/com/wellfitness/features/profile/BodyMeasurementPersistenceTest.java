package com.wellfitness.features.profile;

import com.wellfitness.features.auth.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BodyMeasurementPersistenceTest {
    @Autowired BodyMeasurementRepository measurements;

    @Test
    void recordsOneMeasurementPerDayAndKeepsUsersSeparated() {
        UUID owner = UUID.randomUUID();
        User user = User.builder().id(owner).bodyweightKg(new BigDecimal("80.0"))
                .heightCm(175).build();
        BodyMeasurementService service = new BodyMeasurementService(measurements);

        service.recordToday(user);
        user.setBodyweightKg(new BigDecimal("79.5"));
        service.recordToday(user);
        measurements.flush();

        var mine = measurements.findByUserIdAndLoggedDateBetweenOrderByLoggedDateAsc(
                owner, LocalDate.now().minusDays(1), LocalDate.now());
        assertThat(mine).hasSize(1);
        assertThat(mine.get(0).getWeightKg()).isEqualByComparingTo("79.5");
        assertThat(mine.get(0).getHeightCm()).isEqualTo(175);
        assertThat(measurements.existsByUserId(UUID.randomUUID())).isFalse();
    }
}
