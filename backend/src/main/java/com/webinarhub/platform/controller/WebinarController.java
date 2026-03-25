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
 * Webinar REST Controller.
 * Demonstrates:
 * - Full CRUD operations with REST API
 * - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
 * - @PathVariable and @RequestParam
 * - @RequestBody and @ResponseBody (implicit via @RestController)
 * - ResponseEntity with different HTTP status codes
 */
@RestController
@RequestMapping("/api/webinars")
public class WebinarController {

    private final WebinarService webinarService;

    @Autowired
    public WebinarController(WebinarService webinarService) {
        this.webinarService = webinarService;
    }

    /**
     * GET /api/webinars - Get all webinars
     */
    @GetMapping
    public ResponseEntity<List<WebinarDto>> getAllWebinars() {
        List<WebinarDto> webinars = webinarService.getAllWebinars();
        return ResponseEntity.ok(webinars);
    }

    /**
     * GET /api/webinars/{id} - Get webinar by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<WebinarDto> getWebinarById(@PathVariable Long id) {
        WebinarDto webinar = webinarService.getWebinarById(id);
        return ResponseEntity.ok(webinar);
    }

    /**
     * POST /api/webinars - Create a new webinar (Admin)
     */
    @PostMapping
    public ResponseEntity<WebinarDto> createWebinar(@RequestBody WebinarDto webinarDto) {
        WebinarDto created = webinarService.createWebinar(webinarDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/webinars/{id} - Update webinar (Admin)
     */
    @PutMapping("/{id}")
    public ResponseEntity<WebinarDto> updateWebinar(@PathVariable Long id, @RequestBody WebinarDto webinarDto) {
        WebinarDto updated = webinarService.updateWebinar(id, webinarDto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/webinars/{id} - Delete webinar (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteWebinar(@PathVariable Long id) {
        webinarService.deleteWebinar(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Webinar deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/webinars/search?title=... - Search webinars by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<WebinarDto>> searchWebinars(@RequestParam String title) {
        List<WebinarDto> webinars = webinarService.searchByTitle(title);
        return ResponseEntity.ok(webinars);
    }

    /**
     * GET /api/webinars/upcoming - Get upcoming webinars
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<WebinarDto>> getUpcomingWebinars() {
        List<WebinarDto> webinars = webinarService.getUpcomingWebinars();
        return ResponseEntity.ok(webinars);
    }

    /**
     * GET /api/webinars/category/{category} - Get webinars by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<WebinarDto>> getByCategory(@PathVariable String category) {
        List<WebinarDto> webinars = webinarService.getByCategory(category);
        return ResponseEntity.ok(webinars);
    }

    /**
     * GET /api/webinars/count - Count all webinars
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countWebinars() {
        Map<String, Long> count = new HashMap<>();
        count.put("total", webinarService.countAll());
        return ResponseEntity.ok(count);
    }

    /**
     * PUT /api/webinars/{id}/status - Update webinar status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        webinarService.updateStatus(id, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Webinar status updated to " + status);
        return ResponseEntity.ok(response);
    }
}
