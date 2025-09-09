package com.libtrack.mapper;

import com.libtrack.dto.FineDTO;
import com.libtrack.entity.Fine;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Fine entity and FineDTO.
 */
@Component
public class FineMapper {

    /**
     * Converts a Fine entity to FineDTO.
     *
     * @param fine the Fine entity
     * @return FineDTO or null if input is null
     */
    public FineDTO toDTO(Fine fine) {
        if (fine == null) return null;

        return FineDTO.builder()
                .id(fine.getId())
                .amount(fine.getAmount())
                .status(fine.getStatus().name())
                .calculatedOn(fine.getCalculatedOn())
                .paidOn(fine.getPaidOn())
                .userId(fine.getUser() != null ? fine.getUser().getId() : null)
                .reservationId(fine.getReservation() != null ? fine.getReservation().getId() : null)
                .build();
    }
}
