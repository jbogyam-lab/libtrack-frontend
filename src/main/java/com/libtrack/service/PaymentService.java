package com.libtrack.service;

import java.util.UUID;

public interface PaymentService {
    String createPaymentSession(UUID fineId);
    void handleWebhook(String payload, String sigHeader);
}
