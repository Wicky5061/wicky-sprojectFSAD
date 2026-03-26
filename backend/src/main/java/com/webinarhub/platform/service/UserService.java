package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.LoginRequest;
import com.webinarhub.platform.dto.LoginResponse;
import com.webinarhub.platform.dto.RegisterRequest;
import com.webinarhub.platform.dto.UserDto;
import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.exception.BadRequestException;
import com.webinarhub.platform.exception.ResourceNotFoundException;
import com.webinarhub.platform.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for User-related business logic.
 * Demonstrates:
 * - @Service annotation (Spring component)
 * - @Autowired for Dependency Injection
 * - ModelMapper for DTO <-> Entity conversion
 * - DAO/Service architecture pattern
 */
@Service
public class UserService {

    // Dependency Injection via @Autowired (constructor injection)
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user
     */
    public UserDto registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Hash password with BCrypt before storing (never store plaintext!)
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setOrganization(request.getOrganization());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    /**
     * Login user
     */
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Verify password using BCrypt encoder.matches() instead of plaintext comparison
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        UserDto userDto = convertToDto(user);
        return new LoginResponse("Login successful", userDto);
    }

    /**
     * Get all users
     */
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return convertToDto(user);
    }

    /**
     * Get user entity by ID (internal use)
     */
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    /**
     * Search users by name
     */
    public List<UserDto> searchByName(String name) {
        return userRepository.searchByName(name)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Count users by role
     */
    public Long countByRole(String role) {
        return userRepository.countByRole(User.Role.valueOf(role.toUpperCase()));
    }

    /**
     * Convert User entity to UserDto using ModelMapper
     */
    private UserDto convertToDto(User user) {
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setRole(user.getRole().name());
        return dto;
    }
}
