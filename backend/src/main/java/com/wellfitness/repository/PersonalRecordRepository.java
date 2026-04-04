package com.wellfitness.repository;

import com.wellfitness.model.PersonalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonalRecordRepository extends JpaRepository<PersonalRecord, UUID> {

    Optional<PersonalRecord> findByUserIdAndExerciseId(UUID userId, UUID exerciseId);

    List<PersonalRecord> findByUserIdOrderByAchievedAtDesc(UUID userId);
}
