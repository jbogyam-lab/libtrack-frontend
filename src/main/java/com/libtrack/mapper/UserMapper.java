package com.libtrack.mapper;

import com.libtrack.dto.UserDTO;
import com.libtrack.entity.User;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between User entity and UserDTO.
 * 
 * - Converts sensitive entity data (like password) into safe DTO format.
 * - Supports mapping Entity -> DTO only for security reasons.
 */
@Component
public class UserMapper {

    /**
     * Converts a User entity to UserDTO.
     *
     * @param user the User entity
     * @return UserDTO or null if input is null
     */
    public UserDTO toDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .qrCodeUrl(user.getQrCodeUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
