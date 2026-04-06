package com.wellfitness.features.pr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "personal_records",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "exercise_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalRecord {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;

    @Column(name = "exercise_name", length = 100)
    private String exerciseName;

    @Column(name = "weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(nullable = false)
    private Integer reps;

    @Column(name = "estimated_1rm", nullable = false, precision = 6, scale = 2)
    private BigDecimal estimated1rm;

    @Column(name = "achieved_at", nullable = false)
    private LocalDateTime achievedAt;

    @Column(name = "session_id")
    private UUID sessionId;
}
