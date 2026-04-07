package com.habittracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Represents which days of the week a habit should be performed.
 * week_day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
@Entity
@Table(
    name = "habit_week_days",
    uniqueConstraints = @UniqueConstraint(columnNames = {"habit_id", "week_day"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class HabitWeekDay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Column(name = "week_day", nullable = false)
    private Integer weekDay;
}
