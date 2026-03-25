package com.webinarhub.platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Registration entity - join table between User and Webinar.
 * Demonstrates:
 * - @ManyToOne relationships (Registration -> User, Registration -> Webinar)
 * - @JoinColumn for foreign key mapping
 * - FetchType.LAZY and FetchType.EAGER
 * - IDENTITY generator strategy for MySQL
 */
@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many Registrations belong to One User
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many Registrations belong to One Webinar
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "webinar_id", nullable = false)
    private Webinar webinar;

    @Column(nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    private Boolean attended = false;

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Webinar getWebinar() { return webinar; }
    public void setWebinar(Webinar webinar) { this.webinar = webinar; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
    public Boolean getAttended() { return attended; }
    public void setAttended(Boolean attended) { this.attended = attended; }
}
