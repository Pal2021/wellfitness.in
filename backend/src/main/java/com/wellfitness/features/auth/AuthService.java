package com.wellfitness.features.auth;

import com.wellfitness.features.auth.dto.request.LoginRequest;
import com.wellfitness.features.auth.dto.request.RegisterRequest;
import com.wellfitness.features.auth.dto.response.AuthResponse;
import com.wellfitness.common.exception.BadRequestException;
import com.wellfitness.common.exception.ResourceNotFoundException;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.common.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;
    private final EmailOtpService emailOtpService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final GoogleTokenVerifierService googleTokenVerifier;

    // ════════════════════════════════════════════
    //  1. EMAIL SIGNUP — BCrypt hashed password + email verification token
    // ════════════════════════════════════════════

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        System.out.println("API KEY: " + apiKey);
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .authProvider("LOCAL")
                .emailVerified(false)  // not verified yet
                .onboardingComplete(false)
                .build();

        userRepository.save(user);

        // Send OTP email
        emailOtpService.sendOtp(request.getEmail());

        log.info("User registered, OTP sent: {}", user.getEmail());

        // Don't return JWT yet — user must verify OTP first
        return AuthResponse.builder()
                .email(user.getEmail())
                .name(user.getName())
                .otpRequired(true)  // frontend shows OTP screen
                .build();
    }
    /**
     * Verify email using the verification token sent to user's email.
     */
    @Transactional
    public void verifyEmail(String verificationToken) {
        User user = userRepository.findAll().stream()
                .filter(u -> verificationToken.equals(u.getEmailVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null); // clear token after verification
        userRepository.save(user);
        log.info("Email verified for: {}", user.getEmail());
    }

    /**
     * Standard email + password login.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with this email. Please create your profile first."));

        if (!"LOCAL".equals(user.getAuthProvider())) {
            throw new BadCredentialsException(
                    "This account uses " + user.getAuthProvider() + " login.");
        }

        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Block login if email not verified
        if (!user.getEmailVerified()) {
            emailOtpService.sendOtp(request.getEmail()); // resend OTP
            throw new BadRequestException("EMAIL_NOT_VERIFIED"); // frontend catches this
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("User logged in (EMAIL): {}", user.getEmail());
        return buildAuthResponse(user, token);
    }
    @Transactional
    public AuthResponse verifyEmailOtp(String email, String otp) {
        boolean verified = emailOtpService.verifyOtp(email, otp);
        if (!verified) {
            throw new BadCredentialsException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        user.setEmailVerified(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("Email OTP verified, JWT issued: {}", email);
        return buildAuthResponse(user, token);
    }
    // ════════════════════════════════════════════
    //  3. GOOGLE OAUTH — Verify ID token → Create user if not exists → JWT
    // ════════════════════════════════════════════

    /**
     * Accept Google ID token from frontend Google Sign-In,
     * verify it against Google's servers, extract user info,
     * create account if not exists, return JWT.
     */
    @Transactional
    public AuthResponse googleAuth(String idToken) {
        // Verify the Google ID token
        Map<String, String> googleUser = googleTokenVerifier.verifyToken(idToken);
        if (googleUser == null) {
            throw new BadCredentialsException("Invalid Google ID token — verification failed");
        }

        String email = googleUser.get("email");
        String name = googleUser.get("name");
        String pictureUrl = googleUser.get("pictureUrl");
        String googleId = googleUser.get("googleId");

        // Find existing user by email, or create new Google account
        User user = userRepository.findByEmail(email.toLowerCase().trim()).orElseGet(() -> {
            log.info("New Google user — creating account for {}", email);
            return userRepository.save(User.builder()
                    .name(name)
                    .email(email.toLowerCase().trim())
                    .googleId(googleId)
                    .profilePhotoUrl(pictureUrl)
                    .passwordHash(passwordEncoder.encode("GOOGLE_OAUTH_" + googleId))
                    .authProvider("GOOGLE")
                    .emailVerified(true) // Google accounts are pre-verified
                    .onboardingComplete(false)
                    .build());
        });

        // If user exists but was created via different method, link Google ID
        if (user.getGoogleId() == null && googleId != null) {
            user.setGoogleId(googleId);
            if (pictureUrl != null && !pictureUrl.isEmpty()) {
                user.setProfilePhotoUrl(pictureUrl);
            }
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("Google OAuth login successful: {}", email);
        return buildAuthResponse(user, token);
    }

    // ════════════════════════════════════════════
    //  Shared
    // ════════════════════════════════════════════

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .goal(user.getGoal())
                .experience(user.getExperience())
                .onboardingComplete(user.getOnboardingComplete())
                .build();
    }
}
