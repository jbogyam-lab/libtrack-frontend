package com.libtrack.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Simple QR utility that writes a PNG to disk and returns relative URL/path.
 * Adjust the BASE_DIR and BASE_URL to match your deployment.
 */
@Component
public class QrUtils {

    private static final String BASE_DIR = "uploads/qrcodes/"; // ensure this folder exists or create it
    private static final String BASE_URL = "/uploads/qrcodes/"; // if you serve static files from /uploads

    public String generateQRCodeImage(String content, String fileName, int width, int height) throws IOException {
        try {
            Path dir = Paths.get(BASE_DIR);
            if (Files.notExists(dir)) {
                Files.createDirectories(dir);
            }

            Map<EncodeHintType,Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 1);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            Path filePath = dir.resolve(fileName + ".png");
            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", filePath);
            return BASE_URL + fileName + ".png";
        } catch (com.google.zxing.WriterException e) {
            throw new IOException("Could not generate QR code", e);
        }
    }
}
