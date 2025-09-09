package com.libtrack.impl;

import com.libtrack.dto.ReservationDTO;
import com.libtrack.entity.*;
import com.libtrack.mapper.ReservationMapper;
import com.libtrack.repository.BookRepository;
import com.libtrack.repository.ReservationRepository;
import com.libtrack.repository.UserRepository;
import com.libtrack.service.FineService;
import com.libtrack.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReservationMapper reservationMapper;
    private final FineService fineService;

    @Override
    public ReservationDTO createReservation(UUID userId, UUID bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + bookId));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies for book: " + book.getTitle());
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .book(book)
                .status(ReservationStatus.RESERVED)
                .borrowDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(14)) // Default 2-week window
                .build();

        return reservationMapper.toDTO(reservationRepository.save(reservation));
    }

    @Override
    public ReservationDTO borrowBook(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new IllegalStateException("Only RESERVED books can be borrowed.");
        }

        Book book = reservation.getBook();
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies to borrow.");
        }

        reservation.setStatus(ReservationStatus.BORROWED);
        reservation.setBorrowDate(LocalDateTime.now());
        reservation.setDueDate(LocalDateTime.now().plusDays(14));
        book.setAvailableCopies(book.getAvailableCopies() - 1);

        bookRepository.save(book);
        return reservationMapper.toDTO(reservationRepository.save(reservation));
    }

    @Override
    public ReservationDTO returnBook(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.BORROWED) {
            throw new IllegalStateException("Only BORROWED books can be returned.");
        }

        reservation.setStatus(ReservationStatus.RETURNED);
        reservation.setReturnDate(LocalDateTime.now());

        Book book = reservation.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);

        bookRepository.save(book);
        reservationRepository.save(reservation);

        fineService.calculateFine(reservationId); // Trigger fine calculation if overdue

        return reservationMapper.toDTO(reservation);
    }

    @Override
    public List<ReservationDTO> getUserReservations(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return reservationRepository.findByUser(user)
                .stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }
}