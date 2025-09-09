package com.libtrack.service;

import com.libtrack.dto.BookDTO;
import java.util.List;
import java.util.UUID;

/**
 * Book service interface for managing books
 */
public interface BookService {
    BookDTO addBook(BookDTO bookDTO);
    BookDTO getBookById(UUID bookId);
    List<BookDTO> getAllBooks();
    BookDTO updateBook(UUID bookId, BookDTO bookDTO);
    void deleteBook(UUID bookId);
}
