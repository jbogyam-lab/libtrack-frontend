package com.libtrack.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String qrCodeUrl;     // Optional QR for user
    private LocalDateTime createdAt;
}