package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.ResourceDto;
import com.webinarhub.platform.entity.Resource;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.exception.ResourceNotFoundException;
import com.webinarhub.platform.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing post-event resources (recordings, slides, etc.).
 */
@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final WebinarService webinarService;

    @Autowired
    public ResourceService(ResourceRepository resourceRepository,
                            WebinarService webinarService) {
        this.resourceRepository = resourceRepository;
        this.webinarService = webinarService;
    }

    /**
     * Add a resource to a webinar (Admin)
     */
    public ResourceDto addResource(ResourceDto resourceDto) {
        Webinar webinar = webinarService.getWebinarEntityById(resourceDto.getWebinarId());

        Resource resource = new Resource();
        resource.setTitle(resourceDto.getTitle());
        resource.setFileUrl(resourceDto.getFileUrl());
        resource.setFileType(Resource.ResourceType.valueOf(resourceDto.getFileType()));
        resource.setDescription(resourceDto.getDescription());
        resource.setUploadedAt(LocalDateTime.now());
        resource.setWebinar(webinar);

        Resource saved = resourceRepository.save(resource);
        return convertToDto(saved);
    }

    /**
     * Get resources by webinar ID
     */
    public List<ResourceDto> getResourcesByWebinarId(Long webinarId) {
        return resourceRepository.findByWebinarId(webinarId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Delete a resource (Admin)
     */
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource", id);
        }
        resourceRepository.deleteById(id);
    }

    /**
     * Get resource by ID
     */
    public ResourceDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));
        return convertToDto(resource);
    }

    /**
     * Convert Resource entity to ResourceDto
     */
    private ResourceDto convertToDto(Resource resource) {
        ResourceDto dto = new ResourceDto();
        dto.setId(resource.getId());
        dto.setTitle(resource.getTitle());
        dto.setFileUrl(resource.getFileUrl());
        dto.setFileType(resource.getFileType().name());
        dto.setDescription(resource.getDescription());
        dto.setUploadedAt(resource.getUploadedAt());
        dto.setWebinarId(resource.getWebinar().getId());
        dto.setWebinarTitle(resource.getWebinar().getTitle());
        return dto;
    }
}
