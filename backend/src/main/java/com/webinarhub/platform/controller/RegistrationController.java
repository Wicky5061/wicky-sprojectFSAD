package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.RegistrationDto;
import com.webinarhub.platform.exception.BadRequestException;
import com.webinarhub.platform.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
                throw new BadRequestException("Invalid token format");
            }
        }
        throw new BadRequestException("Missing or invalid Authorization header");
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelRegistration(@PathVariable("id") Long id) {
        registrationService.cancelRegistration(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration cancelled successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/registrations/cancel/{webinarId} - Cancel registration by webinar ID
     */
    @PostMapping("/cancel/{webinarId}")
    public ResponseEntity<Map<String, String>> cancelByWebinarId(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable("webinarId") Long webinarId) {
        Long userId = extractUserIdFromToken(token);
        registrationService.cancelByUserAndWebinar(userId, webinarId);
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

    @GetMapping("/check/{webinarId}")
    public ResponseEntity<Map<String, Object>> checkRegistration(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable("webinarId") Long webinarId) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || !token.startsWith("Bearer ")) {
            response.put("registered", false);
            return ResponseEntity.ok(response);
        }

        try {
            Long userId = extractUserIdFromToken(token);
            Optional<RegistrationDto> registration = registrationService.getRegistrationByUserAndWebinar(userId, webinarId);
            
            response.put("registered", registration.isPresent());
            registration.ifPresent(reg -> response.put("id", reg.getId()));
        } catch (Exception e) {
            response.put("registered", false);
            response.put("error", "Session expired or invalid");
        }
        
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
