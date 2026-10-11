package com.civicreport.service;

import com.civicreport.model.User;
import com.civicreport.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * UserService — Handles user registration, authentication, and session state.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final HttpSession httpSession;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private static final String SESSION_USER_ID = "SESSION_USER_ID";

    public UserService(UserRepository userRepository, HttpSession httpSession) {
        this.userRepository = userRepository;
        this.httpSession = httpSession;
    }

    /**
     * Register a new user with BCrypt password hashing.
     */
    public User register(String name, String email, String password, String phone, String roleStr) {
        String cleanEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("Email already registered: " + cleanEmail);
        }

        User user = new User();
        user.setName(name.trim());
        user.setEmail(cleanEmail);
        user.setPasswordHash(encoder.encode(password));
        user.setPhone(phone);
        user.setRole("admin".equalsIgnoreCase(roleStr) ? User.Role.ADMIN : User.Role.USER);
        user.setAvatar(generateAvatar(name));

        User saved = userRepository.save(user);
        httpSession.setAttribute(SESSION_USER_ID, saved.getUserId());
        return saved;
    }

    /**
     * Authenticate user with email + password and store session.
     */
    public Optional<User> login(String email, String password) {
        return userRepository.findByEmailIgnoreCase(email.toLowerCase().trim())
                .filter(u -> encoder.matches(password, u.getPasswordHash()))
                .map(u -> {
                    httpSession.setAttribute(SESSION_USER_ID, u.getUserId());
                    return u;
                });
    }

    /**
     * Get currently logged-in user from HTTP session.
     */
    public Optional<User> getCurrentUser() {
        Object userIdObj = httpSession.getAttribute(SESSION_USER_ID);
        if (userIdObj instanceof Integer uid) {
            return userRepository.findById(uid);
        }
        return Optional.empty();
    }

    /**
     * Invalidate current user session.
     */
    public void logout() {
        httpSession.removeAttribute(SESSION_USER_ID);
        httpSession.invalidate();
    }

    /**
     * Count total citizen users.
     */
    public long countUsers() {
        return userRepository.countByRole(User.Role.USER);
    }

    private String generateAvatar(String name) {
        if (name == null || name.isBlank()) return "??";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
}
