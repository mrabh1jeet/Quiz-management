package com.quizhub.quizhub.repository;

import com.quizhub.quizhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // Add a method to check if a user exists by username
    boolean existsByUsername(String username);

    // Add a method to delete a user by username
    void deleteByUsername(String username);
}
