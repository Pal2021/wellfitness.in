package com.wellfitness.repository;

import com.wellfitness.features.workout.entity.WorkoutSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, UUID> {

    List<WorkoutSet> findBySessionIdOrderByLoggedAtAsc(UUID sessionId);

    List<WorkoutSet> findBySessionIdAndExerciseIdOrderBySetNumber(UUID sessionId, UUID exerciseId);

    @Query("SELECT ws FROM WorkoutSet ws WHERE ws.session.id IN " +
           "(SELECT s.id FROM WorkoutSession s WHERE s.userId = :userId AND s.status = 'COMPLETED') " +
           "AND ws.exerciseId = :exerciseId AND ws.completed = true " +
           "ORDER BY ws.loggedAt DESC")
    List<WorkoutSet> findPreviousSetsForExercise(@Param("userId") UUID userId,
                                                  @Param("exerciseId") UUID exerciseId);

    @Query("SELECT ws FROM WorkoutSet ws WHERE ws.session.userId = :userId " +
           "AND ws.exerciseId = :exerciseId AND ws.completed = true " +
           "ORDER BY ws.loggedAt DESC")
    List<WorkoutSet> findAllCompletedForExercise(@Param("userId") UUID userId,
                                                  @Param("exerciseId") UUID exerciseId);
}
