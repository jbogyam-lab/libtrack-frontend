package com.libtrack.mapper;

import com.libtrack.dto.BookDTO;
import com.libtrack.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Book entity and BookDTO.
 * 
 * - Used to safely expose book data via API without exposing full entity.
 * - Supports mapping both directions: Entity -> DTO and DTO -> Entity.
 */
@Component
public class BookMapper {

    /**
     * Converts a Book entity to BookDTO.
     * 
     * @param book the Book entity
     * @return BookDTO
     */
    public BookDTO toDTO(Book book) {
        if (book == null) return null;

        return new BookDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getAvailableCopies(),
                book.getTotalCopies(),
                book.getQrCodeUrl(),
                book.getCategory(),
                book.getImageUrl()
        );
    }

    /**
     * Converts a BookDTO to a Book entity.
     * 
     * @param dto the BookDTO
     * @return Book entity
     */
    public Book toEntity(BookDTO dto) {
        if (dto == null) return null;

        return Book.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .availableCopies(dto.getAvailableCopies())
                .totalCopies(dto.getTotalCopies())
                .qrCodeUrl(dto.getQrCodeUrl())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .build();
    }
}
