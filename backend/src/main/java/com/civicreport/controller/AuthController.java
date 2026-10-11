package com.civicreport.controller;

import com.civicreport.model.User;
import com.civicreport.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController — Handles user registration, login, logout, and current user profile.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User user = userService.register(req.name(), req.email(), req.password(), req.phone(), req.role());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful",
                "user", sanitize(user)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userService.login(req.email(), req.password())
            .map(user -> ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "user", sanitize(user),
                "role", user.getRole().name().toLowerCase()
            )))
            .orElse(ResponseEntity.status(401).body(Map.of(
                "success", false,
                "error", "Invalid email or password"
            )));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return userService.getCurrentUser()
            .map(user -> ResponseEntity.ok(sanitize(user)))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Not authenticated")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        userService.logout();
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }

    private Map<String, Object> sanitize(User u) {
        return Map.of(
            "userId",    u.getUserId(),
            "name",      u.getName(),
            "email",     u.getEmail(),
            "phone",     u.getPhone() != null ? u.getPhone() : "",
            "role",      u.getRole().name().toLowerCase(),
            "avatar",    u.getAvatar() != null ? u.getAvatar() : "",
            "createdAt", u.getCreatedAt().toString()
        );
    }

    public record RegisterRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email           String email,
        @NotBlank @Size(min = 6)   String password,
        @Size(max = 20)            String phone,
                                   String role
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank        String password
    ) {}
}

