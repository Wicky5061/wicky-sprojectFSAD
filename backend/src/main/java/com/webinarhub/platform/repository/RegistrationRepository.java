package com.webinarhub.platform.repository;

import com.webinarhub.platform.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Registration entity.
 * Demonstrates:
 * - Derived query methods (findBy, deleteBy, countBy)
 * - JPQL with named parameters
 */
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Derived query - findBy userId
    List<Registration> findByUserId(Long userId);

    // Derived query - findBy webinarId
    List<Registration> findByWebinarId(Long webinarId);

    // Derived query - check if user already registered
    Optional<Registration> findByUserIdAndWebinarId(Long userId, Long webinarId);

    // Derived query - countBy webinarId
    Long countByWebinarId(Long webinarId);

    // Derived query - deleteBy userId and webinarId
    void deleteByUserIdAndWebinarId(Long userId, Long webinarId);

    // JPQL - find registrations with user and webinar details
    @Query("SELECT r FROM Registration r JOIN FETCH r.user JOIN FETCH r.webinar WHERE r.user.id = :userId")
    List<Registration> findRegistrationsWithDetailsByUserId(@Param("userId") Long userId);

    // JPQL - count attendees for a webinar
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.webinar.id = :webinarId AND r.attended = true")
    Long countAttendeesByWebinarId(@Param("webinarId") Long webinarId);

    // JPQL - fetch all registrations safely avoiding N+1 and nulls
    @Query("SELECT r FROM Registration r LEFT JOIN FETCH r.user LEFT JOIN FETCH r.webinar")
    List<Registration> findAllWithDetails();
}
