package com.wellfitness.features.diet;

import com.wellfitness.common.exception.ResourceNotFoundException;
import com.wellfitness.features.diet.dto.*;
import com.wellfitness.features.diet.entity.MealEntry;
import com.wellfitness.features.diet.entity.NutritionTarget;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DietService {
    private final MealEntryRepository mealEntries;
    private final NutritionTargetRepository nutritionTargets;

    @Transactional(readOnly = true)
    public DietDayResponse getDay(UUID userId, LocalDate date) {
        List<MealEntryResponse> entries = mealEntries.findByUserIdAndLoggedDateOrderByCreatedAtAsc(userId, date)
                .stream().map(this::toResponse).toList();
        NutritionValues totals = new NutritionValues(
                entries.stream().mapToInt(MealEntryResponse::calories).sum(),
                sum(entries.stream().map(MealEntryResponse::proteinGrams).toList()),
                sum(entries.stream().map(MealEntryResponse::carbsGrams).toList()),
                sum(entries.stream().map(MealEntryResponse::fatGrams).toList())
        );
        NutritionValues targets = nutritionTargets.findById(userId)
                .map(this::toValues).orElse(null);
        return new DietDayResponse(date, entries, totals, targets);
    }

    @Transactional
    public MealEntryResponse addEntry(UUID userId, MealEntryRequest request) {
        MealEntry entry = new MealEntry();
        entry.setUserId(userId);
        apply(request, entry);
        return toResponse(mealEntries.save(entry));
    }

    @Transactional
    public MealEntryResponse updateEntry(UUID userId, UUID entryId, MealEntryRequest request) {
        MealEntry entry = ownedEntry(userId, entryId);
        apply(request, entry);
        return toResponse(mealEntries.save(entry));
    }

    @Transactional
    public void deleteEntry(UUID userId, UUID entryId) {
        mealEntries.delete(ownedEntry(userId, entryId));
    }

    @Transactional
    public NutritionValues saveTargets(UUID userId, NutritionTargetRequest request) {
        if (request.calories() == null && request.proteinGrams() == null
                && request.carbsGrams() == null && request.fatGrams() == null) {
            nutritionTargets.findById(userId).ifPresent(nutritionTargets::delete);
            return null;
        }
        NutritionTarget target = nutritionTargets.findById(userId)
                .orElseGet(() -> NutritionTarget.builder().userId(userId).build());
        target.setCalories(request.calories());
        target.setProteinGrams(request.proteinGrams());
        target.setCarbsGrams(request.carbsGrams());
        target.setFatGrams(request.fatGrams());
        return toValues(nutritionTargets.save(target));
    }

    private MealEntry ownedEntry(UUID userId, UUID entryId) {
        return mealEntries.findByIdAndUserId(entryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal entry not found"));
    }

    private void apply(MealEntryRequest request, MealEntry entry) {
        entry.setLoggedDate(request.loggedDate());
        entry.setMealType(request.mealType());
        entry.setFoodName(request.foodName().trim());
        entry.setServing(request.serving() == null ? null : request.serving().trim());
        entry.setRemarks(request.remarks() == null ? null : request.remarks().trim());
        entry.setCalories(request.calories());
        entry.setProteinGrams(request.proteinGrams());
        entry.setCarbsGrams(request.carbsGrams());
        entry.setFatGrams(request.fatGrams());
    }

    private MealEntryResponse toResponse(MealEntry entry) {
        return new MealEntryResponse(entry.getId(), entry.getLoggedDate(), entry.getMealType(),
                entry.getFoodName(), entry.getServing(), entry.getCalories(),
                entry.getProteinGrams(), entry.getCarbsGrams(), entry.getFatGrams(), entry.getRemarks());
    }

    private NutritionValues toValues(NutritionTarget target) {
        return new NutritionValues(target.getCalories(), target.getProteinGrams(),
                target.getCarbsGrams(), target.getFatGrams());
    }

    private BigDecimal sum(List<BigDecimal> values) {
        return values.stream().filter(value -> value != null).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
