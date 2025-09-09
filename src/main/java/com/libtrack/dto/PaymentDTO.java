package com.libtrack.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private String sessionId;
    private String paymentUrl;
    private double amount;
    private String currency;
}
