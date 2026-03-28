package com.webinarhub.platform.service;

import com.webinarhub.platform.entity.Registration;
import com.webinarhub.platform.entity.Webinar;
import com.webinarhub.platform.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled task for sending automated webinar reminders.
 * Runs every 15 minutes and checks for upcoming webinars.
 */
@Component
public class WebinarReminderTask {

    private final WebinarRepository webinarRepository;
    private final EmailService emailService;

    @Autowired
    public WebinarReminderTask(WebinarRepository webinarRepository, EmailService emailService) {
        this.webinarRepository = webinarRepository;
        this.emailService = emailService;
    }

    /**
     * Send reminders for webinars starting in the next 1 hour.
     * Fixed rate is 15 minutes (900,000 milliseconds).
     */
    @Scheduled(fixedRate = 900000)
    @Transactional
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourFromNow = now.plusHours(1);

        // Find webinars starting soon that haven't been reminded
        List<Webinar> upcoming = webinarRepository.findByDateTimeBetweenAndReminderSentFalse(now, oneHourFromNow);

        if (!upcoming.isEmpty()) {
            System.out.println("Processing " + upcoming.size() + " webinar reminders...");
        }

        for (Webinar webinar : upcoming) {
            // Only remind for upcoming webinars
            if (webinar.getStatus() == Webinar.WebinarStatus.UPCOMING) {
                // Send email to all registered users
                for (Registration reg : webinar.getRegistrations()) {
                    emailService.sendWebinarReminder(
                            reg.getUser().getEmail(),
                            reg.getUser().getName(),
                            webinar.getTitle(),
                            webinar.getDateTime());
                }
                
                // Mark webinar as reminded
                webinar.setReminderSent(true);
                webinarRepository.save(webinar);
                System.out.println("✅ Reminders sent for webinar: " + webinar.getTitle());
            }
        }
    }
}
