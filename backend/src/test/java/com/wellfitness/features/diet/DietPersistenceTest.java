package com.wellfitness.features.diet;

import com.wellfitness.features.diet.dto.MealEntryRequest;
import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class DietPersistenceTest {
    @Autowired MealEntryRepository mealEntries;
    @Autowired NutritionTargetRepository nutritionTargets;
    @Autowired EntityManager entityManager;

    @Test
    void manualNutritionAndRemarksPersistAcrossSaveEditAndClearWithoutAi() {
        DietService service = new DietService(mealEntries, nutritionTargets);
        UUID owner = UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 11, 8);
        var manual = new MealEntryRequest(date, MealType.LUNCH, " Dal ", " 1 bowl ", 420,
                new BigDecimal("20.1"), new BigDecimal("55.0"), new BigDecimal("12.0"), "  100g lentils, 5g oil  ");
        var saved = service.addEntry(owner, manual);
        entityManager.flush();
        entityManager.clear();

        var loaded = service.getDay(owner, date).entries().get(0);
        assertThat(loaded.remarks()).isEqualTo("100g lentils, 5g oil");
        assertThat(loaded.foodName()).isEqualTo("Dal");
        assertThat(loaded.serving()).isEqualTo("1 bowl");
        assertThat(loaded.calories()).isEqualTo(420);
        assertThat(loaded.proteinGrams()).isEqualByComparingTo("20.1");
        assertThat(loaded.carbsGrams()).isEqualByComparingTo("55.0");
        assertThat(loaded.fatGrams()).isEqualByComparingTo("12.0");

        String remarks = "x".repeat(1000);
        var edit = new MealEntryRequest(date, MealType.DINNER, "Dal and rice", "2 bowls", 700,
                new BigDecimal("30.5"), new BigDecimal("90.0"), new BigDecimal("20.0"), remarks);
        assertThat(service.updateEntry(owner, saved.id(), edit).remarks()).isEqualTo(remarks);
        entityManager.flush();
        entityManager.clear();
        loaded = service.getDay(owner, date).entries().get(0);
        assertThat(loaded.id()).isEqualTo(saved.id());
        assertThat(loaded.remarks()).isEqualTo(remarks);
        assertThat(loaded.calories()).isEqualTo(700);
        assertThat(loaded.proteinGrams()).isEqualByComparingTo("30.5");
        assertThat(loaded.carbsGrams()).isEqualByComparingTo("90.0");
        assertThat(loaded.fatGrams()).isEqualByComparingTo("20.0");
        assertThat(service.getDay(UUID.randomUUID(), date).entries()).isEmpty();

        for (String cleared : new String[]{"", null}) {
            service.updateEntry(owner, saved.id(), new MealEntryRequest(date, MealType.DINNER, "Dal", null, 0,
                    null, null, null, cleared));
            entityManager.flush();
            entityManager.clear();
            loaded = service.getDay(owner, date).entries().get(0);
            assertThat(loaded.remarks()).isEqualTo(cleared);
            assertThat(loaded.calories()).isZero();
            assertThat(loaded.proteinGrams()).isNull();
        }
    }

    @Test
    void mealDiaryPersistsAndStaysSeparatedByUserAndDate() {
        DietService service = new DietService(mealEntries, nutritionTargets);
        UUID owner = UUID.randomUUID();
        UUID anotherUser = UUID.randomUUID();
        LocalDate today = LocalDate.of(2026, 11, 8);
        var request = new MealEntryRequest(today, MealType.LUNCH, "Dal and rice", "1 bowl", 420,
                null, null, null, null);

        var saved = service.addEntry(owner, request);
        mealEntries.flush();

        assertThat(service.getDay(owner, today).entries()).hasSize(1);
        assertThat(service.getDay(owner, today).totals().calories()).isEqualTo(420);
        assertThat(service.getDay(anotherUser, today).entries()).isEmpty();
        assertThat(service.getDay(owner, today.minusDays(1)).entries()).isEmpty();

        service.deleteEntry(owner, saved.id());
        mealEntries.flush();
        assertThat(service.getDay(owner, today).entries()).isEmpty();
    }
}
