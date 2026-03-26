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
 * Demonstrates:
 * - CommandLineRunner interface (runs after ApplicationContext is loaded)
 * - PasswordEncoder for hashing passwords before storing in DB
 * - Conditional seeding (only inserts if records don't already exist)
 * - PostgreSQL-compatible seeding (no raw SQL, no H2-specific syntax)
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
        seedUsers();
        seedWebinars();
    }

    private void seedUsers() {
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

    private void seedWebinars() {
        // Only seed if webinar table is empty (idempotent check)
        if (webinarRepository.count() > 0) {
            System.out.println("ℹ️ Webinars already exist — skipping seed.");
            return;
        }

        Webinar w1 = new Webinar();
        w1.setTitle("AI & Machine Learning Fundamentals");
        w1.setDescription("Deep dive into neural networks, deep learning logic, and NLP. Explore how modern AI systems work from the ground up, covering supervised and unsupervised learning, model evaluation techniques, and real-world applications in natural language processing and computer vision.");
        w1.setInstructor("Dr. Rajesh Kumar");
        w1.setDateTime(LocalDateTime.of(2026, 3, 25, 15, 0));
        w1.setDurationMinutes(90);
        w1.setStreamUrl("https://meet.jit.si/webinarhub-ai");
        w1.setCoverImageUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800");
        w1.setMaxParticipants(1000);
        w1.setCategory("Artificial Intelligence");
        w1.setStatus(Webinar.WebinarStatus.LIVE);
        webinarRepository.save(w1);

        Webinar w2 = new Webinar();
        w2.setTitle("Full Stack Web Development with React");
        w2.setDescription("Master the MERN stack with modern practices and tools. Learn to build production-ready full-stack applications using MongoDB, Express.js, React, and Node.js with best practices for state management, API design, and deployment.");
        w2.setInstructor("Sarah Johnson");
        w2.setDateTime(LocalDateTime.of(2026, 4, 10, 14, 0));
        w2.setDurationMinutes(120);
        w2.setStreamUrl("https://meet.jit.si/webinarhub-react");
        w2.setCoverImageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800");
        w2.setMaxParticipants(1500);
        w2.setCategory("Frontend");
        w2.setStatus(Webinar.WebinarStatus.UPCOMING);
        webinarRepository.save(w2);

        Webinar w3 = new Webinar();
        w3.setTitle("Cloud Computing with AWS");
        w3.setDescription("Learn how to deploy scalable apps on AWS. Covering EC2, S3, Lambda, RDS, and CloudFormation — build a solid foundation in cloud architecture and DevOps practices for modern software delivery.");
        w3.setInstructor("Michael Chen");
        w3.setDateTime(LocalDateTime.of(2026, 4, 12, 10, 0));
        w3.setDurationMinutes(90);
        w3.setStreamUrl("https://meet.jit.si/webinarhub-aws");
        w3.setCoverImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
        w3.setMaxParticipants(1000);
        w3.setCategory("Cloud Computing");
        w3.setStatus(Webinar.WebinarStatus.UPCOMING);
        webinarRepository.save(w3);

        Webinar w4 = new Webinar();
        w4.setTitle("Python for Data Science");
        w4.setDescription("Data analysis and visualization in Python using Pandas and Matplotlib. From data wrangling to statistical analysis, learn the essential tools and techniques used by professional data scientists worldwide.");
        w4.setInstructor("Priya Sharma");
        w4.setDateTime(LocalDateTime.of(2025, 10, 15, 9, 0));
        w4.setDurationMinutes(120);
        w4.setStreamUrl("https://meet.jit.si/webinarhub-python");
        w4.setCoverImageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800");
        w4.setMaxParticipants(2500);
        w4.setCategory("Data Science");
        w4.setStatus(Webinar.WebinarStatus.COMPLETED);
        webinarRepository.save(w4);

        Webinar w5 = new Webinar();
        w5.setTitle("Cybersecurity Essentials");
        w5.setDescription("Protect apps from modern web vulnerabilities and hacks. Learn about OWASP Top 10, secure coding practices, authentication mechanisms, and how to perform basic penetration testing on web applications.");
        w5.setInstructor("Alex Williams");
        w5.setDateTime(LocalDateTime.of(2025, 12, 5, 11, 0));
        w5.setDurationMinutes(60);
        w5.setStreamUrl("https://meet.jit.si/webinarhub-cyber");
        w5.setCoverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800");
        w5.setMaxParticipants(2000);
        w5.setCategory("Security");
        w5.setStatus(Webinar.WebinarStatus.COMPLETED);
        webinarRepository.save(w5);

        Webinar w6 = new Webinar();
        w6.setTitle("Blockchain Basics");
        w6.setDescription("Understand decentralization, smart contracts and tokens. Explore the fundamentals of blockchain technology, consensus mechanisms, and how distributed ledger systems are transforming industries from finance to supply chain.");
        w6.setInstructor("James Lee");
        w6.setDateTime(LocalDateTime.of(2025, 11, 20, 10, 0));
        w6.setDurationMinutes(90);
        w6.setStreamUrl("");
        w6.setCoverImageUrl("https://images.unsplash.com/photo-1611080645604-cb8e24c6ddfc?q=80&w=800");
        w6.setMaxParticipants(500);
        w6.setCategory("Blockchain");
        w6.setStatus(Webinar.WebinarStatus.CANCELLED);
        webinarRepository.save(w6);

        System.out.println("✅ Seeded 6 demo webinars.");
    }
}
