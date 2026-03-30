package com.webinarhub.platform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security Configuration.
 * Demonstrates:
 * - @EnableWebSecurity for enabling Spring Security
 * - SecurityFilterChain for configuring HTTP security
 * - BCryptPasswordEncoder for password hashing
 * - Stateless session management (no server-side sessions)
 * - CSRF disabled for REST API usage
 *
 * All endpoints are permitted (no role-based access control at API level).
 * Auth is handled via the custom Bearer token mechanism in controllers.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * SecurityFilterChain — permits all API requests.
     * CSRF is disabled because this is a stateless REST API consumed by a React SPA.
     * CORS is handled by the existing CorsConfig bean.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})  // Delegate to CorsConfig bean
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * BCryptPasswordEncoder bean for secure password hashing.
     * BCrypt uses a random salt and configurable cost factor (default 10 rounds).
     * This replaces the plaintext password storage used previously.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
