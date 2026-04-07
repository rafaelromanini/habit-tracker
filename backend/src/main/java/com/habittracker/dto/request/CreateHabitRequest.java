package com.habittracker.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;

public record CreateHabitRequest(

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    String title,

    @NotEmpty(message = "At least one week day is required")
    @Size(min = 1, max = 7)
    List<@Min(0) @Max(6) Integer> weekDays
) {}
