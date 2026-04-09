package com.wellfitness;

import com.wellfitness.features.auth.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SmokeTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean   // 👈 THIS FIXES YOUR ERROR
    private EmailService emailService;
    // ─── AUTH ─────────────────────────────────────────
    @Test
    void authEndpoints_ShouldNotReturn500() throws Exception {

        // Login endpoint — 400 is fine, 500 is NOT fine
        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert status != 500 : "Auth login returned 500!";
                });

        // Register endpoint — 400 is fine, 500 is NOT fine
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
        // 401 unauthorized is fine — 500 is NOT fine
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