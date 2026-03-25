package com.webinarhub.platform.exception;

/**
 * Custom exception for bad request scenarios.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
