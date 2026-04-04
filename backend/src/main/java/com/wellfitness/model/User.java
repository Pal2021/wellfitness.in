package com.wellfitness.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    // AUTH PROVIDER: "LOCAL", "GOOGLE", "MOBILE"
    @Column(name = "auth_provider", length = 20)
    @Builder.Default
    private String authProvider = "LOCAL";

    // Google OAuth subject ID
    @Column(name = "google_id", length = 100)
    private String googleId;

    // Email verification
    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "email_verification_token", length = 100)
    private String emailVerificationToken;

    @Column(length = 20)
    private String goal;

    @Column(length = 20)
    private String experience;

    @Column(name = "bodyweight_kg", precision = 5, scale = 2)
    private BigDecimal bodyweightKg;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "days_per_week")
    private Integer daysPerWeek;

    @Column(name = "onboarding_complete")
    @Builder.Default
    private Boolean onboardingComplete = false;

    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @Column(name = "notification_time", length = 20)
    private String notificationTime;

    @Column(name = "units_weight", length = 5)
    @Builder.Default
    private String unitsWeight = "KG";

    @Column(name = "units_height", length = 5)
    @Builder.Default
    private String unitsHeight = "CM";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
