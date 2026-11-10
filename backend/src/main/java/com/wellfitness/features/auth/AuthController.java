package com.wellfitness.features.auth;

import com.wellfitness.features.auth.dto.request.LoginRequest;
import com.wellfitness.features.auth.dto.request.RegisterRequest;
import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.dto.response.AuthResponse;
import com.wellfitness.features.auth.AuthService;
import com.wellfitness.features.auth.EmailOtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmailOtpService emailOtpService;
    // ─── Email Signup with BCrypt ───
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Registration successful. Please verify your email."));
    }

    // ─── Email + Password Login ───
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    // ─── Email Verification ───
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified", "Email verified successfully"));
    }

    // ─── Google OAuth: Accept Google ID Token → Verify → JWT ───
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleAuth(
            @RequestBody Map<String, String> body) {
        String idToken = body.get("credential");
        AuthResponse response = authService.googleAuth(idToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Google authentication successful"));
    }

    // ─── Email OTP: Send OTP ───
    @PostMapping("/otp/email/send")
    public ResponseEntity<ApiResponse<String>> sendEmailOtp(
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        emailOtpService.sendOtp(email);
        return ResponseEntity.ok(ApiResponse.success(
                "OTP sent", "OTP sent to " + email));
    }

    // ─── Email OTP: Verify OTP → JWT ───
    @PostMapping("/otp/email/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmailOtp(
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        AuthResponse response = authService.verifyEmailOtp(email, otp);
        return ResponseEntity.ok(ApiResponse.success(response, "Email verified successfully"));
    }
}
