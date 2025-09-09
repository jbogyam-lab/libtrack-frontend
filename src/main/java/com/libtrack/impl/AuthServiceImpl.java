package com.libtrack.impl;

import com.libtrack.dto.LoginRequest;
import com.libtrack.dto.RegisterUserRequest;
import com.libtrack.dto.UserDTO;
import com.libtrack.entity.Role;
import com.libtrack.entity.User;
import com.libtrack.mapper.UserMapper;
import com.libtrack.repository.UserRepository;
import com.libtrack.service.AuthService;
import com.libtrack.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public String loginManual(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = optionalUser.get();
        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    @Override
    public String loginGoogle(String email, String googleId, String name) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            if (!googleId.equals(user.getGoogleId())) {
                throw new IllegalArgumentException("Google ID mismatch");
            }
        } else {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .googleId(googleId)
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(user);
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    @Override
    public UserDTO getUserDetails(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO getUserFromToken(String token) {
        String email = jwtUtil.extractEmail(token);
        return getUserDetails(email);
    }
}