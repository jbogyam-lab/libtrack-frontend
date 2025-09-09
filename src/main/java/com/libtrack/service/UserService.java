package com.libtrack.service;

import com.libtrack.dto.RegisterUserRequest;
import com.libtrack.dto.UserDTO;
import java.util.List;
import java.util.UUID;

/**
 * User service interface for managing users
 */
public interface UserService {
    UserDTO registerUser(RegisterUserRequest request); // Manual registration
    UserDTO getUserById(UUID userId);
    List<UserDTO> getAllUsers();
    void deleteUser(UUID userId);
}
