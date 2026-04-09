package com.wellfitness.features.split;

import com.wellfitness.features.split.entity.SplitTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SplitTemplateRepository extends JpaRepository<SplitTemplate, UUID> {

    List<SplitTemplate> findByIsSystemTemplateTrue();

    List<SplitTemplate> findByFrequencyDaysAndDifficulty(Integer frequencyDays, String difficulty);
}
