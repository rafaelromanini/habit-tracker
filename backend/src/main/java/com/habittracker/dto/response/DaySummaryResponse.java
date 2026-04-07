package com.habittracker.dto.response;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Represents a single day in the habit grid.
 * Used to calculate the completion percentage and color intensity.
 */
public record DaySummaryResponse(
    UUID id,
    LocalDate date,
    int amountHabits,
    int completedHabits
) {
    public double completionPercentage() {
        if (amountHabits == 0) return 0;
        return (double) completedHabits / amountHabits * 100;
    }
}
