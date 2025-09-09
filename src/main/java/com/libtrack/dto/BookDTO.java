package com.libtrack.dto;

import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private UUID id;
    private String title;
    private String author;
    private String isbn;
    private int availableCopies;
    private int totalCopies;
    private String qrCodeUrl; // Link to book's QR code
    private String category;
    private String imageUrl;
}