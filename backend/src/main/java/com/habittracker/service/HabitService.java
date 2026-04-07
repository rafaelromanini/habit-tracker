package com.habittracker.service;

import com.habittracker.dto.request.CreateHabitRequest;
import com.habittracker.dto.response.*;
import com.habittracker.exception.ResourceNotFoundException;
import com.habittracker.model.*;
import com.habittracker.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Core business logic for habit management.
 * Handles creation, toggling and summary generation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HabitService {

    private final HabitRepository habitRepository;
    private final DayRepository dayRepository;
    private final DayHabitRepository dayHabitRepository;

    /**
     * Creates a new habit with its recurrence days.
     */
    @Transactional
    public HabitResponse createHabit(CreateHabitRequest request, User user) {
        Habit habit = Habit.builder()
            .user(user)
            .title(request.title())
            .build();

        List<HabitWeekDay> weekDays = request.weekDays().stream()
            .distinct()
            .map(day -> HabitWeekDay.builder()
                .weekDay(day)
                .build())
            .collect(Collectors.toList());

        weekDays.forEach(habit::addWeekDay);
        habitRepository.save(habit);

        log.info("Habit created: '{}' for user {}", habit.getTitle(), user.getEmail());
        return toHabitResponse(habit);
    }

    /**
     * Returns the habits applicable to a specific date and which ones are completed.
     * Used to populate the day popup.
     */
    @Transactional(readOnly = true)
    public DayHabitsResponse getDayHabits(LocalDate date, User user) {
        int weekDay = date.getDayOfWeek().getValue() % 7; // 0=Sunday, 6=Saturday

        List<Habit> possibleHabits = habitRepository.findHabitsForDay(user.getId(), date, weekDay);

        List<UUID> completedHabitIds = dayRepository
            .findByUserIdAndDate(user.getId(), date)
            .map(day -> day.getDayHabits().stream()
                .map(dh -> dh.getHabit().getId())
                .collect(Collectors.toList()))
            .orElse(Collections.emptyList());

        return new DayHabitsResponse(
            date,
            possibleHabits.stream().map(this::toHabitResponse).toList(),
            completedHabitIds
        );
    }

    /**
     * Returns the summary for all days — used to build the habit grid.
     * Each entry contains total habits and completed habits for that day.
     */
    @Transactional(readOnly = true)
    public List<DaySummaryResponse> getSummary(User user) {
        LocalDate startDate = LocalDate.now().withDayOfYear(1);
        LocalDate endDate = LocalDate.now();

        List<Day> days = dayRepository.findAllByUserIdAndDateBetween(
            user.getId(), startDate, endDate
        );

        return days.stream()
            .map(day -> {
                int weekDay = day.getDate().getDayOfWeek().getValue() % 7;
                int amountHabits = habitRepository
                    .findHabitsForDay(user.getId(), day.getDate(), weekDay)
                    .size();
                int completed = day.getDayHabits().size();

                return new DaySummaryResponse(
                    day.getId(),
                    day.getDate(),
                    amountHabits,
                    completed
                );
            })
            .sorted(Comparator.comparing(DaySummaryResponse::date))
            .collect(Collectors.toList());
    }

    /**
     * Toggles a habit as completed or uncompleted for today.
     * Creates the Day record if it doesn't exist yet.
     */
    @Transactional
    public void toggleHabit(UUID habitId, User user) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, user.getId())
            .orElseThrow(() -> ResourceNotFoundException.habit(habitId));

        LocalDate today = LocalDate.now();

        Day day = dayRepository.findByUserIdAndDate(user.getId(), today)
            .orElseGet(() -> {
                Day newDay = Day.builder()
                    .user(user)
                    .date(today)
                    .build();
                return dayRepository.save(newDay);
            });

        Optional<DayHabit> existing = dayHabitRepository.findByDayIdAndHabitId(day.getId(), habit.getId());

        if (existing.isPresent()) {
            dayHabitRepository.delete(existing.get());
            log.info("Habit '{}' uncompleted for user {} on {}", habit.getTitle(), user.getEmail(), today);
        } else {
            DayHabit dayHabit = DayHabit.builder()
                .day(day)
                .habit(habit)
                .build();
            dayHabitRepository.save(dayHabit);
            log.info("Habit '{}' completed for user {} on {}", habit.getTitle(), user.getEmail(), today);
        }
    }

    /**
     * Returns all habits created by the user.
     */
    @Transactional(readOnly = true)
    public List<HabitResponse> listHabits(User user) {
        return habitRepository.findAllByUserIdOrderByCreatedAtAsc(user.getId())
            .stream()
            .map(this::toHabitResponse)
            .toList();
    }

    /**
     * Deletes a habit and all its associated completion records.
     */
    @Transactional
    public void deleteHabit(UUID habitId, User user) {
        Habit habit = habitRepository.findByIdAndUserId(habitId, user.getId())
            .orElseThrow(() -> ResourceNotFoundException.habit(habitId));
        habitRepository.delete(habit);
        log.info("Habit '{}' deleted by user {}", habit.getTitle(), user.getEmail());
    }

    private HabitResponse toHabitResponse(Habit habit) {
        List<Integer> weekDays = habit.getWeekDays().stream()
            .map(HabitWeekDay::getWeekDay)
            .sorted()
            .toList();

        return new HabitResponse(
            habit.getId(),
            habit.getTitle(),
            weekDays,
            habit.getCreatedAt()
        );
    }
}
