package com.webinarhub.platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Webinar entity mapped to 'webinars' table.
 * Demonstrates:
 * - JPA Entity with Hibernate ORM
 * - @GeneratedValue with IDENTITY strategy (MySQL auto-increment)
 * - @OneToMany relationships (to Registration and Resource)
 * - CascadeType.ALL for cascading operations
 * - FetchType.LAZY for performance optimization
 * - @Column constraints (nullable, length)
 */
@Entity
@Table(name = "webinars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Webinar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String instructor;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WebinarStatus status = WebinarStatus.UPCOMING;

    private String streamUrl;

    private String coverImageUrl;

    @Column(nullable = false)
    private Integer maxParticipants = 100;

    private String category;

    // One Webinar can have Many Registrations
    @OneToMany(mappedBy = "webinar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Registration> registrations = new ArrayList<>();

    // One Webinar can have Many Resources
    @OneToMany(mappedBy = "webinar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resource> resources = new ArrayList<>();

    public enum WebinarStatus {
        UPCOMING, LIVE, COMPLETED, CANCELLED
    }

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public WebinarStatus getStatus() { return status; }
    public void setStatus(WebinarStatus status) { this.status = status; }
    public String getStreamUrl() { return streamUrl; }
    public void setStreamUrl(String streamUrl) { this.streamUrl = streamUrl; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<Registration> getRegistrations() { return registrations; }
    public void setRegistrations(List<Registration> registrations) { this.registrations = registrations; }
    public List<Resource> getResources() { return resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }
}
