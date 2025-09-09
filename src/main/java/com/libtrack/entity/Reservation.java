package com.libtrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a reservation or borrowing of a book by a user.
 * Tracks the status (RESERVED, BORROWED, RETURNED) and due dates.
 */
@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue
    private UUID id;    // Unique reservation ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;  // Reservation status

    @CreationTimestamp
    private LocalDateTime borrowDate;  // Date/time when reservation was created or book was borrowed

    private LocalDateTime dueDate;     // Due date for returning the book

    private LocalDateTime returnDate;  // Date/time when the book was returned

    /**
     * Many reservations can belong to one user.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who reserved or borrowed this book

    /**
     * Many reservations can reference the same book.
     */
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book; // The book being reserved or borrowed
}
