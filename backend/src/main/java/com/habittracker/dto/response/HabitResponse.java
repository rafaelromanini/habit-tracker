package com.habittracker.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record HabitResponse(
    UUID id,
    String title,
    List<Integer> weekDays,
    LocalDateTime createdAt
) {}
