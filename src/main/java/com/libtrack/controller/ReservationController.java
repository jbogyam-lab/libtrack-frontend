package com.libtrack.controller;

import com.libtrack.dto.ReservationDTO;
import com.libtrack.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/create")
    public ResponseEntity<ReservationDTO> createReservation(@RequestParam UUID userId,
                                                            @RequestParam UUID bookId) {
        ReservationDTO reservation = reservationService.createReservation(userId, bookId);
        return ResponseEntity.ok(reservation);
    }

    @PostMapping("/borrow/{reservationId}")
    public ResponseEntity<ReservationDTO> borrowBook(@PathVariable UUID reservationId) {
        ReservationDTO reservation = reservationService.borrowBook(reservationId);
        return ResponseEntity.ok(reservation);
    }

    @PostMapping("/return/{reservationId}")
    public ResponseEntity<ReservationDTO> returnBook(@PathVariable UUID reservationId) {
        ReservationDTO reservation = reservationService.returnBook(reservationId);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getUserReservations(@PathVariable UUID userId) {
        List<ReservationDTO> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }
}