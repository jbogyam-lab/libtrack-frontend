package com.libtrack.repository;

import com.libtrack.entity.AdminSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//import java.util.UUID;

/**
 * Repository for AdminSettings entity
 * This will likely have only ONE record.
 */
@Repository
public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Long> {
}
