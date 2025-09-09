package com.libtrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Represents a user of the system (Student, Librarian, or Global Admin).
 * Users can borrow/reserve books, pay fines, etc.
 */
@Entity
@Table(name = "users")
@Data                       // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder                    // Lombok: allows building objects using builder pattern
public class User {

    @Id
    @GeneratedValue
    private UUID id;        // Unique identifier for each user

    @Column(nullable = false)
    private String name;    // Full name of the user

    @Column(nullable = false, unique = true)
    private String email;   // Email used for login (Google or local)

    private String password; // Password (BCrypt hashed); nullable if Google login only

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;      // User role: STUDENT, LIBRARIAN, GLOBAL_ADMIN

    private String qrCodeUrl; // URL/path for the user's QR code (digital library card)

    @CreationTimestamp
    private LocalDateTime createdAt; // Auto-set when user is created

    private String googleId; // Google OAuth2 ID, nullable for local logins

    /**
     * A user can have multiple reservations (books borrowed or reserved).
     * One-to-Many relationship with Reservation entity.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

    /**
     * A user can have multiple fines.
     * One-to-Many relationship with Fine entity.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fine> fines;
}
