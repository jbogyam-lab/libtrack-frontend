package com.libtrack.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Represents a book in the library.
 * Each book can have a QR code for quick scanning.
 */
@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue
    private UUID id;            // Unique identifier for each book

    @Column(nullable = false)
    private String title;       // Book title

    @Column(nullable = false)
    private String author;      // Author's name

    @Column(nullable = false, unique = true)
    private String isbn;        // International Standard Book Number (unique)

    @Column(nullable = false)
    private int availableCopies; // Copies currently available to borrow

    @Column(nullable = false)
    private int totalCopies;     // Total copies in the library

    private String qrCodeUrl;    // URL/path of QR code image for this book

    private String category; 
    @Column(name = "image_url")
    private String imageUrl;// Optional: Fiction, Non-fiction, Science, etc.

    /**
     * The librarian who added this book to the system.
     * Many books can be added by one librarian.
     */
    @ManyToOne
    @JoinColumn(name = "added_by_user_id")
    private User addedBy;
}
