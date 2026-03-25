package com.webinarhub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Resource entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto {

    private Long id;
    private String title;
    private String fileUrl;
    private String fileType;
    private String description;
    private LocalDateTime uploadedAt;
    private Long webinarId;
    private String webinarTitle;

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public Long getWebinarId() { return webinarId; }
    public void setWebinarId(Long webinarId) { this.webinarId = webinarId; }
    public String getWebinarTitle() { return webinarTitle; }
    public void setWebinarTitle(String webinarTitle) { this.webinarTitle = webinarTitle; }
}
