package com.habittracker.controller;

import com.habittracker.dto.request.UpdateProfileRequest;
import com.habittracker.dto.response.UserResponse;
import com.habittracker.model.User;
import com.habittracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for user profile management.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User profile endpoints")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get the authenticated user's profile")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @Operation(summary = "Update the authenticated user's name or password")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
        @Valid @RequestBody UpdateProfileRequest request,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(userService.updateProfile(request, user));
    }
}
