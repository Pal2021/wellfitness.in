package com.wellfitness.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory OTP service for Mobile and Email OTP authentication.
 * In production, integrate with SMS gateway (MSG91/Twilio) for mobile
 * and email service (SendGrid/SMTP) for email OTPs.
 */
@Slf4j
@Service
public class OtpService {

    private static final int OTP_LENGTH = 4;
    private final int expiryMinutes;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    public OtpService(@Value("${app.otp.expiry-minutes:5}") int expiryMinutes) {
        this.expiryMinutes = expiryMinutes;
    }

    /**
     * Generate and store OTP for a given identifier (phone/email).
     */
    public String generateOtp(String identifier) {
        String key = normalize(identifier);
        String otp = String.valueOf(1000 + random.nextInt(9000)); // 4-digit
        otpStore.put(key, new OtpRecord(otp, LocalDateTime.now()));
        log.info("OTP generated for {}: {}", key, otp);
        return otp;
    }

    /**
     * Verify OTP for a given identifier. One-time use — removes after successful verification.
     */
    public boolean verifyOtp(String identifier, String otp) {
        String key = normalize(identifier);
        OtpRecord record = otpStore.get(key);

        if (record == null) {
            log.warn("No OTP found for {}", key);
            return false;
        }

        if (record.createdAt().plusMinutes(expiryMinutes).isBefore(LocalDateTime.now())) {
            otpStore.remove(key);
            log.warn("OTP expired for {}", key);
            return false;
        }

        if (!record.otp().equals(otp.trim())) {
            log.warn("Invalid OTP attempt for {}", key);
            return false;
        }

        otpStore.remove(key); // one-time use
        log.info("OTP verified successfully for {}", key);
        return true;
    }

    private String normalize(String identifier) {
        return identifier.toLowerCase().trim().replaceAll("[^a-z0-9@.]", "");
    }

    private record OtpRecord(String otp, LocalDateTime createdAt) {}
}
