package com.webinarhub.platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Email Service for sending registration confirmations.
 * Demonstrates Spring Boot email sending capability.
 * Uses JavaMailSender which is auto-configured by spring-boot-starter-mail.
 * 
 * NOTE: Email sending is optional. If SMTP is not configured,
 * failures are logged but do not break any functionality.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send registration confirmation email.
     * Fails silently if SMTP is not configured.
     */
    public void sendRegistrationConfirmation(String toEmail, String userName,
                                              String webinarTitle, LocalDateTime webinarDateTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Registration Confirmed - " + webinarTitle);
            message.setText(
                    "Dear " + userName + ",\n\n" +
                    "You have successfully registered for the webinar:\n\n" +
                    "Title: " + webinarTitle + "\n" +
                    "Date & Time: " + webinarDateTime.format(
                            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) + "\n\n" +
                    "Please make sure to attend the session on time.\n\n" +
                    "Best regards,\n" +
                    "WebinarHub Team"
            );
            message.setFrom("noreply@webinarhub.com");

            mailSender.send(message);
            System.out.println("✅ Registration email sent to: " + toEmail);
        } catch (Exception e) {
            System.out.println("⚠️ Email not sent (SMTP not configured): " + e.getMessage());
        }
    }

    /**
     * Send webinar reminder email.
     * Fails silently if SMTP is not configured.
     */
    public void sendWebinarReminder(String toEmail, String userName,
                                     String webinarTitle, LocalDateTime webinarDateTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Reminder: " + webinarTitle + " starts soon!");
            message.setText(
                    "Dear " + userName + ",\n\n" +
                    "This is a reminder that the webinar '" + webinarTitle + "' is starting soon.\n\n" +
                    "Date & Time: " + webinarDateTime.format(
                            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) + "\n\n" +
                    "Don't miss it!\n\n" +
                    "Best regards,\n" +
                    "WebinarHub Team"
            );
            message.setFrom("noreply@webinarhub.com");

            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("⚠️ Reminder email not sent: " + e.getMessage());
        }
    }
}
