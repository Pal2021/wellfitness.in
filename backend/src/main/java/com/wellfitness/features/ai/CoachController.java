package com.wellfitness.features.ai;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.auth.entity.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coach")
@RequiredArgsConstructor
public class CoachController {
    private final CoachService coachService;

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<CoachAnswer>> ask(
            @AuthenticationPrincipal User user, @Valid @RequestBody CoachQuestion question) {
        return ResponseEntity.ok(ApiResponse.success(coachService.answer(user, question)));
    }

    @ExceptionHandler(CoachUnavailableException.class)
    public ResponseEntity<ApiResponse<Void>> unavailable(CoachUnavailableException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("AI_UNAVAILABLE", ex.getMessage()));
    }

    public record CoachQuestion(@NotBlank @Size(max = 1000) String message,
                                List<CoachTurn> history) {}

    public record CoachTurn(String role, String content) {}

    public record CoachAnswer(String answer) {}
}
