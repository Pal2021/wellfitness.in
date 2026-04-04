package com.wellfitness.repository;

import com.wellfitness.model.SplitTemplateDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SplitTemplateDayRepository extends JpaRepository<SplitTemplateDay, UUID> {

    List<SplitTemplateDay> findByTemplateIdOrderByDisplayOrder(UUID templateId);
}
