package com.webinarhub.platform.config;

import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.repository.UserRepository;
import com.webinarhub.platform.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Data Seeder — Seeds initial users AND webinars on application startup.
 * Ensured it always checks if data exists before seeding, even if tables already exist.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WebinarRepository webinarRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(UserRepository userRepository,
                      WebinarRepository webinarRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.webinarRepository = webinarRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("🚀 [DataSeeder] Initializing database seeding check...");
        try {
            seedUsers();
            seedWebinars();
            System.out.println("✅ [DataSeeder] Initialization finished successfully.");
        } catch (Exception e) {
            System.err.println("❌ [DataSeeder] Error during seeding: " + e.getMessage());
        }
    }

    private void seedUsers() {
        System.out.println("👤 Checking user data...");
        // Ensure Master Admin exists
        if (!userRepository.existsByEmail("admin@webinarhub.com")) {
            User admin = new User();
            admin.setName("Vivek Vardhan");
            admin.setEmail("admin@webinarhub.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setOrganization("WebinarHub HQ");
            userRepository.save(admin);
            System.out.println("✅ Created Master Admin: admin@webinarhub.com / admin123");
        } else {
            // Update admin password to ensure access in production
            User admin = userRepository.findByEmail("admin@webinarhub.com").orElse(null);
            if (admin != null) {
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
                System.out.println("🔄 Updated existing admin password to 'admin123'");
            }
        }

        // Demo Student
        if (!userRepository.existsByEmail("demo@webinarhub.com")) {
            User student = new User();
            student.setName("Demo Student");
            student.setEmail("demo@webinarhub.com");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(User.Role.USER);
            student.setOrganization("Global Learning");
            userRepository.save(student);
            System.out.println("✅ Created Demo Student: demo@webinarhub.com / password123");
        }
    }

    private void seedWebinars() {
        System.out.println("📊 Checking webinar count...");
        if (webinarRepository.count() == 0) {
            System.out.println("🌱 No webinars found. Seeding high-quality demo data...");

            // 1. Full Stack Development
            Webinar w1 = new Webinar();
            w1.setTitle("Mastering Full Stack: React & Spring Boot");
            w1.setDescription("Build production-ready applications by combining the power of React for the frontend and Spring Boot for the backend. Covers JWT, REST APIs, and Cloud deployment.");
            w1.setInstructor("Dr. Wicky");
            w1.setDateTime(LocalDateTime.now().plusDays(3).withHour(18).withMinute(0));
            w1.setDurationMinutes(120);
            w1.setStreamUrl("https://meet.jit.si/webinarhub-master-fs");
            w1.setCoverImageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800");
            w1.setMaxParticipants(2500);
            w1.setCategory("Development");
            w1.setStatus(Webinar.WebinarStatus.UPCOMING);
            w1.setReminderSent(false);
            webinarRepository.save(w1);

            // 2. AWS Architecture
            Webinar w2 = new Webinar();
            w2.setTitle("AWS Architecture: Scalability & DevOps");
            w2.setDescription("Learn to design resilient, fault-tolerant architectures on Amazon Web Services. Essential for anyone preparing for the Solutions Architect certification.");
            w2.setInstructor("Viswa");
            w2.setDateTime(LocalDateTime.now().plusDays(7).withHour(10).withMinute(30));
            w2.setDurationMinutes(90);
            w2.setStreamUrl("https://meet.jit.si/webinarhub-aws-arch");
            w2.setCoverImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
            w2.setMaxParticipants(1500);
            w2.setCategory("Cloud");
            w2.setStatus(Webinar.WebinarStatus.UPCOMING);
            w2.setReminderSent(false);
            webinarRepository.save(w2);

            // 3. Generative AI
            Webinar w3 = new Webinar();
            w3.setTitle("AI & Generative Language Models");
            w3.setDescription("Dive deep into the mechanics of LLMs and Generative AI. Learn how to leverage prompt engineering and fine-tuning for your enterprise applications.");
            w3.setInstructor("Siddharth");
            w3.setDateTime(LocalDateTime.now().plusDays(1).withHour(14).withMinute(0));
            w3.setDurationMinutes(60);
            w3.setStreamUrl("https://meet.jit.si/webinarhub-ai-gen");
            w3.setCoverImageUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800");
            w3.setMaxParticipants(3000);
            w3.setCategory("AI");
            w3.setStatus(Webinar.WebinarStatus.LIVE);
            w3.setReminderSent(false);
            webinarRepository.save(w3);

            // 4. Cybersecurity
            Webinar w4 = new Webinar();
            w4.setTitle("Advanced Cybersecurity & Ethical Hacking");
            w4.setDescription("Protect your digital assets with advanced security techniques. Learn to identify vulnerabilities and defend against modern cyber threats.");
            w4.setInstructor("Sathwik");
            w4.setDateTime(LocalDateTime.now().minusDays(2).withHour(11).withMinute(0));
            w4.setDurationMinutes(120);
            w4.setStreamUrl("");
            w4.setCoverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800");
            w4.setMaxParticipants(1000);
            w4.setCategory("Security");
            w4.setStatus(Webinar.WebinarStatus.COMPLETED);
            w4.setReminderSent(true);
            webinarRepository.save(w4);

            System.out.println("✅ Seeded 4 high-quality webinars.");
        } else {
            System.out.println("ℹ️ Webinars already present (" + webinarRepository.count() + "). Skipping seeding.");
        }
    }
}
