package com.wellfitness.service;

import com.wellfitness.exception.ResourceNotFoundException;
import com.wellfitness.model.SplitTemplate;
import com.wellfitness.model.SplitTemplateDay;
import com.wellfitness.repository.SplitTemplateDayRepository;
import com.wellfitness.repository.SplitTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SplitTemplateService {

    private final SplitTemplateRepository splitTemplateRepository;
    private final SplitTemplateDayRepository splitTemplateDayRepository;

    public List<SplitTemplate> getAllTemplates() {
        return splitTemplateRepository.findByIsSystemTemplateTrue();
    }

    public SplitTemplate getTemplateById(UUID id) {
        return splitTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SplitTemplate", "id", id));
    }

    public List<SplitTemplateDay> getTemplateDays(UUID templateId) {
        return splitTemplateDayRepository.findByTemplateIdOrderByDisplayOrder(templateId);
    }

    /**
     * RULE 5 — Split Recommendation:
     * 3 days → Full Body, 4 days → Upper/Lower, 5 days → Bro Split,
     * 6 days + ADVANCED → Arnold Split, 6 days + other → PPL
     */
    public SplitTemplate getRecommended(int days, String experience) {
        List<SplitTemplate> all = splitTemplateRepository.findByIsSystemTemplateTrue();

        String targetShortName;
        if (days == 3) {
            targetShortName = "FULL_BODY";
        } else if (days == 4) {
            targetShortName = "UPPER_LOWER";
        } else if (days == 5) {
            targetShortName = "BRO_SPLIT";
        } else if (days == 6 && "ADVANCED".equalsIgnoreCase(experience)) {
            targetShortName = "ARNOLD";
        } else if (days == 6) {
            targetShortName = "PPL";
        } else {
            targetShortName = "FULL_BODY";
        }

        String finalTarget = targetShortName;
        return all.stream()
                .filter(t -> t.getShortName().equalsIgnoreCase(finalTarget))
                .findFirst()
                .orElse(all.isEmpty() ? null : all.get(0));
    }
}
