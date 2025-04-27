package com.example.AuthService.Utils;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@ConfigurationProperties(prefix = "auth.google")
public class GoogleVerifyUtil {

    private String clientId;

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientId() {
        return this.clientId;
    }

    public GoogleIdToken verifyToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(this.clientId)) // Use the configured clientId
                    .build();

            return verifier.verify(idTokenString);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
