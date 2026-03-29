package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.RegistrationDto;
import com.webinarhub.platform.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Registration REST Controller.
 * Handles user registration for webinars.
 */
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    private Long extractUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            try {
                return Long.parseLong(token.substring(7));
            } catch (NumberFormatException e) {
                throw new com.webinarhub.platform.exception.BadRequestException("Invalid token format");
            }
        }
        throw new com.webinarhub.platform.exception.BadRequestException("Missing or invalid Authorization header");
    }

    /**
     * POST /api/registrations - Register for a webinar
     */
    @PostMapping
    public ResponseEntity<RegistrationDto> registerForWebinar(@RequestHeader(value = "Authorization", required = false) String token, @RequestParam("webinarId") Long webinarId) {
        Long userId = extractUserIdFromToken(token);
        RegistrationDto registration = registrationService.registerForWebinar(userId, webinarId);
        return new ResponseEntity<>(registration, HttpStatus.CREATED);
    }

    /**
     * GET /api/registrations/user/me - Get current user's registrations
     */
    @GetMapping("/user/me")
    public ResponseEntity<List<RegistrationDto>> getMyRegistrations(@RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = extractUserIdFromToken(token);
        List<RegistrationDto> registrations = registrationService.getRegistrationsByUserId(userId);
        return ResponseEntity.ok(registrations);
    }

    /**
     * GET /api/registrations/user/{userId} - Get registrations by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RegistrationDto>> getRegistrationsByUserId(@PathVariable("userId") Long userId) {
        List<RegistrationDto> registrations = registrationService.getRegistrationsByUserId(userId);
        return ResponseEntity.ok(registrations);
    }

    /**
     * GET /api/registrations/webinar/{webinarId} - Get webinar registrations
     */
    @GetMapping("/webinar/{webinarId}")
    public ResponseEntity<List<RegistrationDto>> getWebinarRegistrations(@PathVariable("webinarId") Long webinarId) {
        List<RegistrationDto> registrations = registrationService.getRegistrationsByWebinarId(webinarId);
        return ResponseEntity.ok(registrations);
    }

    /**
     * DELETE /api/registrations/{id} - Cancel registration
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelRegistration(@PathVariable("id") Long id) {
        registrationService.cancelRegistration(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration cancelled successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/registrations/{id}/attend - Mark attendance
     */
    @PutMapping("/{id}/attend")
    public ResponseEntity<RegistrationDto> markAttendance(@PathVariable("id") Long id) {
        RegistrationDto registration = registrationService.markAttendance(id);
        return ResponseEntity.ok(registration);
    }

    /**
     * GET /api/registrations/check - Check if user is registered
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkRegistration(@RequestHeader(value = "Authorization", required = false) String token, @RequestParam("webinarId") Long webinarId) {
        Long userId = extractUserIdFromToken(token);
        boolean isRegistered = registrationService.isUserRegistered(userId, webinarId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("registered", isRegistered);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/registrations/count/{webinarId} - Count registrations for webinar
     */
    @GetMapping("/count/{webinarId}")
    public ResponseEntity<Map<String, Long>> countRegistrations(@PathVariable("webinarId") Long webinarId) {
        Long count = registrationService.countByWebinarId(webinarId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
