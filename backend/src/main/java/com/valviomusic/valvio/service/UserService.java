package com.valviomusic.valvio.service;

import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.auth.FirebaseToken;
import com.valviomusic.valvio.model.User;
import com.valviomusic.valvio.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Find or create a user from Firebase token
     * @param firebaseToken The verified Firebase token
     * @return The user entity
     */
    @Transactional
    public User findOrCreateUser(FirebaseToken firebaseToken) {
        String firebaseUid = firebaseToken.getUid();
        
        return userRepository.findByFirebaseUid(firebaseUid)
            .map(user -> {
                // Update last login time
                user.setLastLoginAt(OffsetDateTime.now());
                return userRepository.save(user);
            })
            .orElseGet(() -> {
                // Create new user
                User newUser = new User();
                newUser.setFirebaseUid(firebaseUid);
                newUser.setEmail(firebaseToken.getEmail());
                newUser.setDisplayName(firebaseToken.getName());
                newUser.setPhotoUrl((String) firebaseToken.getClaims().get("picture"));
                
                // Check if user is anonymous
                Object authTime = firebaseToken.getClaims().get("firebase");
                if (authTime instanceof java.util.Map) {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String, Object> firebaseData = (java.util.Map<String, Object>) authTime;
                    Object signInProvider = firebaseData.get("sign_in_provider");
                    newUser.setIsAnonymous("anonymous".equals(signInProvider));
                } else {
                    newUser.setIsAnonymous(false);
                }
                
                return userRepository.save(newUser);
            });
    }

    /**
     * Get user by Firebase UID
     * @param firebaseUid Firebase user ID
     * @return User entity if found
     */
    public User getUserByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
            .orElse(null);
    }
}

