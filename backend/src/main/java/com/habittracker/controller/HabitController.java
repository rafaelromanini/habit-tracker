package com.habittracker.controller;

import com.habittracker.dto.request.CreateHabitRequest;
import com.habittracker.dto.response.*;
import com.habittracker.model.User;
import com.habittracker.service.HabitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

/**
 * REST endpoints for habit management.
 * All routes require authentication.
 */
@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Habits", description = "Habit management endpoints")
public class HabitController {

    private final HabitService habitService;

    @Operation(summary = "Create a new habit with recurrence days")
    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(
        @Valid @RequestBody CreateHabitRequest request,
        @AuthenticationPrincipal User user
    ) {
        HabitResponse response = habitService.createHabit(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get habits for a specific day and which ones are completed")
    @GetMapping("/day")
    public ResponseEntity<DayHabitsResponse> getDayHabits(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(habitService.getDayHabits(date, user));
    }

    @Operation(summary = "Get the full year summary for the habit grid")
    @GetMapping("/summary")
    public ResponseEntity<List<DaySummaryResponse>> getSummary(
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(habitService.getSummary(user));
    }

    @Operation(summary = "Toggle a habit as completed or uncompleted for today")
    @PatchMapping("/{habitId}/toggle")
    public ResponseEntity<Void> toggleHabit(
        @PathVariable UUID habitId,
        @AuthenticationPrincipal User user
    ) {
        habitService.toggleHabit(habitId, user);
        return ResponseEntity.noContent().build();
    }
}
