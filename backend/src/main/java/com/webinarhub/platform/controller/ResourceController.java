package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.ResourceDto;
import com.webinarhub.platform.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Resource REST Controller.
 * Manages post-event resources (recordings, slides, documents).
 */
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * POST /api/resources - Add a resource (Admin)
     */
    @PostMapping
    public ResponseEntity<ResourceDto> addResource(@RequestBody ResourceDto resourceDto) {
        ResourceDto created = resourceService.addResource(resourceDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * GET /api/resources/webinar/{webinarId} - Get resources for a webinar
     */
    @GetMapping("/webinar/{webinarId}")
    public ResponseEntity<List<ResourceDto>> getWebinarResources(@PathVariable Long webinarId) {
        List<ResourceDto> resources = resourceService.getResourcesByWebinarId(webinarId);
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/{id} - Get resource by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResourceById(@PathVariable Long id) {
        ResourceDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * DELETE /api/resources/{id} - Delete resource (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Resource deleted successfully");
        return ResponseEntity.ok(response);
    }
}
