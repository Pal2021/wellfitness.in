package com.wellfitness.features.ai;

public class CoachUnavailableException extends RuntimeException {
    public CoachUnavailableException() {
        super("AI Coach is unavailable. Check the Azure configuration and try again.");
    }
}
