package com.wellfitness;

import com.wellfitness.features.auth.EmailOtpService;
import com.wellfitness.features.auth.EmailService;
import com.wellfitness.features.auth.OtpService;
import com.wellfitness.features.auth.GoogleTokenVerifierService;
import com.wellfitness.features.auth.FirebaseTokenVerifierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    @MockBean
    private EmailOtpService emailOtpService;

    @MockBean
    private OtpService otpService;

    @MockBean
    private GoogleTokenVerifierService googleTokenVerifier;

    @MockBean
    private FirebaseTokenVerifierService firebaseTokenVerifier;

    // ─── AUTH ─────────────────────────────────────────
    @Test
    void authEndpoints_ShouldNotReturn500() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Auth login returned 500!";
                });

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Auth register returned 500!";
                });
    }

    // ─── EXERCISE ─────────────────────────────────────
    @Test
    void exerciseEndpoint_ShouldNotReturn500() throws Exception {
        mockMvc.perform(get("/api/exercises"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Exercise list returned 500!";
                });
    }

    // ─── WORKOUT ──────────────────────────────────────
    @Test
    void workoutEndpoint_ShouldNotReturn500() throws Exception {
        mockMvc.perform(get("/api/workouts/history"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Workout history returned 500!";
                });
    }

    // ─── SPLIT ────────────────────────────────────────
    @Test
    void splitEndpoint_ShouldNotReturn500() throws Exception {
        mockMvc.perform(get("/api/splits/1"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Split endpoint returned 500!";
                });
    }

    // ─── STREAK ───────────────────────────────────────
    @Test
    void streakEndpoint_ShouldNotReturn500() throws Exception {
        mockMvc.perform(get("/api/streak/1"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Streak endpoint returned 500!";
                });
    }
}