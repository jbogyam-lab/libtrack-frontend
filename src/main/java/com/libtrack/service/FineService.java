package com.libtrack.service;

import com.libtrack.dto.FineDTO;
import java.util.List;
import java.util.UUID;

/**
 * Fine service interface
 */
public interface FineService {
    List<FineDTO> getFinesByUser(UUID userId);
    FineDTO payFine(UUID fineId);
    void calculateFine(UUID reservationId);
}
