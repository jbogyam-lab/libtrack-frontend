package com.libtrack.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDTO {
    private UUID id;
    private String status;        // RESERVED, BORROWED, RETURNED
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private UUID userId;
    private UUID bookId;
}