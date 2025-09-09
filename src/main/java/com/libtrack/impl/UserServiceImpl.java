package com.libtrack.impl;

import com.libtrack.dto.RegisterUserRequest;
import com.libtrack.dto.UserDTO;
import com.libtrack.entity.Role;
import com.libtrack.entity.User;
import com.libtrack.mapper.UserMapper;
import com.libtrack.repository.UserRepository;
import com.libtrack.service.UserService;
import com.libtrack.util.QrUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final QrUtils qrUtils; // ✅ Inject QrUtils
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDTO registerUser(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : null)
                .role(role)
                .build();

        // Save to get UUID
        User savedUser = userRepository.save(user);

        try {
            // Generate QR code for this user
            String qrPath = qrUtils.generateQRCodeImage(
                    "USER:" + savedUser.getId(),
                    "user-" + savedUser.getId(),
                    250,
                    250
            );
            savedUser.setQrCodeUrl(qrPath);
            savedUser = userRepository.save(savedUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code for user: " + savedUser.getId(), e);
        }

        return userMapper.toDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return userMapper.toDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
