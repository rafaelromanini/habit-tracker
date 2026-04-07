package com.habittracker.repository;

import com.habittracker.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitRepository extends JpaRepository<Habit, UUID> {

    /**
     * Returns all habits for a user on a given date,
     * filtered by the day of week and created before or on that date.
     */
    @Query("""
        SELECT DISTINCT h FROM Habit h
        JOIN h.weekDays wd
        WHERE h.user.id = :userId
          AND wd.weekDay = :weekDay
          AND CAST(h.createdAt AS LocalDate) <= :date
        ORDER BY h.createdAt ASC
    """)
    List<Habit> findHabitsForDay(
        @Param("userId") UUID userId,
        @Param("date") LocalDate date,
        @Param("weekDay") int weekDay
    );

    List<Habit> findAllByUserIdOrderByCreatedAtAsc(UUID userId);

    Optional<Habit> findByIdAndUserId(UUID id, UUID userId);
}
