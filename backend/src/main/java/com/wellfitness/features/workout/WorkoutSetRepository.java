package com.wellfitness.features.workout;

import com.wellfitness.features.workout.entity.WorkoutSet;
import com.wellfitness.features.workout.dto.response.ExerciseProgressSummary;
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

    boolean existsBySessionIdAndExerciseIdAndSetNumber(UUID sessionId, UUID exerciseId, Integer setNumber);

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

    @Query("SELECT new com.wellfitness.features.workout.dto.response.ExerciseProgressSummary(" +
           "ws.exerciseId, MAX(ws.exerciseName), COUNT(DISTINCT s.id), MAX(s.startTime)) " +
           "FROM WorkoutSet ws JOIN ws.session s " +
           "WHERE s.userId = :userId AND s.status = 'COMPLETED' AND ws.completed = true " +
           "GROUP BY ws.exerciseId ORDER BY MAX(s.startTime) DESC")
    List<ExerciseProgressSummary> findExerciseProgressSummaries(@Param("userId") UUID userId);

    @Query("SELECT ws FROM WorkoutSet ws JOIN FETCH ws.session s " +
           "WHERE s.userId = :userId AND s.status = 'COMPLETED' " +
           "AND ws.exerciseId = :exerciseId AND ws.completed = true " +
           "ORDER BY s.startTime DESC, ws.setNumber ASC")
    List<WorkoutSet> findCompletedSessionHistoryForExercise(@Param("userId") UUID userId,
                                                            @Param("exerciseId") UUID exerciseId);
}
