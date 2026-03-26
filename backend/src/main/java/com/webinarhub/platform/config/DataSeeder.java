package com.webinarhub.platform.config;

import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data Seeder — Seeds initial users with BCrypt-hashed passwords on application startup.
 * Demonstrates:
 * - CommandLineRunner interface (runs after ApplicationContext is loaded)
 * - PasswordEncoder for hashing passwords before storing in DB
 * - Conditional seeding (only inserts if users don't already exist)
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed Admin user with BCrypt-hashed password
        if (!userRepository.existsByEmail("admin@webinarhub.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@webinarhub.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(User.Role.ADMIN);
            admin.setOrganization("WebinarHub Inc");
            userRepository.save(admin);
            System.out.println("✅ Seeded admin user (admin@webinarhub.com / admin)");
        }

        // Seed regular user with BCrypt-hashed password
        if (!userRepository.existsByEmail("john@example.com")) {
            User user = new User();
            user.setName("John Doe");
            user.setEmail("john@example.com");
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(User.Role.USER);
            user.setOrganization("Acme Corp");
            userRepository.save(user);
            System.out.println("✅ Seeded regular user (john@example.com / password)");
        }
    }
}
