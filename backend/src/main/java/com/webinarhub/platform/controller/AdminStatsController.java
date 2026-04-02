package com.webinarhub.platform.controller;

import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.repository.RegistrationRepository;
import com.webinarhub.platform.repository.UserRepository;
import com.webinarhub.platform.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin Stats REST Controller.
 * Provides platform-wide statistics for the admin dashboard.
 */
@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final WebinarRepository webinarRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    @Autowired
    public AdminStatsController(WebinarRepository webinarRepository,
                                UserRepository userRepository,
                                RegistrationRepository registrationRepository) {
        this.webinarRepository = webinarRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }

    /**
     * GET /api/admin/stats - Get platform-wide statistics
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalWebinars", webinarRepository.count());
            stats.put("totalUsers", userRepository.count());
            stats.put("totalRegistrations", registrationRepository.count());
            stats.put("liveWebinars", webinarRepository.countByStatus(Webinar.WebinarStatus.LIVE));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("totalWebinars", 0);
            fallback.put("totalUsers", 0);
            fallback.put("totalRegistrations", 0);
            fallback.put("liveWebinars", 0);
            return ResponseEntity.ok(fallback);
        }
    }
}
