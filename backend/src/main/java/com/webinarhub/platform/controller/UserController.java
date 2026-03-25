package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.UserDto;
import com.webinarhub.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User REST Controller.
 * Admin endpoints for user management.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/users - Get all users (Admin)
     */
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id} - Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * GET /api/users/search?name=... - Search users by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String name) {
        List<UserDto> users = userService.searchByName(name);
        return ResponseEntity.ok(users);
    }
}
