package com.libtrack.impl;

import com.libtrack.dto.BookDTO;
import com.libtrack.entity.Book;
import com.libtrack.mapper.BookMapper;
import com.libtrack.repository.BookRepository;
import com.libtrack.service.BookService;
import com.libtrack.util.QrUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final QrUtils qrUtils; // ✅ Inject QrUtils

    @Override
    public BookDTO addBook(BookDTO bookDTO) {
        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN already exists: " + bookDTO.getIsbn());
        }

        Book book = bookMapper.toEntity(bookDTO);

        // Save first to get UUID
        Book savedBook = bookRepository.save(book);

        try {
            // Generate QR code for this book
            String qrPath = qrUtils.generateQRCodeImage(
                    "BOOK:" + savedBook.getId(), // QR content
                    "book-" + savedBook.getId(), // file name
                    250,
                    250
            );
            savedBook.setQrCodeUrl(qrPath);
            savedBook = bookRepository.save(savedBook);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code for book: " + savedBook.getId(), e);
        }

        return bookMapper.toDTO(savedBook);
    }

    @Override
    public BookDTO getBookById(UUID bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + bookId));
        return bookMapper.toDTO(book);
    }

    @Override
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookDTO updateBook(UUID bookId, BookDTO bookDTO) {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + bookId));

        existingBook.setTitle(bookDTO.getTitle());
        existingBook.setAuthor(bookDTO.getAuthor());
        existingBook.setIsbn(bookDTO.getIsbn());
        existingBook.setAvailableCopies(bookDTO.getAvailableCopies());
        existingBook.setTotalCopies(bookDTO.getTotalCopies());
        existingBook.setCategory(bookDTO.getCategory());
        existingBook.setImageUrl(bookDTO.getImageUrl());

        return bookMapper.toDTO(bookRepository.save(existingBook));
    }

    @Override
    public void deleteBook(UUID bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new IllegalArgumentException("Book not found with ID: " + bookId);
        }
        bookRepository.deleteById(bookId);
    }
}
