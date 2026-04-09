package com.wellfitness.features.exercise;

import com.wellfitness.features.exercise.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    List<Exercise> findByMuscleGroupIgnoreCase(String muscleGroup);

    List<Exercise> findByEquipmentIgnoreCase(String equipment);

    List<Exercise> findByMuscleGroupIgnoreCaseAndEquipmentIgnoreCase(String muscleGroup, String equipment);

    @Query("SELECT e FROM Exercise e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Exercise> searchByName(@Param("search") String search);

    Optional<Exercise> findByNameIgnoreCase(String name);

    @Query("SELECT e FROM Exercise e WHERE " +
           "(:muscleGroup IS NULL OR LOWER(e.muscleGroup) = LOWER(:muscleGroup)) AND " +
           "(:equipment IS NULL OR LOWER(e.equipment) = LOWER(:equipment)) AND " +
           "(:search IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Exercise> findFiltered(@Param("muscleGroup") String muscleGroup,
                                @Param("equipment") String equipment,
                                @Param("search") String search);
}
