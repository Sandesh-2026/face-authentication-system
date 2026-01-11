package com.sandesh.faceauth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.io.*;
import java.nio.file.Files;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@RestController
@RequestMapping("/api/face")
@CrossOrigin(origins = "http://localhost:5173")
public class FaceController {

    /* =========================
       FACE REGISTRATION
       ========================= */
    @PostMapping("/register")
    public ResponseEntity<?> registerFace(@RequestBody Map<String, String> body) {
        System.out.println("=== FACE REGISTER HIT ===");
        try {
            String image = body.get("image");



            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body("Image not received");
            }

            saveBase64Image(image, "faces/login_attempt.jpg");

            File registered = new File("faces/user_1.jpg");
            File loginAttempt = new File("faces/login_attempt.jpg");

            if (!registered.exists()) {
                return ResponseEntity.badRequest().body("No registered face found");
            }

            double similarity = compareImages(registered, loginAttempt);
            System.out.println("Face similarity: " + similarity);

            if (similarity > 90) {
                String fakeJwt = "face-auth-token-" + System.currentTimeMillis();
                return ResponseEntity.ok(fakeJwt);
            } else {
                return ResponseEntity.status(401).body("❌ Face does not match");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Face registration failed");
        }
    }

    /* =========================
       FACE LOGIN (NO OPENCV)
       ========================= */
    @PostMapping("/login")
    public ResponseEntity<?> loginWithFace(@RequestBody Map<String, String> body) {
        try {
            String image = body.get("image");

            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body("Image not received");
            }

            // Save login attempt image
            saveBase64Image(image, "faces/login_attempt.jpg");

            File registered = new File("faces/user_1.jpg");
            File loginAttempt = new File("faces/login_attempt.jpg");

            if (!registered.exists()) {
                return ResponseEntity.badRequest().body("No registered face found");
            }

            double similarity = compareImages(registered, loginAttempt);
            System.out.println("Face similarity: " + similarity);

            if (similarity > 90) {
                return ResponseEntity.ok("✅ Face login successful");
            } else {
                return ResponseEntity.status(401).body("❌ Face does not match");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Face login failed");
        }
    }

    /* =========================
       HELPER METHODS
       ========================= */
    private void saveBase64Image(String base64Image, String path) throws IOException {
        String data = base64Image.split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(data);

        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));

        File dir = new File("faces");
        if (!dir.exists()) dir.mkdirs();

        ImageIO.write(image, "jpg", new File(path));
    }

    private double compareImages(File img1, File img2) throws IOException {

        BufferedImage image1 = ImageIO.read(img1);
        BufferedImage image2 = ImageIO.read(img2);

        int width = Math.min(image1.getWidth(), image2.getWidth());
        int height = Math.min(image1.getHeight(), image2.getHeight());

        long diff = 0;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                diff += Math.abs(image1.getRGB(x, y) - image2.getRGB(x, y));
            }
        }

        double maxDiff = (double) width * height * Integer.MAX_VALUE;
        return 100.0 - (diff * 100.0 / maxDiff);
    }
}
