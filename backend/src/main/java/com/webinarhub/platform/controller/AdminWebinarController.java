package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.WebinarDto;
import com.webinarhub.platform.service.WebinarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Webinar REST Controller.
 * Handles management tasks under /api/admin/webinars.
 */
@RestController
@RequestMapping("/api/admin/webinars")
public class AdminWebinarController {

    private final WebinarService webinarService;

    @Autowired
    public AdminWebinarController(WebinarService webinarService) {
        this.webinarService = webinarService;
    }

    /**
     * GET /api/admin/webinars - Get all webinars for administration
     */
    @GetMapping
    public ResponseEntity<List<WebinarDto>> getAllWebinars() {
        List<WebinarDto> webinars = webinarService.getAllWebinars();
        return ResponseEntity.ok(webinars);
    }

    /**
     * POST /api/admin/webinars - Create a new webinar (Admin)
     */
    @PostMapping
    public ResponseEntity<WebinarDto> createWebinar(@RequestBody WebinarDto webinarDto) {
        WebinarDto created = webinarService.createWebinar(webinarDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/admin/webinars/{id} - Update webinar (Admin)
     */
    @PutMapping("/{id}")
    public ResponseEntity<WebinarDto> updateWebinar(@PathVariable Long id, @RequestBody WebinarDto webinarDto) {
        WebinarDto updated = webinarService.updateWebinar(id, webinarDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/webinars/{id} - Delete webinar (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteWebinar(@PathVariable Long id) {
        webinarService.deleteWebinar(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Webinar deleted successfully");
        return ResponseEntity.ok(response);
    }
}
