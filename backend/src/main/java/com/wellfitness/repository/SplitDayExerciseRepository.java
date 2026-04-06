package com.wellfitness.repository;

import com.wellfitness.features.split.entity.SplitDayExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SplitDayExerciseRepository extends JpaRepository<SplitDayExercise, UUID> {
}
