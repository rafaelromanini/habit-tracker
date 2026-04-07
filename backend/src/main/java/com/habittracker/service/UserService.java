package com.habittracker.service;

import com.habittracker.dto.request.UpdateProfileRequest;
import com.habittracker.dto.response.UserResponse;
import com.habittracker.model.User;
import com.habittracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles user profile operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Returns the profile of the authenticated user.
     */
    @Transactional(readOnly = true)
    public UserResponse getProfile(User user) {
        return toUserResponse(user);
    }

    /**
     * Updates name and/or password for the authenticated user.
     * Only updates fields that are not null.
     */
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request, User user) {
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        userRepository.save(user);
        log.info("Profile updated for user: {}", user.getEmail());

        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }
}
