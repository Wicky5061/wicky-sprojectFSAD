package com.webinarhub.platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller — specifically for keeping the Render free tier backend alive.
 * Provides a lightweight endpoint that returns 200 OK.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, String>> checkHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Server is running");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}
