package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.WebinarDto;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.exception.ResourceNotFoundException;
import com.webinarhub.platform.repository.WebinarRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Webinar-related business logic.
 * Demonstrates DAO/Service architecture, DI, and ModelMapper usage.
 */
@Service
public class WebinarService {

    private final WebinarRepository webinarRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public WebinarService(WebinarRepository webinarRepository, ModelMapper modelMapper) {
        this.webinarRepository = webinarRepository;
        this.modelMapper = modelMapper;
    }

    /**
     * Create a new webinar (Admin only)
     */
    public WebinarDto createWebinar(WebinarDto webinarDto) {
        Webinar webinar = new Webinar();
        webinar.setTitle(webinarDto.getTitle());
        webinar.setDescription(webinarDto.getDescription());
        webinar.setInstructor(webinarDto.getInstructor());
        webinar.setDateTime(webinarDto.getDateTime());
        webinar.setDurationMinutes(webinarDto.getDurationMinutes());
        webinar.setStreamUrl(webinarDto.getStreamUrl());
        webinar.setCoverImageUrl(webinarDto.getCoverImageUrl());
        webinar.setMaxParticipants(webinarDto.getMaxParticipants() != null ? webinarDto.getMaxParticipants() : 100);
        webinar.setCategory(webinarDto.getCategory());
        webinar.setStatus(Webinar.WebinarStatus.UPCOMING);

        Webinar saved = webinarRepository.save(webinar);
        return convertToDto(saved);
    }

    /**
     * Get all webinars
     */
    @Transactional(readOnly = true)
    public List<WebinarDto> getAllWebinars() {
        return webinarRepository.findAllByOrderByDateTimeDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get webinar by ID
     */
    @Transactional(readOnly = true)
    public WebinarDto getWebinarById(Long id) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webinar", id));
        return convertToDto(webinar);
    }

    /**
     * Get webinar entity by ID (internal use)
     */
    @Transactional(readOnly = true)
    public Webinar getWebinarEntityById(Long id) {
        return webinarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webinar", id));
    }

    /**
     * Update webinar (Admin only)
     */
    public WebinarDto updateWebinar(Long id, WebinarDto webinarDto) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webinar", id));

        if (webinarDto.getTitle() != null) webinar.setTitle(webinarDto.getTitle());
        if (webinarDto.getDescription() != null) webinar.setDescription(webinarDto.getDescription());
        if (webinarDto.getInstructor() != null) webinar.setInstructor(webinarDto.getInstructor());
        if (webinarDto.getDateTime() != null) webinar.setDateTime(webinarDto.getDateTime());
        if (webinarDto.getDurationMinutes() != null) webinar.setDurationMinutes(webinarDto.getDurationMinutes());
        if (webinarDto.getStreamUrl() != null) webinar.setStreamUrl(webinarDto.getStreamUrl());
        if (webinarDto.getCoverImageUrl() != null) webinar.setCoverImageUrl(webinarDto.getCoverImageUrl());
        if (webinarDto.getMaxParticipants() != null) webinar.setMaxParticipants(webinarDto.getMaxParticipants());
        if (webinarDto.getCategory() != null) webinar.setCategory(webinarDto.getCategory());
        if (webinarDto.getStatus() != null) webinar.setStatus(Webinar.WebinarStatus.valueOf(webinarDto.getStatus()));

        Webinar updated = webinarRepository.save(webinar);
        return convertToDto(updated);
    }

    /**
     * Delete webinar (Admin only)
     */
    @Transactional
    public void deleteWebinar(Long id) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Webinar", id));
        webinarRepository.delete(webinar);
    }

    /**
     * Get upcoming webinars
     */
    @Transactional(readOnly = true)
    public List<WebinarDto> getUpcomingWebinars() {
        return webinarRepository.findUpcomingWebinars(LocalDateTime.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Search webinars by title
     */
    @Transactional(readOnly = true)
    public List<WebinarDto> searchByTitle(String title) {
        return webinarRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get webinars by category
     */
    @Transactional(readOnly = true)
    public List<WebinarDto> getByCategory(String category) {
        return webinarRepository.findByCategory(category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Count webinars by status
     */
    public Long countByStatus(String status) {
        return webinarRepository.countByStatus(Webinar.WebinarStatus.valueOf(status.toUpperCase()));
    }

    /**
     * Update webinar status
     */
    @Transactional
    public void updateStatus(Long id, String status) {
        webinarRepository.updateStatusById(id, Webinar.WebinarStatus.valueOf(status.toUpperCase()));
    }

    /**
     * Count total webinars
     */
    public Long countAll() {
        return webinarRepository.count();
    }

    /**
     * Convert Webinar entity to WebinarDto
     */
    private WebinarDto convertToDto(Webinar webinar) {
        WebinarDto dto = modelMapper.map(webinar, WebinarDto.class);
        dto.setStatus(webinar.getStatus().name());
        dto.setRegistrationCount(webinar.getRegistrations() != null ? webinar.getRegistrations().size() : 0);
        return dto;
    }
}
