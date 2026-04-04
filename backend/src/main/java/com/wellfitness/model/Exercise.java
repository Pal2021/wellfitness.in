package com.wellfitness.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "muscle_group", nullable = false, length = 50)
    private String muscleGroup;

    @Column(name = "secondary_muscles", length = 200)
    private String secondaryMuscles;

    @Column(nullable = false, length = 50)
    private String equipment;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(name = "is_compound")
    @Builder.Default
    private Boolean isCompound = false;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
