package com.libtrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a fine for overdue books or penalties.
 * Linked to a user and optionally a reservation.
 */
@Entity
@Table(name = "fines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fine {

    @Id
    @GeneratedValue
    private UUID id;       // Unique fine ID

    @Column(nullable = false)
    private double amount; // Fine amount in currency

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FineStatus status; // PENDING or PAID

    @CreationTimestamp
    private LocalDateTime calculatedOn; // When this fine was generated

    private LocalDateTime paidOn;       // When this fine was paid (if applicable)

    /**
     * Many fines can belong to one user.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user responsible for this fine

    /**
     * Optional link to a reservation.
     * Some fines may not be tied to a reservation (manual penalties).
     */
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation; // Reservation associated with this fine (nullable)
}
