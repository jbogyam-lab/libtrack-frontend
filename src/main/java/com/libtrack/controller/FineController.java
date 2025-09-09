package com.libtrack.controller;

import com.libtrack.dto.FineDTO;
import com.libtrack.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/fines")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class FineController {

    private final FineService fineService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FineDTO>> getFinesByUser(@PathVariable UUID userId) {
        List<FineDTO> fines = fineService.getFinesByUser(userId);
        return ResponseEntity.ok(fines);
    }

    @PostMapping("/pay/{fineId}")
    public ResponseEntity<FineDTO> payFine(@PathVariable UUID fineId) {
        FineDTO paidFine = fineService.payFine(fineId);
        return ResponseEntity.ok(paidFine);
    }
}