package com.webinarhub.platform.repository;

import com.webinarhub.platform.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA Repository for Webinar entity.
 * Demonstrates:
 * - Derived query methods (findBy, deleteBy, countBy)
 * - JPQL with named and positional parameters
 * - Aggregate functions (COUNT)
 * - Sorting and paging via method naming
 */
@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Long> {

    // Derived query method - findBy title containing
    List<Webinar> findByTitleContainingIgnoreCase(String title);

    // Derived query method - findBy status
    List<Webinar> findByStatus(Webinar.WebinarStatus status);

    // Derived query method - findBy category
    List<Webinar> findByCategory(String category);

    // Derived query method - countBy status
    Long countByStatus(Webinar.WebinarStatus status);

    // JPQL - find upcoming webinars sorted by date
    @Query("SELECT w FROM Webinar w WHERE w.dateTime > :now ORDER BY w.dateTime ASC")
    List<Webinar> findUpcomingWebinars(@Param("now") LocalDateTime now);

    // JPQL - find webinars by instructor (named parameter)
    @Query("SELECT w FROM Webinar w WHERE w.instructor = :instructor")
    List<Webinar> findByInstructorName(@Param("instructor") String instructor);

    // JPQL - count total registrations for a webinar (aggregate function)
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.webinar.id = :webinarId")
    Long countRegistrationsByWebinarId(@Param("webinarId") Long webinarId);

    // JPQL - update webinar status
    @Modifying
    @Query("UPDATE Webinar w SET w.status = :status WHERE w.id = :id")
    void updateStatusById(@Param("id") Long id, @Param("status") Webinar.WebinarStatus status);

    // Derived query - find by date range
    List<Webinar> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Derived query - order by dateTime
    List<Webinar> findAllByOrderByDateTimeDesc();
}
