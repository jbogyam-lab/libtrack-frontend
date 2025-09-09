package com.libtrack.impl;

import com.libtrack.entity.Fine;
import com.libtrack.entity.FineStatus;
import com.libtrack.repository.FineRepository;
import com.libtrack.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final FineRepository fineRepository;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Override
    public String createPaymentSession(UUID fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new IllegalArgumentException("Fine not found: " + fineId));

        try {
            // 🔥 Store fineId in metadata
            Map<String, String> metadata = new HashMap<>();
            metadata.put("fineId", fine.getId().toString());

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/checkout/success")
                    .setCancelUrl("http://localhost:5173/checkout/cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount((long) (fine.getAmount() * 100)) // cents
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Library Fine #" + fine.getId())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .putAllMetadata(metadata)
                    .build();

            Session session = Session.create(params);
            return session.getUrl();

        } catch (StripeException e) {
            throw new RuntimeException("Stripe session creation failed", e);
        }
    }

    @Override
    public void handleWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();

                // ✅ Retrieve fineId from metadata
                String fineIdString = session.getMetadata().get("fineId");
                UUID fineId = UUID.fromString(fineIdString);

                Fine fine = fineRepository.findById(fineId)
                        .orElseThrow(() -> new IllegalArgumentException("Fine not found: " + fineId));
                fine.setStatus(FineStatus.PAID);
                fineRepository.save(fine);
            }
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Webhook signature verification failed", e);
        } catch (Exception e) {
            throw new RuntimeException("Webhook handling error", e);
        }
    }
}
