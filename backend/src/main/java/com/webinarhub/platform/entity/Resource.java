package com.webinarhub.platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Resource entity for post-event materials (recordings, slides, documents).
 * Demonstrates:
 * - @ManyToOne relationship (Resource -> Webinar)
 * - @JoinColumn foreign key mapping
 * - IDENTITY generator strategy
 */
@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType fileType;

    private String description;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    // Many Resources belong to One Webinar
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "webinar_id", nullable = false)
    private Webinar webinar;

    public enum ResourceType {
        VIDEO, PDF, SLIDE, DOCUMENT, LINK, OTHER
    }

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public ResourceType getFileType() { return fileType; }
    public void setFileType(ResourceType fileType) { this.fileType = fileType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public Webinar getWebinar() { return webinar; }
    public void setWebinar(Webinar webinar) { this.webinar = webinar; }
}
