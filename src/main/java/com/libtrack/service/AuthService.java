package com.libtrack.service;

import com.libtrack.dto.LoginRequest;
import com.libtrack.dto.UserDTO;

public interface AuthService {

    /**
     * Authenticates a user using email and password.
     * Returns a JWT token if successful.
     */
    String loginManual(LoginRequest request);

    /**
     * Authenticates or registers a user using Google OAuth.
     * Returns a JWT token.
     */
    String loginGoogle(String email, String googleId, String name);

    /**
     * Retrieves user details by email.
     */
    UserDTO getUserDetails(String email);

    /**
     * Extracts user details from a JWT token.
     */
    UserDTO getUserFromToken(String token);
}