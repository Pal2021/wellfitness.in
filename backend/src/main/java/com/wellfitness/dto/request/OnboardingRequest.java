package com.wellfitness.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequest {

    private String goal;
    private String experience;
    private Integer daysPerWeek;

    @NotNull(message = "Template ID is required")
    private UUID templateId;

    private String notificationTime;
}
