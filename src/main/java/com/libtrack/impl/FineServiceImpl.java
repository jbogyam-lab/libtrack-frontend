package com.libtrack.impl;

import com.libtrack.dto.FineDTO;
import com.libtrack.entity.*;
import com.libtrack.mapper.FineMapper;
import com.libtrack.repository.AdminSettingsRepository;
import com.libtrack.repository.FineRepository;
import com.libtrack.repository.ReservationRepository;
import com.libtrack.repository.UserRepository;
import com.libtrack.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final AdminSettingsRepository adminSettingsRepository;
    private final FineMapper fineMapper;

    @Override
    public List<FineDTO> getFinesByUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return fineRepository.findByUser(user)
                .stream()
                .map(fineMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FineDTO payFine(UUID fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found: " + fineId));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new IllegalStateException("Fine is already paid.");
        }

        fine.setStatus(FineStatus.PAID);
        fine.setPaidOn(LocalDateTime.now());

        return fineMapper.toDTO(fineRepository.save(fine));
    }

    @Override
    public void calculateFine(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getReturnDate() == null || reservation.getDueDate() == null) {
            return; // Can't calculate fine without return and due dates
        }

        long overdueDays = ChronoUnit.DAYS.between(reservation.getDueDate(), reservation.getReturnDate());
        if (overdueDays <= 0) return; // No fine if returned on time

        AdminSettings settings = adminSettingsRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("Admin settings not configured"));

        double fineAmount = overdueDays * settings.getFineRatePerDay();

        Fine fine = Fine.builder()
                .amount(fineAmount)
                .status(FineStatus.PENDING)
                .calculatedOn(LocalDateTime.now())
                .user(reservation.getUser())
                .reservation(reservation)
                .build();

        fineRepository.save(fine);
    }
}