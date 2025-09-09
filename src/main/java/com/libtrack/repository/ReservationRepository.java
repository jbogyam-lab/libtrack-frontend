package com.libtrack.repository;

import com.libtrack.entity.Reservation;
import com.libtrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Reservation entity
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    List<Reservation> findByUser(User user); // Get reservations for a user
}
