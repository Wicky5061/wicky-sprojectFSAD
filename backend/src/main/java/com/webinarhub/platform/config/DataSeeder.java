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
 * Updated to properly seed the live database with specific requirements.
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
        System.out.println("🚀 Starting Database Seeding Process...");
        seedUsers();
        seedWebinars();
        System.out.println("✅ Seeding process completed successfully!");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@webinarhub.com")) {
            User admin = new User();
            admin.setName("Master Admin");
            admin.setEmail("admin@webinarhub.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setOrganization("WebinarHub Global");
            userRepository.save(admin);
            System.out.println("✅ Seeded Master Admin user (admin@webinarhub.com / admin123)");
        } else {
            // Update existing admin password to admin123 just in case
            User admin = userRepository.findByEmail("admin@webinarhub.com").orElse(null);
            if (admin != null) {
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
                System.out.println("🔄 Updated existing admin password to 'admin123'");
            }
        }

        if (!userRepository.existsByEmail("demo@example.com")) {
            User user = new User();
            user.setName("Demo User");
            user.setEmail("demo@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(User.Role.USER);
            user.setOrganization("Acme Learning");
            userRepository.save(user);
            System.out.println("✅ Seeded regular user (demo@example.com / password123)");
        }
    }

    private void seedWebinars() {
        // Only seed if webinar table is empty (avoid duplicates in live DB)
        if (webinarRepository.count() > 0) {
            System.out.println("ℹ️ Webinars already exist in database — skipping webinar seeding.");
            return;
        }

        // 1. React Full Stack
        Webinar w1 = new Webinar();
        w1.setTitle("React Full Stack Mastery: From Zero to Hero");
        w1.setDescription("Master the complete React ecosystem including hooks, context API, and advanced state management with Redux. Build a real-world project connected to a Spring Boot backend, covering authentication, RESTful APIs, and deployment strategies.");
        w1.setInstructor("Sarah Johnson");
        w1.setDateTime(LocalDateTime.now().plusDays(5).withHour(15).withMinute(0));
        w1.setDurationMinutes(120);
        w1.setStreamUrl("https://meet.jit.si/webinarhub-react-fullstack");
        w1.setCoverImageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800");
        w1.setMaxParticipants(2000);
        w1.setCategory("Development");
        w1.setStatus(Webinar.WebinarStatus.UPCOMING);
        w1.setReminderSent(false); // Explicitly handle new field
        webinarRepository.save(w1);

        // 2. AWS Cloud Computing
        Webinar w2 = new Webinar();
        w2.setTitle("AWS Cloud Computing Architecture & DevOps");
        w2.setDescription("Learn to architect scalable and reliable applications on Amazon Web Services. We will cover core services like EC2, S3, Lambda, and RDS, along with CI/CD pipelines using AWS CodePipeline and infrastructure as code with CloudFormation.");
        w2.setInstructor("Michael Chen");
        w2.setDateTime(LocalDateTime.now().plusDays(10).withHour(10).withMinute(0));
        w2.setDurationMinutes(90);
        w2.setStreamUrl("https://meet.jit.si/webinarhub-aws-cloud");
        w2.setCoverImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
        w2.setMaxParticipants(1500);
        w2.setCategory("Cloud");
        w2.setStatus(Webinar.WebinarStatus.UPCOMING);
        w2.setReminderSent(false);
        webinarRepository.save(w2);

        // 3. AI Fundamentals
        Webinar w3 = new Webinar();
        w3.setTitle("AI Fundamentals: Generative AI and Beyond");
        w3.setDescription("Explore the world of Artificial Intelligence. From basic machine learning concepts to modern Large Language Models and Generative AI. Understand how to integrate AI into your products and the ethical implications of AI development.");
        w3.setInstructor("Dr. Alan Turing");
        w3.setDateTime(LocalDateTime.now().plusDays(2).withHour(14).withMinute(0));
        w3.setDurationMinutes(60);
        w3.setStreamUrl("https://meet.jit.si/webinarhub-ai-fundamentals");
        w3.setCoverImageUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800");
        w3.setMaxParticipants(3000);
        w3.setCategory("AI");
        w3.setStatus(Webinar.WebinarStatus.LIVE);
        w3.setReminderSent(false);
        webinarRepository.save(w3);

        // 4. Cybersecurity Essentials (Completed)
        Webinar w4 = new Webinar();
        w4.setTitle("Enterprise Cybersecurity Essentials");
        w4.setDescription("A comprehensive guide to protecting modern web applications. Topics include OWASP Top 10, JWT security, SSL/TLS, and penetration testing basics. Learn how to secure your infrastructure against sophisticated cyber attacks.");
        w4.setInstructor("Alex Williams");
        w4.setDateTime(LocalDateTime.now().minusDays(5).withHour(11).withMinute(0));
        w4.setDurationMinutes(90);
        w4.setStreamUrl("");
        w4.setCoverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800");
        w4.setMaxParticipants(1000);
        w4.setCategory("Security");
        w4.setStatus(Webinar.WebinarStatus.COMPLETED);
        w4.setReminderSent(true);
        webinarRepository.save(w4);

        System.out.println("✅ Seeded 4 high-quality demo webinars (React, AWS, AI, Security).");
    }
}
