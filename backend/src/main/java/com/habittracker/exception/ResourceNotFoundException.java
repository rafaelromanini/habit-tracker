package com.habittracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested resource is not found.
 * Maps to HTTP 404.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException habit(java.util.UUID id) {
        return new ResourceNotFoundException("Habit not found with id: " + id);
    }

    public static ResourceNotFoundException user(java.util.UUID id) {
        return new ResourceNotFoundException("User not found with id: " + id);
    }

    public static ResourceNotFoundException day(java.time.LocalDate date) {
        return new ResourceNotFoundException("Day not found for date: " + date);
    }
}
