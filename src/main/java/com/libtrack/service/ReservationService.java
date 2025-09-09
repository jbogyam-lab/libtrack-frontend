package com.libtrack.service;

import com.libtrack.dto.ReservationDTO;
import java.util.List;
import java.util.UUID;

/**
 * Reservation service interface
 */
public interface ReservationService {
    ReservationDTO createReservation(UUID userId, UUID bookId);
    ReservationDTO borrowBook(UUID reservationId);
    ReservationDTO returnBook(UUID reservationId);
    List<ReservationDTO> getUserReservations(UUID userId);
}
