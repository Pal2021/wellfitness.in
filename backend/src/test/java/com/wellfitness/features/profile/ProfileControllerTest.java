package com.wellfitness.features.profile;

import com.wellfitness.common.exception.BadRequestException;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.features.auth.entity.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class ProfileControllerTest {

    private final UserRepository repository = mock(UserRepository.class);
    private final BodyMeasurementService measurements = mock(BodyMeasurementService.class);
    private final ProfileController controller = new ProfileController(repository, measurements);

    @Test
    void updatesReturnTheSavedProfileAndPreserveMetricMeasurements() {
        User user = User.builder().name("Old Name").email("member@example.com").unitsWeight("KG").unitsHeight("CM").build();

        var response = controller.updateProfile(user, Map.of(
                "name", "  New Name  ",
                "bodyweightKg", 82.45,
                "heightCm", 180,
                "unitsWeight", "LB",
                "unitsHeight", "IN",
                "profilePhotoUrl", "https://example.com/photo.jpg"
        ));

        verify(repository).save(user);
        verify(measurements).recordToday(user);
        assertThat(user.getBodyweightKg()).isEqualByComparingTo(new BigDecimal("82.45"));
        assertThat(response.getBody().getData()).containsEntry("name", "New Name")
                .containsEntry("unitsWeight", "LB")
                .containsEntry("unitsHeight", "IN")
                .containsEntry("profilePhotoUrl", "https://example.com/photo.jpg");
    }

    @Test
    void rejectsInvalidPreferenceValues() {
        User user = User.builder().name("Member").email("member@example.com").build();

        assertThatThrownBy(() -> controller.updateProfile(user, Map.of("notificationTime", "25:70")))
                .isInstanceOf(BadRequestException.class);
        assertThatThrownBy(() -> controller.updateProfile(user, Map.of("daysPerWeek", 9)))
                .isInstanceOf(BadRequestException.class);
        assertThatThrownBy(() -> controller.updateProfile(user, Map.of("bodyweightKg", "abc")))
                .isInstanceOf(BadRequestException.class);
    }
}
