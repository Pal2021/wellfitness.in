package com.wellfitness.features.diet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellfitness.features.diet.dto.NutritionValues;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AzureMealIdeaClientTest {
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void readsStructuredTextFromAzureResponsesOutput() throws Exception {
        var client = new AzureMealIdeaClient("", "", "", mapper);
        var response = mapper.readTree("""
                {"status":"completed","output":[{"type":"message","content":[
                  {"type":"output_text","text":"{\\"ideas\\":[{\\"title\\":\\"Dal bowl\\",\\"description\\":\\"Rice, dal and vegetables.\\"}]}"}
                ]}]}
                """);

        assertThat(client.parseIdeas(response)).hasSize(1)
                .first().extracting("title").isEqualTo("Dal bowl");
    }

    @Test
    void missingConfigurationDoesNotSendMealHistoryAnywhere() {
        var client = new AzureMealIdeaClient("", "gpt-5", "", mapper);

        assertThatThrownBy(() -> client.suggest(LocalDate.now(), MealType.LUNCH, "STAY_FIT",
                List.of("Oats"), new NutritionValues(200, null, null, null), null, "vegetarian"))
                .isInstanceOf(MealSuggestionUnavailableException.class);
    }
}
