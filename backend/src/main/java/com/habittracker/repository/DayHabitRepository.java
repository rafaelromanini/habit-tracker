package com.habittracker.repository;

import com.habittracker.model.DayHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DayHabitRepository extends JpaRepository<DayHabit, UUID> {
    Optional<DayHabit> findByDayIdAndHabitId(UUID dayId, UUID habitId);
    boolean existsByDayIdAndHabitId(UUID dayId, UUID habitId);
}