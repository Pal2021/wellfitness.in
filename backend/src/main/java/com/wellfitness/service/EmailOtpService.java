package com.wellfitness.service;
import com.wellfitness.exception.BadRequestException;
import com.wellfitness.model.User;
import com.wellfitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailOtpService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("No account found with this email"));

        // Generate 6 digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save OTP with 5 min expiry
        user.setOtpCode(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Wellfitness — Verify your email");
        message.setText(
                "Hi " + user.getName() + ",\n\n" +
                        "Your email verification OTP is: " + otp + "\n\n" +
                        "This OTP expires in 5 minutes.\n\n" +
                        "If you didn't request this, ignore this email.\n\n" +
                        "— Wellfitness Team"
        );
        mailSender.send(message);
        log.info("Email OTP sent to: {}", email);
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("No account found with this email"));

        // Check OTP exists
        if (user.getOtpCode() == null) return false;

        // Check OTP matches
        if (!user.getOtpCode().equals(otp)) return false;

        // Check not expired
        if (user.getOtpExpiresAt().isBefore(LocalDateTime.now())) return false;

        // Mark email verified + clear OTP
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        log.info("Email OTP verified for: {}", email);
        return true;
    }
}
