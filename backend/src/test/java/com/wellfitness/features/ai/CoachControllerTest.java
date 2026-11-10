package com.wellfitness.features.ai;

import com.wellfitness.common.security.JwtAuthFilter;
import com.wellfitness.common.security.JwtUtil;
import com.wellfitness.config.CorsConfig;
import com.wellfitness.config.SecurityConfig;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.features.auth.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CoachController.class)
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthFilter.class})
class CoachControllerTest {
    @Autowired MockMvc mvc;
    @MockBean CoachService coach;
    @MockBean JwtUtil jwt;
    @MockBean UserRepository users;

    @Test
    void passesAuthenticatedUserAndQuestionToCoach() throws Exception {
        UUID owner = UUID.randomUUID();
        when(jwt.validateToken("coach-token")).thenReturn(true);
        when(jwt.getUserIdFromToken("coach-token")).thenReturn(owner);
        when(users.findById(owner)).thenReturn(Optional.of(User.builder().id(owner).goal("BUILD_MUSCLE").build()));
        when(coach.answer(any(), any())).thenReturn(new CoachController.CoachAnswer("Your recent sessions show progress."));

        mvc.perform(post("/api/coach/ask")
                        .header("Authorization", "Bearer coach-token")
                        .contentType("application/json")
                        .content("{\"message\":\"How is my training?\",\"history\":[]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer").value("Your recent sessions show progress."));
        verify(coach).answer(argThat(user -> owner.equals(user.getId())),
                argThat(question -> "How is my training?".equals(question.message())));
    }

    @Test
    void rejectsAnonymousAndBlankQuestionsBeforeCallingCoach() throws Exception {
        UUID owner = UUID.randomUUID();
        when(jwt.validateToken("coach-token")).thenReturn(true);
        when(jwt.getUserIdFromToken("coach-token")).thenReturn(owner);
        when(users.findById(owner)).thenReturn(Optional.of(User.builder().id(owner).build()));
        mvc.perform(post("/api/coach/ask").contentType("application/json")
                        .content("{\"message\":\"How is my training?\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/coach/ask").header("Authorization", "Bearer coach-token")
                        .contentType("application/json")
                        .content("{\"message\":\"  \"}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(coach);
    }
}
