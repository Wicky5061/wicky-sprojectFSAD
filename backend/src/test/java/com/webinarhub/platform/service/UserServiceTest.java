package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.LoginRequest;
import com.webinarhub.platform.dto.LoginResponse;
import com.webinarhub.platform.dto.RegisterRequest;
import com.webinarhub.platform.dto.UserDto;
import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.exception.BadRequestException;
import com.webinarhub.platform.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 * Demonstrates:
 * - Testing authentication logic with mocked PasswordEncoder
 * - Testing registration with duplicate email validation
 * - Testing login with BCrypt password verification
 * - Exception testing with assertThrows
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;
    private UserDto sampleUserDto;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Test User");
        sampleUser.setEmail("test@example.com");
        sampleUser.setPassword("$2a$10$hashedPasswordValue");  // Simulated BCrypt hash
        sampleUser.setRole(User.Role.USER);
        sampleUser.setOrganization("Test Org");

        sampleUserDto = new UserDto();
        sampleUserDto.setId(1L);
        sampleUserDto.setName("Test User");
        sampleUserDto.setEmail("test@example.com");
        sampleUserDto.setRole("USER");
    }

    @Test
    @DisplayName("Should register a new user with hashed password")
    void registerUser_ValidData_ReturnsUserDto() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("New User");
        request.setEmail("new@example.com");
        request.setPassword("plainPassword123");
        request.setPhone("1234567890");
        request.setOrganization("New Org");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword123")).thenReturn("$2a$10$encodedHash");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(modelMapper.map(any(User.class), eq(UserDto.class))).thenReturn(sampleUserDto);

        // Act
        UserDto result = userService.registerUser(request);

        // Assert
        assertNotNull(result);
        assertEquals("Test User", result.getName());
        verify(passwordEncoder, times(1)).encode("plainPassword123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when registering with existing email")
    void registerUser_DuplicateEmail_ThrowsException() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> userService.registerUser(request));

        assertTrue(exception.getMessage().contains("already registered"));
        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    @DisplayName("Should login successfully with correct credentials")
    void loginUser_ValidCredentials_ReturnsLoginResponse() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("correctPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("correctPassword", sampleUser.getPassword())).thenReturn(true);
        when(modelMapper.map(sampleUser, UserDto.class)).thenReturn(sampleUserDto);

        // Act
        LoginResponse response = userService.loginUser(request);

        // Assert
        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        verify(passwordEncoder, times(1)).matches("correctPassword", sampleUser.getPassword());
    }

    @Test
    @DisplayName("Should throw exception when logging in with wrong password")
    void loginUser_WrongPassword_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", sampleUser.getPassword())).thenReturn(false);

        // Act & Assert
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> userService.loginUser(request));

        assertTrue(exception.getMessage().contains("Invalid email or password"));
    }

    @Test
    @DisplayName("Should throw exception when logging in with non-existent email")
    void loginUser_NonExistentEmail_ThrowsException() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("nobody@example.com");
        request.setPassword("anyPassword");

        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BadRequestException.class,
                () -> userService.loginUser(request));

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Should return user by ID when user exists")
    void getUserById_ExistingId_ReturnsUserDto() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(modelMapper.map(sampleUser, UserDto.class)).thenReturn(sampleUserDto);

        // Act
        UserDto result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
    }
}
