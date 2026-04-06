package com.wellfitness.features.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private UUID userId;
    private String name;
    private String email;
    private String goal;
    private String experience;
    private Boolean onboardingComplete;
    @Builder.Default
    private boolean otpRequired = false;
}
