package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.RegistrationDto;
import com.webinarhub.platform.entity.Registration;
import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.exception.BadRequestException;
import com.webinarhub.platform.exception.ResourceNotFoundException;
import com.webinarhub.platform.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for Registration-related business logic.
 * Demonstrates DI, service architecture, and transactional operations.
 */
@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserService userService;
    private final WebinarService webinarService;
    private final EmailService emailService;

    @Autowired
    public RegistrationService(RegistrationRepository registrationRepository,
                                UserService userService,
                                WebinarService webinarService,
                                EmailService emailService) {
        this.registrationRepository = registrationRepository;
        this.userService = userService;
        this.webinarService = webinarService;
        this.emailService = emailService;
    }

    /**
     * Register user for a webinar
     */
    @Transactional
    public RegistrationDto registerForWebinar(Long userId, Long webinarId) {
        // Check if already registered
        Optional<Registration> existing = registrationRepository.findByUserIdAndWebinarId(userId, webinarId);
        if (existing.isPresent()) {
            throw new BadRequestException("User is already registered for this webinar");
        }

        User user = userService.getUserEntityById(userId);
        Webinar webinar = webinarService.getWebinarEntityById(webinarId);

        // Check if webinar is full
        Long currentCount = registrationRepository.countByWebinarId(webinarId);
        if (currentCount >= webinar.getMaxParticipants()) {
            throw new BadRequestException("Webinar has reached maximum participants");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setWebinar(webinar);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setAttended(false);

        Registration saved = registrationRepository.save(registration);

        // Send confirmation email (non-blocking)
        try {
            emailService.sendRegistrationConfirmation(user.getEmail(), user.getName(), webinar.getTitle(), webinar.getDateTime());
        } catch (Exception e) {
            // Email failure should not prevent registration
            System.out.println("Email sending failed: " + e.getMessage());
        }

        return convertToDto(saved);
    }

    /**
     * Get all global registrations safely avoiding N+1 faults
     */
    @Transactional(readOnly = true)
    public List<RegistrationDto> getAllRegistrations() {
        try {
            List<Registration> registrations = registrationRepository.findAllWithDetails();
            if (registrations == null || registrations.isEmpty()) {
                return java.util.Collections.emptyList();
            }
            return registrations.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Database fetch error for registrations: " + e.getMessage());
            return java.util.Collections.emptyList();
        }
    }

    /**
     * Get registrations by user ID
     */
    @Transactional(readOnly = true)
    public List<RegistrationDto> getRegistrationsByUserId(Long userId) {
        return registrationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get registrations by webinar ID
     */
    @Transactional(readOnly = true)
    public List<RegistrationDto> getRegistrationsByWebinarId(Long webinarId) {
        return registrationRepository.findByWebinarId(webinarId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelRegistration(Long registrationId) {
        if (!registrationRepository.existsById(registrationId)) {
            throw new ResourceNotFoundException("Registration", registrationId);
        }
        registrationRepository.deleteById(registrationId);
    }

    /**
     * Cancel registration by user and webinar IDs
     */
    @Transactional
    public void cancelByUserAndWebinar(Long userId, Long webinarId) {
        Registration reg = registrationRepository.findByUserIdAndWebinarId(userId, webinarId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for this user and webinar"));
        registrationRepository.delete(reg);
    }

    /**
     * Mark attendance
     */
    public RegistrationDto markAttendance(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration", registrationId));
        registration.setAttended(true);
        Registration updated = registrationRepository.save(registration);
        return convertToDto(updated);
    }

    /**
     * Count registrations for a webinar
     */
    public Long countByWebinarId(Long webinarId) {
        return registrationRepository.countByWebinarId(webinarId);
    }

    @Transactional(readOnly = true)
    public boolean isUserRegistered(Long userId, Long webinarId) {
        return registrationRepository.findByUserIdAndWebinarId(userId, webinarId).isPresent();
    }

    /**
     * Get registration by user and webinar
     */
    @Transactional(readOnly = true)
    public Optional<RegistrationDto> getRegistrationByUserAndWebinar(Long userId, Long webinarId) {
        return registrationRepository.findByUserIdAndWebinarId(userId, webinarId)
                .map(this::convertToDto);
    }

    /**
     * Convert Registration entity to RegistrationDto
     */
    private RegistrationDto convertToDto(Registration registration) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(registration.getId());
        dto.setUserId(registration.getUser().getId());
        dto.setUserName(registration.getUser().getName());
        dto.setUserEmail(registration.getUser().getEmail());
        dto.setWebinarId(registration.getWebinar().getId());
        dto.setWebinarTitle(registration.getWebinar().getTitle());
        dto.setDateTime(registration.getWebinar().getDateTime());
        dto.setInstructorName(registration.getWebinar().getInstructor());
        dto.setWebinarStatus(registration.getWebinar().getStatus().name());
        dto.setRegisteredAt(registration.getRegisteredAt());
        dto.setAttended(registration.getAttended());
        return dto;
    }
}
