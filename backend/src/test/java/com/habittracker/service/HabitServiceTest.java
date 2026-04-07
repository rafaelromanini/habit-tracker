package com.habittracker.service;

import com.habittracker.dto.request.CreateHabitRequest;
import com.habittracker.dto.response.HabitResponse;
import com.habittracker.exception.ResourceNotFoundException;
import com.habittracker.model.*;
import com.habittracker.repository.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("HabitService Tests")
class HabitServiceTest {

    @Mock private HabitRepository habitRepository;
    @Mock private DayRepository dayRepository;
    @Mock private DayHabitRepository dayHabitRepository;

    @InjectMocks
    private HabitService habitService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(UUID.randomUUID())
            .name("Test User")
            .email("test@example.com")
            .password("encoded_password")
            .build();
    }

    @Nested
    @DisplayName("createHabit()")
    class CreateHabit {

        @Test
        @DisplayName("should create habit with correct week days")
        void shouldCreateHabitWithCorrectWeekDays() {
            CreateHabitRequest request = new CreateHabitRequest("Exercise", List.of(1, 3, 5));

            Habit savedHabit = Habit.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .title("Exercise")
                .weekDays(List.of(
                    HabitWeekDay.builder().weekDay(1).build(),
                    HabitWeekDay.builder().weekDay(3).build(),
                    HabitWeekDay.builder().weekDay(5).build()
                ))
                .build();

            when(habitRepository.save(any(Habit.class))).thenReturn(savedHabit);

            HabitResponse response = habitService.createHabit(request, testUser);

            assertThat(response.title()).isEqualTo("Exercise");
            assertThat(response.weekDays()).containsExactly(1, 3, 5);
            verify(habitRepository, times(1)).save(any(Habit.class));
        }

        @Test
        @DisplayName("should remove duplicate week days")
        void shouldRemoveDuplicateWeekDays() {
            CreateHabitRequest request = new CreateHabitRequest("Read", List.of(1, 1, 2));

            Habit savedHabit = Habit.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .title("Read")
                .weekDays(List.of(
                    HabitWeekDay.builder().weekDay(1).build(),
                    HabitWeekDay.builder().weekDay(2).build()
                ))
                .build();

            when(habitRepository.save(any(Habit.class))).thenReturn(savedHabit);

            HabitResponse response = habitService.createHabit(request, testUser);

            assertThat(response.weekDays()).hasSize(2);
        }
    }

    @Nested
    @DisplayName("toggleHabit()")
    class ToggleHabit {

        @Test
        @DisplayName("should throw ResourceNotFoundException when habit not found")
        void shouldThrowWhenHabitNotFound() {
            UUID habitId = UUID.randomUUID();
            when(habitRepository.findByIdAndUserId(habitId, testUser.getId()))
                .thenReturn(Optional.empty());

            assertThatThrownBy(() -> habitService.toggleHabit(habitId, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(habitId.toString());
        }

        @Test
        @DisplayName("should complete habit when not yet completed today")
        void shouldCompleteHabitWhenNotYetCompleted() {
            UUID habitId = UUID.randomUUID();
            Habit habit = Habit.builder().id(habitId).user(testUser).title("Meditate").build();
            Day day = Day.builder().id(UUID.randomUUID()).user(testUser).date(LocalDate.now()).build();

            when(habitRepository.findByIdAndUserId(habitId, testUser.getId()))
                .thenReturn(Optional.of(habit));
            when(dayRepository.findByUserIdAndDate(testUser.getId(), LocalDate.now()))
                .thenReturn(Optional.of(day));
            when(dayHabitRepository.findByDayIdAndHabitId(day.getId(), habitId))
                .thenReturn(Optional.empty());

            habitService.toggleHabit(habitId, testUser);

            verify(dayHabitRepository, times(1)).save(any(DayHabit.class));
            verify(dayHabitRepository, never()).delete(any());
        }

        @Test
        @DisplayName("should uncomplete habit when already completed today")
        void shouldUncompleteHabitWhenAlreadyCompleted() {
            UUID habitId = UUID.randomUUID();
            Habit habit = Habit.builder().id(habitId).user(testUser).title("Meditate").build();
            Day day = Day.builder().id(UUID.randomUUID()).user(testUser).date(LocalDate.now()).build();
            DayHabit existing = DayHabit.builder().id(UUID.randomUUID()).day(day).habit(habit).build();

            when(habitRepository.findByIdAndUserId(habitId, testUser.getId()))
                .thenReturn(Optional.of(habit));
            when(dayRepository.findByUserIdAndDate(testUser.getId(), LocalDate.now()))
                .thenReturn(Optional.of(day));
            when(dayHabitRepository.findByDayIdAndHabitId(day.getId(), habitId))
                .thenReturn(Optional.of(existing));

            habitService.toggleHabit(habitId, testUser);

            verify(dayHabitRepository, times(1)).delete(existing);
            verify(dayHabitRepository, never()).save(any());
        }
    }
}
