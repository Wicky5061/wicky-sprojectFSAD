package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.LoginRequest;
import com.webinarhub.platform.dto.LoginResponse;
import com.webinarhub.platform.dto.RegisterRequest;
import com.webinarhub.platform.dto.UserDto;
import com.webinarhub.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST Controller.
 * Demonstrates:
 * - @RestController (combines @Controller + @ResponseBody)
 * - @RequestMapping for base URL
 * - @PostMapping for HTTP POST method mapping
 * - @RequestBody for deserializing JSON request body
 * - ResponseEntity for HTTP response with status code
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/auth/register
     * Register a new user - @RequestBody receives JSON, ResponseEntity sends response
     */
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        UserDto user = userService.registerUser(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    /**
     * POST /api/auth/login
     * Login user - @RequestBody receives credentials
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }
}
