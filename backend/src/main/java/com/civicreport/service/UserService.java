package com.civicreport.service;

import com.civicreport.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * UserService — Business logic for user management.
 * NOTE: This is a reference skeleton. Wire with your UserRepository.
 */
@Service
public class UserService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // TODO: @Autowired UserRepository userRepository;
    // TODO: @Autowired HttpSession session;  or use SecurityContextHolder

    /**
     * Register a new user.
     * Validates email uniqueness and hashes the password.
     */
    public User register(String name, String email, String password, String phone, String roleStr) {
        // if (userRepository.existsByEmail(email)) throw new IllegalArgumentException("Email already registered");
        User user = new User();
        user.setName(name);
        user.setEmail(email.toLowerCase().trim());
        user.setPasswordHash(encoder.encode(password));
        user.setPhone(phone);
        user.setRole("admin".equalsIgnoreCase(roleStr) ? User.Role.ADMIN : User.Role.USER);
        user.setAvatar(generateAvatar(name));
        // return userRepository.save(user);
        return user; // placeholder
    }

    /**
     * Authenticate user with email + password.
     */
    public Optional<User> login(String email, String password) {
        // Optional<User> user = userRepository.findByEmailIgnoreCase(email);
        // return user.filter(u -> encoder.matches(password, u.getPasswordHash()));
        return Optional.empty(); // placeholder
    }

    /** Get currently authenticated user from security context. */
    public Optional<User> getCurrentUser() {
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // String email = auth.getName();
        // return userRepository.findByEmailIgnoreCase(email);
        return Optional.empty(); // placeholder
    }

    /** Logout — Spring Security invalidates session automatically. */
    public void logout() { /* Handled by Spring Security logout filter */ }

    /** Total citizen (non-admin) users count. */
    public long countUsers() {
        // return userRepository.countByRole(User.Role.USER);
        return 0;
    }

    private String generateAvatar(String name) {
        if (name == null || name.isBlank()) return "?";
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) { if (sb.length() < 2) sb.append(Character.toUpperCase(part.charAt(0))); }
        return sb.toString();
    }
}
