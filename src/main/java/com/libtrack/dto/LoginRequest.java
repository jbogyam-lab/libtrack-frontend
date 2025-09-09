package com.libtrack.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;     // User's email
    private String password;  // Plain password (hashed in backend)
}