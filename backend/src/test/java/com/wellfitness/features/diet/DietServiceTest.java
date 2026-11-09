package com.wellfitness.features.diet;

import com.wellfitness.common.exception.ResourceNotFoundException;
import com.wellfitness.features.diet.dto.MealEntryRequest;
import com.wellfitness.features.diet.entity.MealEntry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DietServiceTest {
    @Mock MealEntryRepository mealEntries;
    @Mock NutritionTargetRepository nutritionTargets;
    @InjectMocks DietService dietService;

    @Test
    void totalsOnlyIncludeTheRequestedUsersEntriesForTheDay() {
        UUID userId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 11, 8);
        when(mealEntries.findByUserIdAndLoggedDateOrderByCreatedAtAsc(userId, date)).thenReturn(List.of(
                MealEntry.builder().userId(userId).loggedDate(date).mealType(MealType.BREAKFAST)
                        .foodName("Oats").calories(300).proteinGrams(new BigDecimal("12.5")).build(),
                MealEntry.builder().userId(userId).loggedDate(date).mealType(MealType.LUNCH)
                        .foodName("Rice and dal").calories(450).proteinGrams(new BigDecimal("18.0")).build()
        ));
        when(nutritionTargets.findById(userId)).thenReturn(Optional.empty());

        var day = dietService.getDay(userId, date);

        assertThat(day.entries()).hasSize(2);
        assertThat(day.totals().calories()).isEqualTo(750);
        assertThat(day.totals().proteinGrams()).isEqualByComparingTo("30.5");
        assertThat(day.targets()).isNull();
    }

    @Test
    void cannotEditOrDeleteAnotherUsersMeal() {
        UUID userId = UUID.randomUUID();
        UUID entryId = UUID.randomUUID();
        when(mealEntries.findByIdAndUserId(entryId, userId)).thenReturn(Optional.empty());
        var request = new MealEntryRequest(LocalDate.now(), MealType.SNACK, "Banana", "1 piece", 100,
                null, null, null, null);

        assertThatThrownBy(() -> dietService.updateEntry(userId, entryId, request))
                .isInstanceOf(ResourceNotFoundException.class);
        assertThatThrownBy(() -> dietService.deleteEntry(userId, entryId))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(mealEntries, never()).save(any());
        verify(mealEntries, never()).delete(any());
    }
}
