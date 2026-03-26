package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.WebinarDto;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.exception.ResourceNotFoundException;
import com.webinarhub.platform.repository.WebinarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WebinarService.
 * Demonstrates:
 * - @ExtendWith(MockitoExtension.class) for Mockito integration with JUnit 5
 * - @Mock for creating mock dependencies
 * - @InjectMocks for injecting mocks into the service under test
 * - @BeforeEach for test setup
 * - @Test and @DisplayName for test methods
 * - Assertions: assertEquals, assertNotNull, assertThrows, assertTrue
 * - Mockito: when/thenReturn, verify, any()
 */
@ExtendWith(MockitoExtension.class)
class WebinarServiceTest {

    @Mock
    private WebinarRepository webinarRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private WebinarService webinarService;

    private Webinar sampleWebinar;
    private WebinarDto sampleDto;

    @BeforeEach
    void setUp() {
        // Create a sample Webinar entity for tests
        sampleWebinar = new Webinar();
        sampleWebinar.setId(1L);
        sampleWebinar.setTitle("Introduction to Spring Boot");
        sampleWebinar.setDescription("Learn the basics of Spring Boot framework");
        sampleWebinar.setInstructor("Dr. Test Instructor");
        sampleWebinar.setDateTime(LocalDateTime.of(2026, 4, 15, 14, 0));
        sampleWebinar.setDurationMinutes(90);
        sampleWebinar.setMaxParticipants(100);
        sampleWebinar.setCategory("Backend");
        sampleWebinar.setStatus(Webinar.WebinarStatus.UPCOMING);

        // Create corresponding DTO
        sampleDto = new WebinarDto();
        sampleDto.setId(1L);
        sampleDto.setTitle("Introduction to Spring Boot");
        sampleDto.setDescription("Learn the basics of Spring Boot framework");
        sampleDto.setInstructor("Dr. Test Instructor");
        sampleDto.setDurationMinutes(90);
        sampleDto.setMaxParticipants(100);
        sampleDto.setCategory("Backend");
        sampleDto.setStatus("UPCOMING");
    }

    @Test
    @DisplayName("Should return all webinars sorted by date descending")
    void getAllWebinars_ReturnsListOfWebinars() {
        // Arrange
        Webinar webinar2 = new Webinar();
        webinar2.setId(2L);
        webinar2.setTitle("React Fundamentals");
        webinar2.setStatus(Webinar.WebinarStatus.UPCOMING);

        when(webinarRepository.findAllByOrderByDateTimeDesc())
                .thenReturn(Arrays.asList(sampleWebinar, webinar2));
        when(modelMapper.map(any(Webinar.class), eq(WebinarDto.class)))
                .thenReturn(sampleDto);

        // Act
        List<WebinarDto> result = webinarService.getAllWebinars();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(webinarRepository, times(1)).findAllByOrderByDateTimeDesc();
    }

    @Test
    @DisplayName("Should return webinar by ID when it exists")
    void getWebinarById_ExistingId_ReturnsWebinar() {
        // Arrange
        when(webinarRepository.findById(1L)).thenReturn(Optional.of(sampleWebinar));
        when(modelMapper.map(sampleWebinar, WebinarDto.class)).thenReturn(sampleDto);

        // Act
        WebinarDto result = webinarService.getWebinarById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Introduction to Spring Boot", result.getTitle());
        assertEquals("Backend", result.getCategory());
        verify(webinarRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for non-existent webinar ID")
    void getWebinarById_NonExistentId_ThrowsException() {
        // Arrange
        when(webinarRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> webinarService.getWebinarById(999L));
        verify(webinarRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should create a new webinar successfully")
    void createWebinar_ValidData_ReturnsCreatedWebinar() {
        // Arrange
        WebinarDto inputDto = new WebinarDto();
        inputDto.setTitle("New Webinar");
        inputDto.setDescription("Test description");
        inputDto.setInstructor("Test Instructor");
        inputDto.setDateTime(LocalDateTime.of(2026, 5, 1, 10, 0));
        inputDto.setDurationMinutes(60);
        inputDto.setMaxParticipants(50);
        inputDto.setCategory("Testing");

        Webinar savedWebinar = new Webinar();
        savedWebinar.setId(10L);
        savedWebinar.setTitle("New Webinar");
        savedWebinar.setStatus(Webinar.WebinarStatus.UPCOMING);

        when(webinarRepository.save(any(Webinar.class))).thenReturn(savedWebinar);
        when(modelMapper.map(savedWebinar, WebinarDto.class)).thenReturn(sampleDto);

        // Act
        WebinarDto result = webinarService.createWebinar(inputDto);

        // Assert
        assertNotNull(result);
        verify(webinarRepository, times(1)).save(any(Webinar.class));
    }

    @Test
    @DisplayName("Should delete webinar when it exists")
    void deleteWebinar_ExistingId_DeletesSuccessfully() {
        // Arrange
        when(webinarRepository.existsById(1L)).thenReturn(true);
        doNothing().when(webinarRepository).deleteById(1L);

        // Act
        webinarService.deleteWebinar(1L);

        // Assert
        verify(webinarRepository, times(1)).existsById(1L);
        verify(webinarRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent webinar")
    void deleteWebinar_NonExistentId_ThrowsException() {
        // Arrange
        when(webinarRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> webinarService.deleteWebinar(999L));
        verify(webinarRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Should return webinars matching search title")
    void searchByTitle_MatchingTitle_ReturnsResults() {
        // Arrange
        when(webinarRepository.findByTitleContainingIgnoreCase("Spring"))
                .thenReturn(List.of(sampleWebinar));
        when(modelMapper.map(sampleWebinar, WebinarDto.class)).thenReturn(sampleDto);

        // Act
        List<WebinarDto> result = webinarService.searchByTitle("Spring");

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(webinarRepository, times(1)).findByTitleContainingIgnoreCase("Spring");
    }

    @Test
    @DisplayName("Should return empty list when no webinars match search")
    void searchByTitle_NoMatch_ReturnsEmptyList() {
        // Arrange
        when(webinarRepository.findByTitleContainingIgnoreCase("NonExistent"))
                .thenReturn(List.of());

        // Act
        List<WebinarDto> result = webinarService.searchByTitle("NonExistent");

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should return total webinar count")
    void countAll_ReturnsCorrectCount() {
        // Arrange
        when(webinarRepository.count()).thenReturn(5L);

        // Act
        Long count = webinarService.countAll();

        // Assert
        assertEquals(5L, count);
        verify(webinarRepository, times(1)).count();
    }

    @Test
    @DisplayName("Should update webinar fields correctly")
    void updateWebinar_ValidData_UpdatesFields() {
        // Arrange
        WebinarDto updateDto = new WebinarDto();
        updateDto.setTitle("Updated Title");
        updateDto.setDescription("Updated Description");

        when(webinarRepository.findById(1L)).thenReturn(Optional.of(sampleWebinar));
        when(webinarRepository.save(any(Webinar.class))).thenReturn(sampleWebinar);
        when(modelMapper.map(sampleWebinar, WebinarDto.class)).thenReturn(sampleDto);

        // Act
        WebinarDto result = webinarService.updateWebinar(1L, updateDto);

        // Assert
        assertNotNull(result);
        verify(webinarRepository, times(1)).findById(1L);
        verify(webinarRepository, times(1)).save(any(Webinar.class));
    }
}
