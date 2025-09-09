package com.libtrack.entity;

/**
 * Enum for reservation/borrowing status of a book:
 * - RESERVED: Book is reserved but not yet picked up.
 * - BORROWED: Book is currently borrowed by a user.
 * - RETURNED: Book has been returned.
 */
public enum ReservationStatus {
    RESERVED,
    BORROWED,
    RETURNED
}
