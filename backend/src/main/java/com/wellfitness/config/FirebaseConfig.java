package com.wellfitness.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Firebase Admin SDK initialization.
 * Looks for service account JSON at: src/main/resources/firebase-service-account.json
 * If not found, initializes with application default credentials.
 */
@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase already initialized");
            return;
        }

        try {
            FirebaseOptions options;

            // Try to load service account JSON from resources
            InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("firebase-service-account.json");

            if (serviceAccount != null) {
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                log.info("Firebase initialized with service account JSON");
            } else {
                // Fallback: use application default credentials
                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
                log.info("Firebase initialized with application default credentials");
            }

            FirebaseApp.initializeApp(options);
        } catch (IOException e) {
            log.error("Failed to initialize Firebase: {}", e.getMessage());
            log.warn("Firebase Phone Auth verification will not work without proper credentials.");
            log.warn("Place your firebase-service-account.json in src/main/resources/");
        }
    }
}
