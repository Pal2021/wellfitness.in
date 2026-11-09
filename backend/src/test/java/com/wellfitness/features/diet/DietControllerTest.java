package com.wellfitness.features.diet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellfitness.common.security.JwtAuthFilter;
import com.wellfitness.common.security.JwtUtil;
import com.wellfitness.config.CorsConfig;
import com.wellfitness.config.SecurityConfig;
import com.wellfitness.features.auth.UserRepository;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.diet.dto.MealEntryRequest;
import com.wellfitness.features.diet.dto.MealEntryResponse;
import com.wellfitness.features.diet.dto.NutritionEstimateRequest;
import com.wellfitness.features.diet.dto.NutritionValues;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DietController.class)
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthFilter.class})
class DietControllerTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @MockBean DietService dietService;
    @MockBean MealSuggestionService suggestions;
    @MockBean NutritionEstimateClient estimates;
    @MockBean JwtUtil jwtUtil;
    @MockBean UserRepository users;
    private final UUID owner = UUID.randomUUID();

    private RequestPostProcessor authenticated() {
        return authentication(new UsernamePasswordAuthenticationToken(User.builder().id(owner).build(), null, List.of()));
    }

    @Test
    void authenticatedEstimateReturnsExistingNutritionNamesWithoutSaving() throws Exception {
        when(jwtUtil.validateToken("offline-test-token")).thenReturn(true);
        when(jwtUtil.getUserIdFromToken("offline-test-token")).thenReturn(owner);
        when(users.findById(owner)).thenReturn(Optional.of(User.builder().id(owner).build()));
        when(estimates.estimate(any())).thenReturn(new NutritionValues(420, new BigDecimal("20.1"),
                new BigDecimal("50.0"), new BigDecimal("15.0")));

        mvc.perform(post("/api/diet/nutrition-estimate").header("Authorization", "Bearer offline-test-token")
                        .contentType("application/json")
                        .content("{\"foodName\":\"Dal and rice\",\"serving\":\"1 bowl\",\"remarks\":\"150g rice, 100g dal\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.calories").value(420))
                .andExpect(jsonPath("$.data.proteinGrams").value(20.1))
                .andExpect(jsonPath("$.data.carbsGrams").value(50.0))
                .andExpect(jsonPath("$.data.fatGrams").value(15.0));
        verify(estimates).estimate(new NutritionEstimateRequest("Dal and rice", "1 bowl", "150g rice, 100g dal"));
        verifyNoInteractions(dietService, suggestions);
    }

    @Test
    void rejectsAnonymousAndInvalidTokenBeforeCallingAi() throws Exception {
        for (String token : List.of("", "Bearer invalid-test-token")) {
            mvc.perform(post("/api/diet/nutrition-estimate").header("Authorization", token)
                            .contentType("application/json").content("{\"foodName\":\"Oats\",\"serving\":\"1 bowl\"}"))
                    .andExpect(status().isForbidden());
        }
        verifyNoInteractions(estimates, dietService);
    }

    static Stream<Map<String, String>> invalidRequests() {
        return Stream.of(Map.of(), Map.of("foodName", "Oats"), Map.of("serving", "1 bowl"),
                Map.of("foodName", " ", "serving", "1 bowl"), Map.of("foodName", "Oats", "serving", "\n "),
                Map.of("foodName", "x".repeat(121), "serving", "1 bowl"),
                Map.of("foodName", "Oats", "serving", "x".repeat(81)),
                Map.of("foodName", "Oats", "serving", "1 bowl", "remarks", "x".repeat(1001)),
                Map.of("foodName", "Oats", "servingSize", "1 bowl"));
    }

    @ParameterizedTest
    @MethodSource("invalidRequests")
    void validatesEstimateBeforeCallingAi(Map<String, String> input) throws Exception {
        mvc.perform(post("/api/diet/nutrition-estimate").with(authenticated())
                        .contentType("application/json").content(mapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
        verifyNoInteractions(estimates, dietService);
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "null", "{", "{\"foodName\":null,\"serving\":null}", "{\"foodName\":[],\"serving\":\"1 bowl\"}"})
    void rejectsMalformedOrNullBodiesWithSafeErrors(String body) throws Exception {
        mvc.perform(post("/api/diet/nutrition-estimate").with(authenticated())
                        .contentType("application/json").content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
        verifyNoInteractions(estimates, dietService);
    }

    @Test
    void acceptsMaximumInputLengthsAndOptionalRemarks() throws Exception {
        when(estimates.estimate(any())).thenReturn(new NutritionValues(0, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO));
        for (String remarks : new String[]{null, "", "x".repeat(1000)}) {
            mvc.perform(post("/api/diet/nutrition-estimate").with(authenticated()).contentType("application/json")
                            .content(mapper.writeValueAsString(new NutritionEstimateRequest("x".repeat(120), "x".repeat(80), remarks))))
                    .andExpect(status().isOk());
        }
        verifyNoInteractions(dietService);
    }

    @Test
    void aiUnavailableDoesNotPreventExplicitManualSaveOrEdit() throws Exception {
        when(estimates.estimate(any())).thenThrow(new NutritionEstimateUnavailableException());
        mvc.perform(post("/api/diet/nutrition-estimate").with(authenticated()).contentType("application/json")
                        .content("{\"foodName\":\"Oats\",\"serving\":\"1 bowl\"}"))
                .andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.error").value("AI_UNAVAILABLE"))
                .andExpect(jsonPath("$.message").value("Nutrition estimation is unavailable right now. Please enter nutrition values manually."));
        clearInvocations(estimates);

        UUID entryId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 11, 8);
        var manual = new MealEntryRequest(date, MealType.BREAKFAST, "Oats", null, 280,
                new BigDecimal("12.0"), null, null, "40g oats, water");
        var edited = new MealEntryRequest(date, MealType.BREAKFAST, "Oats", "1 bowl", 350,
                new BigDecimal("17.0"), new BigDecimal("45.0"), new BigDecimal("8.0"), "40g oats, 200ml milk");
        when(dietService.addEntry(eq(owner), any())).thenReturn(response(entryId, manual));
        when(dietService.updateEntry(eq(owner), eq(entryId), any())).thenReturn(response(entryId, edited));

        mvc.perform(post("/api/diet/entries").with(authenticated()).contentType("application/json")
                        .content(mapper.writeValueAsString(manual)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.remarks").value(manual.remarks()))
                .andExpect(jsonPath("$.data.calories").value(280));
        mvc.perform(put("/api/diet/entries/{id}", entryId).with(authenticated()).contentType("application/json")
                        .content(mapper.writeValueAsString(edited)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.remarks").value(edited.remarks()))
                .andExpect(jsonPath("$.data.calories").value(350));
        verify(dietService).addEntry(owner, manual);
        verify(dietService).updateEntry(owner, entryId, edited);
        verifyNoInteractions(estimates, suggestions);
    }

    @Test
    void entryRemarksLimitAppliesToSaveAndEdit() throws Exception {
        var invalid = new MealEntryRequest(LocalDate.of(2026, 11, 8), MealType.LUNCH, "Oats", "1 bowl", 300,
                null, null, null, "x".repeat(1001));
        for (var request : List.of(post("/api/diet/entries"), put("/api/diet/entries/{id}", UUID.randomUUID()))) {
            mvc.perform(request.with(authenticated()).contentType("application/json").content(mapper.writeValueAsString(invalid)))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
        }
        verifyNoInteractions(dietService, estimates);
    }

    private MealEntryResponse response(UUID id, MealEntryRequest request) {
        return new MealEntryResponse(id, request.loggedDate(), request.mealType(), request.foodName(), request.serving(),
                request.calories(), request.proteinGrams(), request.carbsGrams(), request.fatGrams(), request.remarks());
    }
}
