package com.wellfitness.features.diet;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellfitness.features.diet.dto.NutritionEstimateRequest;
import com.wellfitness.features.diet.dto.NutritionValues;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class AzureNutritionEstimateTest {
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    private final AzureMealIdeaClient client = new AzureMealIdeaClient(
            "https://offline.example", "test-deployment", "test-placeholder", mapper, builder.build());
    private final NutritionEstimateRequest input = new NutritionEstimateRequest(
            " Oats ", " 1 bowl ", " 40g oats, 200ml milk ");
    private static final String VALID = "{\"calories\":300,\"proteinGrams\":12.5,\"carbsGrams\":45,\"fatGrams\":8.1}";

    private JsonNode response(String text) {
        return mapper.createObjectNode().put("status", "completed").put("output_text", text);
    }

    @Test
    void sendsOnlyFoodContextUsingSharedAzureRequestAndStrictSchema() throws Exception {
        server.expect(requestTo("https://offline.example/openai/v1/responses"))
                .andExpect(header("api-key", "test-placeholder"))
                .andExpect(jsonPath("$.model").value("test-deployment"))
                .andExpect(jsonPath("$.store").value(false))
                .andExpect(jsonPath("$.max_output_tokens").value(1800))
                .andExpect(request -> {
                    var body = mapper.readTree(((org.springframework.mock.http.client.MockClientHttpRequest) request).getBodyAsString());
                    var context = mapper.readTree(body.path("input").asText());
                    assertThat(context.size()).isEqualTo(3);
                    assertThat(context.path("foodName").asText()).isEqualTo("Oats");
                    assertThat(context.path("serving").asText()).isEqualTo("1 bowl");
                    assertThat(context.path("remarks").asText()).isEqualTo("40g oats, 200ml milk");
                })
                .andExpect(jsonPath("$.text.format.strict").value(true))
                .andExpect(jsonPath("$.text.format.schema.additionalProperties").value(false))
                .andRespond(withSuccess(response(VALID).toString(), MediaType.APPLICATION_JSON));

        NutritionValues result = client.estimate(input);

        assertThat(result.calories()).isEqualTo(300);
        assertThat(result.proteinGrams()).isEqualByComparingTo("12.5");
        assertThat(result.carbsGrams()).isEqualByComparingTo("45.0");
        assertThat(result.fatGrams()).isEqualByComparingTo("8.1");
        server.verify();
    }

    @Test
    void readsNestedResponsesOutputAndAcceptsBoundaries() throws Exception {
        var response = mapper.createObjectNode().put("status", "completed");
        response.putArray("output").addObject().put("type", "message")
                .putArray("content").addObject().put("type", "output_text")
                .put("text", "{\"calories\":10000,\"proteinGrams\":1000.0,\"carbsGrams\":0,\"fatGrams\":0.1}");
        var result = client.parseNutrition(response);
        assertThat(result.calories()).isEqualTo(10000);
        assertThat(result.proteinGrams()).isEqualByComparingTo("1000");
        assertThat(result.carbsGrams()).isEqualByComparingTo("0");
        assertThat(result.fatGrams()).isEqualByComparingTo("0.1");
    }

    static Stream<String> invalidNutrition() {
        return Stream.of("", "not JSON", "null", "[]", "{}", "```json\n" + VALID + "\n```",
                VALID + " {}", VALID.replace("300", "-1"), VALID.replace("300", "10001"),
                VALID.replace("300", "2147483648"), VALID.replace("300", "300.5"),
                VALID.replace("300", "\"300\""), VALID.replace("300", "null"),
                VALID.replace("12.5", "-0.1"), VALID.replace("12.5", "1000.1"),
                VALID.replace("12.5", "12.51"), VALID.replace("12.5", "12.500000000000001"),
                VALID.replace("12.5", "\"12.5\""), VALID.replace("12.5", "null"),
                VALID.replace("12.5", "true"), VALID.replace("12.5", "NaN"),
                VALID.replace("12.5", "1e9999"), VALID.replace("45", "-1"),
                VALID.replace("8.1", "1001"), VALID.replace("fatGrams", "fat"),
                VALID.replace("}", ",\"extra\":1}"), VALID.replace("}", ",\"calories\":200}"),
                " ".repeat(4097) + VALID);
    }

    @ParameterizedTest
    @MethodSource("invalidNutrition")
    void rejectsInvalidModelOutputThroughSafePublicApi(String text) {
        server.expect(requestTo("https://offline.example/openai/v1/responses"))
                .andRespond(withSuccess(response(text).toString(), MediaType.APPLICATION_JSON));
        assertThatThrownBy(() -> client.estimate(input))
                .isInstanceOf(NutritionEstimateUnavailableException.class)
                .hasMessage("Nutrition estimation is unavailable right now. Please enter nutrition values manually.");
        server.verify();
    }

    @ParameterizedTest
    @ValueSource(strings = {"incomplete", "failed", "queued", "in_progress", "cancelled", ""})
    void rejectsNonCompletedResponses(String status) {
        var response = mapper.createObjectNode().put("status", status).put("output_text", VALID);
        assertThatThrownBy(() -> client.parseNutrition(response))
                .isInstanceOf(NutritionEstimateUnavailableException.class);
    }

    @Test
    void rejectsRefusalErrorAndEmptyResponses() throws Exception {
        assertThatThrownBy(() -> client.parseNutrition(null)).isInstanceOf(NutritionEstimateUnavailableException.class);
        assertThatThrownBy(() -> client.parseNutrition(response(""))).isInstanceOf(NutritionEstimateUnavailableException.class);
        var refusal = mapper.readTree("{\"status\":\"completed\",\"output\":[{\"content\":[{\"type\":\"refusal\",\"refusal\":\"No\"}]}]}");
        assertThatThrownBy(() -> client.parseNutrition(refusal)).isInstanceOf(NutritionEstimateUnavailableException.class);
        var error = mapper.createObjectNode().put("status", "completed").put("output_text", VALID).put("error", "private provider details");
        assertThatThrownBy(() -> client.parseNutrition(error)).isInstanceOf(NutritionEstimateUnavailableException.class);
    }

    @ParameterizedTest
    @ValueSource(ints = {400, 401, 429, 500, 503})
    void hidesProviderErrors(int status) {
        server.expect(requestTo("https://offline.example/openai/v1/responses"))
                .andRespond(withStatus(HttpStatus.valueOf(status)).body("private provider details"));
        assertThatThrownBy(() -> client.estimate(input)).isInstanceOf(NutritionEstimateUnavailableException.class)
                .hasMessageNotContaining("private provider details");
        server.verify();
    }

    @Test
    void handlesTimeoutWithoutLeakingDetails() {
        server.expect(requestTo("https://offline.example/openai/v1/responses"))
                .andRespond(withException(new IOException("private connection details")));
        assertThatThrownBy(() -> client.estimate(input)).isInstanceOf(NutritionEstimateUnavailableException.class)
                .hasMessageNotContaining("private connection details");
        server.verify();
    }

    @Test
    void missingConfigurationOrInsecureEndpointNeverMakesARequest() {
        for (String endpoint : List.of("", "http://offline.example")) {
            var unconfigured = new AzureMealIdeaClient(endpoint, "test-deployment", "test-placeholder", mapper, builder.build());
            assertThatThrownBy(() -> unconfigured.estimate(input)).isInstanceOf(NutritionEstimateUnavailableException.class);
        }
        var missingKey = new AzureMealIdeaClient("https://offline.example", "test-deployment", "", mapper, builder.build());
        assertThatThrownBy(() -> missingKey.estimate(input)).isInstanceOf(NutritionEstimateUnavailableException.class);
        server.verify();
    }

    @Test
    void sharedRequestPreservesMealIdeasAndExistingV1Endpoint() {
        var existing = new AzureMealIdeaClient("https://offline.example/openai/v1/", "test-deployment", "test-placeholder", mapper, builder.build());
        server.expect(requestTo("https://offline.example/openai/v1/responses"))
                .andExpect(jsonPath("$.text.format.name").value("meal_ideas"))
                .andRespond(withSuccess(response("{\"ideas\":[{\"title\":\"Dal\",\"description\":\"Rice and lentils\"}]}").toString(), MediaType.APPLICATION_JSON));
        assertThat(existing.suggest(LocalDate.of(2026, 11, 8), MealType.LUNCH, "STAY_FIT", List.of("Oats"),
                new NutritionValues(300, null, null, null), null, "vegetarian"))
                .hasSize(1).first().extracting("title").isEqualTo("Dal");
        server.verify();
    }
}
