package com.webinarhub.platform.exception;

/**
 * Custom exception for resource not found scenarios.
 * Used with @ControllerAdvice for global exception handling.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with id: " + id);
    }
}
