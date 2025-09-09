package com.libtrack.controller;

import com.libtrack.dto.LoginRequest;
import com.libtrack.dto.RegisterUserRequest;
import com.libtrack.dto.UserDTO;
import com.libtrack.service.AuthService;
import com.libtrack.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // Manual login - returns JWT
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.loginManual(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // Google login - returns JWT
    @PostMapping("/login/google")
    public ResponseEntity<AuthResponse> loginGoogle(@RequestParam String email,
                                                    @RequestParam String googleId,
                                                    @RequestParam String name) {
        String token = authService.loginGoogle(email, googleId, name);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterUserRequest request) {
        UserDTO user = userService.registerUser(request);
        return ResponseEntity.ok(user);
    }

    // Get current user from JWT
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDTO user = authService.getUserFromToken(token);
        return ResponseEntity.ok(user);
    }

    // Simple record class for returning JWT
    private record AuthResponse(String token) {}
}
