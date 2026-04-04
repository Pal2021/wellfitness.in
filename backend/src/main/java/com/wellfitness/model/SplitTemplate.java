package com.wellfitness.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "split_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitTemplate {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "short_name", nullable = false, length = 20)
    private String shortName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "frequency_days", nullable = false)
    private Integer frequencyDays;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(length = 200)
    private String goal;

    @Column(name = "icon_emoji", length = 10)
    private String iconEmoji;

    @Column(name = "is_system_template")
    @Builder.Default
    private Boolean isSystemTemplate = true;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<SplitTemplateDay> days = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
