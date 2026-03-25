package com.webinarhub.platform.repository;

import com.webinarhub.platform.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository for Resource entity.
 * Demonstrates derived query methods and JPQL.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Derived query - findBy webinarId
    List<Resource> findByWebinarId(Long webinarId);

    // Derived query - findBy fileType
    List<Resource> findByFileType(Resource.ResourceType fileType);

    // Derived query - countBy webinarId
    Long countByWebinarId(Long webinarId);

    // Derived query - deleteBy webinarId
    void deleteByWebinarId(Long webinarId);

    // JPQL - find resources with webinar title
    @Query("SELECT r FROM Resource r JOIN FETCH r.webinar WHERE r.webinar.id = :webinarId")
    List<Resource> findResourcesWithWebinar(@Param("webinarId") Long webinarId);
}
