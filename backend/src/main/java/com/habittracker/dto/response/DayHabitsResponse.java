package com.habittracker.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Returns the habits for a specific day along with which ones are completed.
 * Used to populate the day popup on the front-end.
 */
public record DayHabitsResponse(
    LocalDate date,
    List<HabitResponse> possibleHabits,
    List<UUID> completedHabitIds
) {}
