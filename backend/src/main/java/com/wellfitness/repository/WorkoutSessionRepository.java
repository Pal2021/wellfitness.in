package com.wellfitness.repository;

import com.wellfitness.model.WorkoutSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, UUID> {

    Optional<WorkoutSession> findByUserIdAndStatus(UUID userId, String status);

    Page<WorkoutSession> findByUserIdAndStatusOrderByStartTimeDesc(UUID userId, String status, Pageable pageable);

    @Query("SELECT ws FROM WorkoutSession ws WHERE ws.userId = :userId AND ws.status = 'COMPLETED' " +
           "ORDER BY ws.startTime DESC")
    List<WorkoutSession> findRecentCompleted(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT ws FROM WorkoutSession ws WHERE ws.userId = :userId AND ws.status = 'COMPLETED' " +
           "AND ws.startTime >= :since ORDER BY ws.startTime ASC")
    List<WorkoutSession> findCompletedSince(@Param("userId") UUID userId, @Param("since") LocalDateTime since);

    long countByUserIdAndStatus(UUID userId, String status);
}
