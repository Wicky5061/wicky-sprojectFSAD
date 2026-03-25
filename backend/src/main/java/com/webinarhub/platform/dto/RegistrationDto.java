package com.webinarhub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Registration entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDto {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long webinarId;
    private String webinarTitle;
    private LocalDateTime registeredAt;
    private Boolean attended;

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Long getWebinarId() { return webinarId; }
    public void setWebinarId(Long webinarId) { this.webinarId = webinarId; }
    public String getWebinarTitle() { return webinarTitle; }
    public void setWebinarTitle(String webinarTitle) { this.webinarTitle = webinarTitle; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
    public Boolean getAttended() { return attended; }
    public void setAttended(Boolean attended) { this.attended = attended; }
}
