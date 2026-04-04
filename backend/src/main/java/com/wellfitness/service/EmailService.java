package com.wellfitness.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service to send verification emails via SMTP (Gmail).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Send OTP verification email to user.
     */
    public void sendVerificationOtp(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Wellfitness - Verify Your Email");
            message.setText(
                    "Welcome to Wellfitness! 🏋️\n\n" +
                    "Your email verification code is: " + otp + "\n\n" +
                    "This code expires in 5 minutes.\n\n" +
                    "If you didn't request this, please ignore this email.\n\n" +
                    "— Team Wellfitness"
            );
            mailSender.send(message);
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send verification email. Please check your email address.");
        }
    }
}
