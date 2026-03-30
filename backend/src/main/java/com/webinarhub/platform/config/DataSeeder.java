package com.webinarhub.platform.config;

import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.entity.Resource;
import com.webinarhub.platform.repository.UserRepository;
import com.webinarhub.platform.repository.WebinarRepository;
import com.webinarhub.platform.repository.ResourceRepository;
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
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(UserRepository userRepository,
                      WebinarRepository webinarRepository,
                      ResourceRepository resourceRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.webinarRepository = webinarRepository;
        this.resourceRepository = resourceRepository;
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
            e.printStackTrace();
        }
    }

    private void seedUsers() {
        System.out.println("👤 Seeding user data...");
        
        // Admin account
        User admin = new User();
        admin.setName("Dr. Wicky");
        admin.setEmail("vardhan@gmail.com");
        admin.setPassword(passwordEncoder.encode("vivek123"));
        admin.setRole(User.Role.ADMIN);
        admin.setOrganization("WebinarHub Administrator");
        userRepository.save(admin);
        System.out.println("✅ Created Admin: Dr. Wicky (vardhan@gmail.com)");

        // Student account 1
        User student1 = new User();
        student1.setName("Vivek Vardhan");
        student1.setEmail("vivekvardhan@gmail.com");
        student1.setPassword(passwordEncoder.encode("vivek123"));
        student1.setRole(User.Role.USER);
        student1.setOrganization("Student");
        userRepository.save(student1);
        System.out.println("✅ Created Student: Vivek Vardhan (vivekvardhan@gmail.com)");

        // Student account 2
        User student2 = new User();
        student2.setName("Test Student");
        student2.setEmail("test@gmail.com");
        student2.setPassword(passwordEncoder.encode("test123"));
        student2.setRole(User.Role.USER);
        student2.setOrganization("Tester");
        userRepository.save(student2);
        System.out.println("✅ Created Student: Test Student (test@gmail.com)");
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
            w2.setInstructor("Dr.Viswa");
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
            w3.setInstructor("Dr.Siddharth");
            w3.setDateTime(LocalDateTime.now().plusDays(1).withHour(14).withMinute(0));
            w3.setDurationMinutes(60);
            w3.setStreamUrl("https://meet.jit.si/webinarhub-ai-gen");
            w3.setCoverImageUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800");
            w3.setMaxParticipants(3000);
            w3.setCategory("AI");
            w3.setStatus(Webinar.WebinarStatus.LIVE);
            w3.setReminderSent(false);
            webinarRepository.save(w3);

            // 4. Cybersecurity Essentials
            Webinar w4 = new Webinar();
            w4.setTitle("Cybersecurity Essentials");
            w4.setDescription("Protect your digital assets with advanced security techniques. Learn to identify vulnerabilities and defend against modern cyber threats.");
            w4.setInstructor("Sathwik");
            w4.setDateTime(LocalDateTime.now().minusDays(10).withHour(11).withMinute(0));
            w4.setDurationMinutes(120);
            w4.setStreamUrl("");
            w4.setCoverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800");
            w4.setMaxParticipants(1000);
            w4.setCategory("Security");
            w4.setStatus(Webinar.WebinarStatus.COMPLETED);
            w4.setReminderSent(true);
            webinarRepository.save(w4);

            Resource r1 = new Resource();
            r1.setTitle("Session Recording");
            r1.setFileUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            r1.setFileType(Resource.ResourceType.VIDEO);
            r1.setDescription("Full recording of the Cybersecurity Essentials session.");
            r1.setWebinar(w4);
            resourceRepository.save(r1);

            // 5. Python for Data Science
            Webinar w5 = new Webinar();
            w5.setTitle("Python for Data Science");
            w5.setDescription("Master the transition from data analyst to data scientist. Explore machine learning, statistics, and visualization tools.");
            w5.setInstructor("Madhavi");
            w5.setDateTime(LocalDateTime.now().minusDays(15).withHour(16).withMinute(0));
            w5.setDurationMinutes(90);
            w5.setStreamUrl("");
            w5.setCoverImageUrl("https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800");
            w5.setMaxParticipants(2000);
            w5.setCategory("Data");
            w5.setStatus(Webinar.WebinarStatus.COMPLETED);
            w5.setReminderSent(true);
            webinarRepository.save(w5);

            Resource r2 = new Resource();
            r2.setTitle("Course Slides (PDF)");
            r2.setFileUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
            r2.setFileType(Resource.ResourceType.PDF);
            r2.setDescription("Complete lesson slides for Python for Data Science.");
            r2.setWebinar(w5);
            resourceRepository.save(r2);

            // 6. Blockchain
            Webinar w6 = new Webinar();
            w6.setTitle("Blockchain & Smart Contracts");
            w6.setDescription("Introduction to decentralized applications and solidity programming.");
            w6.setInstructor("Sekar");
            w6.setDateTime(LocalDateTime.now().plusDays(5).withHour(15).withMinute(0));
            w6.setDurationMinutes(120);
            w6.setStreamUrl("https://meet.jit.si/webinarhub-blockchain");
            w6.setCoverImageUrl("https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=800");
            w6.setMaxParticipants(1200);
            w6.setCategory("Web3");
            w6.setStatus(Webinar.WebinarStatus.UPCOMING);
            w6.setReminderSent(false);
            webinarRepository.save(w6);

            // 7. Data Engineering
            Webinar w7 = new Webinar();
            w7.setTitle("Modern Data Stack & ELT Pipelines");
            w7.setDescription("Building scalable data infrastructure with dbt, Snowflake and Airflow.");
            w7.setInstructor("Vivek Vardhan");
            w7.setDateTime(LocalDateTime.now().plusDays(10).withHour(19).withMinute(0));
            w7.setDurationMinutes(90);
            w7.setStreamUrl("https://meet.jit.si/webinarhub-data-eng");
            w7.setCoverImageUrl("https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800");
            w7.setMaxParticipants(1800);
            w7.setCategory("Data");
            w7.setStatus(Webinar.WebinarStatus.UPCOMING);
            w7.setReminderSent(false);
            webinarRepository.save(w7);

            System.out.println("✅ Seeded 7 webinars with official admin and sample resources.");
        } else {
            System.out.println("ℹ️ Webinars already present (" + webinarRepository.count() + "). Skipping seeding.");
        }
    }
}
