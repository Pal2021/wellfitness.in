package com.wellfitness.features.split;

import com.wellfitness.features.split.entity.SplitDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SplitDayRepository extends JpaRepository<SplitDay, UUID> {

    List<SplitDay> findBySplitIdOrderByDisplayOrder(UUID splitId);
}
