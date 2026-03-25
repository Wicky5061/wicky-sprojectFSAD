package com.webinarhub.platform.repository;

import com.webinarhub.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for User entity.
 * Demonstrates:
 * - Spring Data JPA repository layer (DAO pattern)
 * - Derived query methods (findBy, countBy)
 * - JPQL queries with named parameters
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived query method - findBy
    Optional<User> findByEmail(String email);

    // Derived query method - findBy with multiple conditions
    Optional<User> findByEmailAndPassword(String email, String password);

    // Derived query method - countBy
    Long countByRole(User.Role role);

    // JPQL query with named parameter
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
    List<User> searchByName(@Param("name") String name);

    // JPQL query - check if email exists
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    // Derived query method - findBy role
    List<User> findByRole(User.Role role);
}
