package com.habittracker.dto.request;

import jakarta.validation.constraints.*;

public record UpdateProfileRequest(

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @Size(min = 8, message = "Password must be at least 8 characters")
    String password
) {}
