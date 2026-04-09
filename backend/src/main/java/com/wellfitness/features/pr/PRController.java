package com.wellfitness.features.pr;

import com.wellfitness.common.response.ApiResponse;
import com.wellfitness.features.pr.entity.PersonalRecord;
import com.wellfitness.features.auth.entity.User;
import com.wellfitness.features.pr.PersonalRecordRepository;
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
