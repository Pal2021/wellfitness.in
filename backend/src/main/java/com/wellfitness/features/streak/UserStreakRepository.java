package com.wellfitness.features.streak;

import com.wellfitness.features.streak.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, UUID> {

    Optional<UserStreak> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
