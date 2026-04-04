package com.wellfitness.controller;

import com.wellfitness.dto.response.ApiResponse;
import com.wellfitness.model.SplitTemplate;
import com.wellfitness.model.SplitTemplateDay;
import com.wellfitness.service.SplitTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/split-templates")
@RequiredArgsConstructor
public class SplitTemplateController {

    private final SplitTemplateService splitTemplateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SplitTemplate>>> getAllTemplates() {
        List<SplitTemplate> templates = splitTemplateService.getAllTemplates();
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SplitTemplate>> getTemplateById(@PathVariable UUID id) {
        SplitTemplate template = splitTemplateService.getTemplateById(id);
        return ResponseEntity.ok(ApiResponse.success(template));
    }

    @GetMapping("/{id}/days")
    public ResponseEntity<ApiResponse<List<SplitTemplateDay>>> getTemplateDays(@PathVariable UUID id) {
        List<SplitTemplateDay> days = splitTemplateService.getTemplateDays(id);
        return ResponseEntity.ok(ApiResponse.success(days));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<SplitTemplate>> getRecommended(
            @RequestParam int days,
            @RequestParam(defaultValue = "INTERMEDIATE") String experience) {
        SplitTemplate template = splitTemplateService.getRecommended(days, experience);
        return ResponseEntity.ok(ApiResponse.success(template));
    }
}
