package com.wellfitness.features.split.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "split_template_days")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SplitTemplateDay {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    @JsonIgnore
    private SplitTemplate template;

    @Column(name = "day_of_week", nullable = false, length = 3)
    private String dayOfWeek;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(name = "is_rest_day")
    @Builder.Default
    private Boolean isRestDay = false;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(columnDefinition = "TEXT")
    private String exercises;
}
