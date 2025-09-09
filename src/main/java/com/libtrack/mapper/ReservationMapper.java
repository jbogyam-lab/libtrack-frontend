package com.libtrack.mapper;

import com.libtrack.dto.ReservationDTO;
import com.libtrack.entity.Reservation;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Reservation entity and ReservationDTO.
 */
@Component
public class ReservationMapper {

    /**
     * Converts a Reservation entity to ReservationDTO.
     *
     * @param reservation the Reservation entity
     * @return ReservationDTO or null if input is null
     */
    public ReservationDTO toDTO(Reservation reservation) {
        if (reservation == null) return null;

        return ReservationDTO.builder()
                .id(reservation.getId())
                .status(reservation.getStatus().name())
                .borrowDate(reservation.getBorrowDate())
                .dueDate(reservation.getDueDate())
                .returnDate(reservation.getReturnDate())
                .userId(reservation.getUser() != null ? reservation.getUser().getId() : null)
                .bookId(reservation.getBook() != null ? reservation.getBook().getId() : null)
                .build();
    }
}
