package com.wellfitness.repository;

import com.wellfitness.model.UserSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSplitRepository extends JpaRepository<UserSplit, UUID> {

    Optional<UserSplit> findByUserIdAndIsActiveTrue(UUID userId);

    List<UserSplit> findByUserId(UUID userId);
}
