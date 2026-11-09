package com.wellfitness.features.diet;

import com.wellfitness.features.diet.entity.MealEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MealEntryRepository extends JpaRepository<MealEntry, UUID> {
    List<MealEntry> findByUserIdAndLoggedDateOrderByCreatedAtAsc(UUID userId, LocalDate loggedDate);
    Optional<MealEntry> findByIdAndUserId(UUID id, UUID userId);
}
