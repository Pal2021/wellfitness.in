package com.wellfitness.features.auth;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Service to send verification emails via SMTP (Gmail).
 * If JavaMailSender is not configured (no MAIL_USERNAME env var),
 * emails are logged but not sent — the app won't crash.
 */
@Slf4j
@Service
public class EmailService {

//    private final JavaMailSender mailSender;
//
//    @Autowired(required = false)
//    public EmailService(JavaMailSender mailSender) {
//        this.mailSender = mailSender;
//        if (mailSender == null) {
//            log.warn("⚠️  JavaMailSender not configured — email sending is DISABLED. "
//                    + "Set MAIL_USERNAME and MAIL_PASSWORD env vars to enable.");
//        }
//    }
//
//    /**
//     * Send OTP verification email to user.
//     */
//    public void sendVerificationOtp(String toEmail, String otp) {
//        if (mailSender == null) {
//            log.warn("Email NOT sent (mail not configured). To: {}, OTP: {}", toEmail, otp);
//            return;
//        }
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(toEmail);
//            message.setSubject("Wellfitness - Verify Your Email");
//            message.setText(
//                    "Welcome to Wellfitness! 🏋️\n\n" +
//                    "Your email verification code is: " + otp + "\n\n" +
//                    "This code expires in 5 minutes.\n\n" +
//                    "If you didn't request this, please ignore this email.\n\n" +
//                    "— Team Wellfitness"
//            );
//            mailSender.send(message);
//            log.info("Verification email sent to: {}", toEmail);
//        } catch (Exception e) {
//            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
//            throw new RuntimeException("Failed to send verification email. Please check your email address.");
//        }
//    }


    private final WebClient webClient;

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    @Value("${APP_EMAIL_FROM}")
    private String fromEmail;

    public EmailService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.resend.com").build();
    }

    public void sendOtpEmail(String toEmail, String otp) {
        System.out.println("API Key: " + apiKey);
        Resend resend = new Resend(apiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(toEmail)
                .subject("Your OTP Code")
                .html("<h2>Your OTP is: " + otp + "</h2>")
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
        }

    }

//    public void sendOtpEmail(String toEmail, String otp) {
//        webClient.post()
//                .uri("/emails")
//                .header("Authorization", "Bearer " + apiKey)
//                .contentType(MediaType.APPLICATION_JSON)
//                .bodyValue(Map.of(
//                        "from", fromEmail,
//                        "to", toEmail,
//                        "subject", "Your OTP Code",
//                        "html", "<h2>Your OTP is: " + otp + "</h2>"
//                ))
//                .retrieve()
//                .bodyToMono(String.class)
//                .subscribe(); // non-blocking
//    }
}
