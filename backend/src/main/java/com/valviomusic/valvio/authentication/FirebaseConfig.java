package com.valviomusic.valvio.authentication;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-key:}")
    private String serviceAccountKey;

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options;
            
            if (serviceAccountKey != null && !serviceAccountKey.isEmpty()) {
                // Try to load from JSON string (for environment variables)
                if (serviceAccountKey.trim().startsWith("{")) {
                    ByteArrayInputStream serviceAccount = new ByteArrayInputStream(
                        serviceAccountKey.getBytes()
                    );
                    options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                } else {
                    // Load from file path
                    FileInputStream serviceAccount = new FileInputStream(serviceAccountKey);
                    options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                }
                
                return FirebaseApp.initializeApp(options);
            } else {
                // Try to use Application Default Credentials
                // This works in Google Cloud environments or when GOOGLE_APPLICATION_CREDENTIALS is set
                options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build();
                
                return FirebaseApp.initializeApp(options);
            }
        }
        
        return FirebaseApp.getInstance();
    }
}

