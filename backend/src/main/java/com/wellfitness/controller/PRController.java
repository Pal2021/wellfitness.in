package com.wellfitness.controller;

import com.wellfitness.dto.response.ApiResponse;
import com.wellfitness.model.PersonalRecord;
import com.wellfitness.model.User;
import com.wellfitness.repository.PersonalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prs")
@RequiredArgsConstructor
public class PRController {

    private final PersonalRecordRepository personalRecordRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonalRecord>>> getAllPRs(
            @AuthenticationPrincipal User user) {
        List<PersonalRecord> prs = personalRecordRepository
                .findByUserIdOrderByAchievedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success(prs));
    }
}
