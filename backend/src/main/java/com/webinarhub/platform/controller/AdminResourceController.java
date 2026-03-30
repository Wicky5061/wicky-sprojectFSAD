package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.ResourceDto;
import com.webinarhub.platform.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin Resource REST Controller.
 * Handles resource management tasks under /api/admin/resources.
 */
@RestController
@RequestMapping("/api/admin/resources")
public class AdminResourceController {

    private final ResourceService resourceService;

    @Autowired
    public AdminResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * POST /api/admin/resources - Add a resource (Admin)
     */
    @PostMapping
    public ResponseEntity<ResourceDto> addResource(@RequestBody ResourceDto resourceDto) {
        ResourceDto created = resourceService.addResource(resourceDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * DELETE /api/admin/resources/{id} - Delete resource (Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Resource deleted successfully");
        return ResponseEntity.ok(response);
    }
}
