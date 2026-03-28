package com.webinarhub.platform.repository;

import com.webinarhub.platform.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByWebinarIdOrderByCreatedAtDesc(Long webinarId);
    boolean existsByUserIdAndWebinarId(Long userId, Long webinarId);
}
