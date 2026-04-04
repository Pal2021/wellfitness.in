package com.wellfitness.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

/**
 * Verifies Google ID tokens using Google's API client.
 * The token is obtained from Google Sign-In on the frontend.
 */
@Slf4j
@Service
public class GoogleTokenVerifierService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifierService(@Value("${app.google.client-id}") String clientId) {
        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    /**
     * Verifies a Google ID token and extracts user information.
     * @param idTokenString the ID token from Google Sign-In
     * @return Map with "email", "name", "pictureUrl", "googleId" or null if invalid
     */
    public Map<String, String> verifyToken(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                log.warn("Google ID token verification failed - invalid token");
                return null;
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            boolean emailVerified = payload.getEmailVerified();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();

            if (!emailVerified) {
                log.warn("Google account email not verified: {}", email);
                return null;
            }

            log.info("Google token verified for: {} ({})", email, name);
            return Map.of(
                    "email", email,
                    "name", name != null ? name : email.split("@")[0],
                    "pictureUrl", pictureUrl != null ? pictureUrl : "",
                    "googleId", googleId
            );
        } catch (Exception e) {
            log.error("Google token verification error: {}", e.getMessage());
            return null;
        }
    }
}
