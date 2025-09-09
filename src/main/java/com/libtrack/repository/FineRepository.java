package com.libtrack.repository;

import com.libtrack.entity.Fine;
import com.libtrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Fine entity
 */
@Repository
public interface FineRepository extends JpaRepository<Fine, UUID> {
    List<Fine> findByUser(User user); // Get all fines for a user
}
