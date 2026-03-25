package com.webinarhub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Webinar entity.
 * Used for transferring webinar data between layers without exposing JPA entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebinarDto {

    private Long id;
    private String title;
    private String description;
    private String instructor;
    private LocalDateTime dateTime;
    private Integer durationMinutes;
    private String status;
    private String streamUrl;
    private String coverImageUrl;
    private Integer maxParticipants;
    private String category;
    private Integer registrationCount;

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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStreamUrl() { return streamUrl; }
    public void setStreamUrl(String streamUrl) { this.streamUrl = streamUrl; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getRegistrationCount() { return registrationCount; }
    public void setRegistrationCount(Integer registrationCount) { this.registrationCount = registrationCount; }
}
