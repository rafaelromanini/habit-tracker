package com.habittracker.repository;

import com.habittracker.model.Day;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DayRepository extends JpaRepository<Day, UUID> {

    Optional<Day> findByUserIdAndDate(UUID userId, LocalDate date);

    /**
     * Returns all days within a date range for a given user,
     * eagerly loading the completed habits.
     */
    @Query("""
        SELECT DISTINCT d FROM Day d
        LEFT JOIN FETCH d.dayHabits dh
        LEFT JOIN FETCH dh.habit
        WHERE d.user.id = :userId
          AND d.date BETWEEN :startDate AND :endDate
        ORDER BY d.date ASC
    """)
    List<Day> findAllByUserIdAndDateBetween(
        @Param("userId") UUID userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
