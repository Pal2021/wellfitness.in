package com.wellfitness.features.diet;

import com.wellfitness.features.diet.dto.MealIdea;
import com.wellfitness.features.diet.dto.MealSuggestionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MealSuggestionService {
    private final DietService dietService;
    private final MealIdeaClient mealIdeaClient;

    public List<MealIdea> suggest(UUID userId, String goal, MealSuggestionRequest request) {
        var day = dietService.getDay(userId, request.date());
        List<String> foods = day.entries().stream()
                .map(entry -> entry.foodName())
                .limit(25).toList();
        return mealIdeaClient.suggest(request.date(), request.mealType(), goal,
                foods, day.totals(), day.targets(), request.preferences());
    }
}
