package com.libtrack.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserRequest {
    private String name;      // Full name of user
    private String email;     // Unique email
    private String password;  // Optional (can be null if librarian registering)
    private String role;      // USER, LIBRARIAN, ADMIN
}