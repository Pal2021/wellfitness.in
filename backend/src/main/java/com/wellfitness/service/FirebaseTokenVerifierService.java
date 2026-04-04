package com.wellfitness.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Verifies Firebase ID tokens for Phone Authentication.
 * After Firebase sends the OTP and the user verifies it on the frontend,
 * the frontend sends the Firebase ID token to the backend.
 * This service verifies that token against Firebase.
 */
@Slf4j
@Service
public class FirebaseTokenVerifierService {

    /**
     * Verify a Firebase ID token and extract user info.
     * @param idToken the Firebase ID token from the frontend
     * @return Map with "uid", "phone" or null if invalid
     */
    public Map<String, String> verifyToken(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            String phone = decodedToken.getClaims().get("phone_number") != null
                    ? decodedToken.getClaims().get("phone_number").toString()
                    : null;
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            log.info("Firebase token verified — UID: {}, Phone: {}, Email: {}", uid, phone, email);

            return Map.of(
                    "uid", uid,
                    "phone", phone != null ? phone : "",
                    "email", email != null ? email : "",
                    "name", name != null ? name : ""
            );
        } catch (FirebaseAuthException e) {
            log.error("Firebase token verification failed: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Firebase verification error: {}", e.getMessage());
            return null;
        }
    }
}
