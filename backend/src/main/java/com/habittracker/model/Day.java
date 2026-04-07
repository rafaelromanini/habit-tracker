package com.habittracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

/**
 * Represents a specific calendar day for a user.
 * Used to track which habits were completed on that day.
 */
@Entity
@Table(
    name = "days",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"user", "dayHabits"})
public class Day {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DayHabit> dayHabits = new ArrayList<>();
}
