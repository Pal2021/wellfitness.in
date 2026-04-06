package com.wellfitness.features.split.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "split_day_exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitDayExercise {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "split_day_id", nullable = false)
    @JsonIgnore
    private SplitDay splitDay;

    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;

    @Column(name = "exercise_name", length = 100)
    private String exerciseName;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "default_sets")
    @Builder.Default
    private Integer defaultSets = 3;

    @Column(name = "default_reps")
    @Builder.Default
    private Integer defaultReps = 10;
}
