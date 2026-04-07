package com.habittracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Junction entity representing a habit completed on a specific day.
 */
@Entity
@Table(
    name = "day_habits",
    uniqueConstraints = @UniqueConstraint(columnNames = {"day_id", "habit_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class DayHabit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "day_id", nullable = false)
    private Day day;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;
}
