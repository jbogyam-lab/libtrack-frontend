package com.libtrack.entity;

/**
 * Enum for defining different roles in the system.
 * - STUDENT: Regular user who borrows books.
 * - LIBRARIAN: Manages library operations (registers users, adds books).
 * - GLOBAL_ADMIN: Has full access across all libraries.
 */
public enum Role {
    STUDENT,
    LIBRARIAN,
    GLOBAL_ADMIN
}
