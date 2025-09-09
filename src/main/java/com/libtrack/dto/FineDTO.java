package com.libtrack.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FineDTO {
    private UUID id;
    private double amount;
    private String status;        // PENDING or PAID
    private LocalDateTime calculatedOn;
    private LocalDateTime paidOn;
    private UUID userId;
    private UUID reservationId;   // Optional, fine may not be linked to a specific reservation
}