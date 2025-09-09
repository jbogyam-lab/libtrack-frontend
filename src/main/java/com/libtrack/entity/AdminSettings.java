package com.libtrack.entity;

//import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stores global library settings like fine rates and reservation limits.
 * This is a Singleton table - only one row should exist.
 */
@Entity
@Table(name = "admin_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                // Primary key (only one row expected)

    @Column(nullable = false)
    private double fineRatePerDay;  // Fine rate per overdue day

    @Column(nullable = false)
    private int maxBooksPerUser;    // Max number of books a user can borrow

    @Column(nullable = false)
    private int reservationWindowDays; // Max days a reservation is valid
}
