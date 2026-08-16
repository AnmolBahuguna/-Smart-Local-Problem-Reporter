package com.civicreport.controller;

import com.civicreport.model.User;
import com.civicreport.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController — Handles user registration and login.
 *
 * Endpoints:
 *   POST /api/auth/register  — Register a new user
 *   POST /api/auth/login     — Login and receive session token
 *   POST /api/auth/logout    — Logout (invalidate session)
 *   GET  /api/auth/me        — Get current user profile
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ── Register ───────────────────────────────────────────────
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

    // ── Login ──────────────────────────────────────────────────
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

    // ── Get current user ───────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return userService.getCurrentUser()
            .map(user -> ResponseEntity.ok(sanitize(user)))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Not authenticated")));
    }

    // ── Logout ─────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        userService.logout();
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }

    // ── Helpers ────────────────────────────────────────────────
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

    // ── Request DTOs ───────────────────────────────────────────
    record RegisterRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email           String email,
        @NotBlank @Size(min = 6)   String password,
        @Size(max = 20)            String phone,
                                   String role
    ) {}

    record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank        String password
    ) {}
}


// ── ComplaintController ────────────────────────────────────────
package com.civicreport.controller;

import com.civicreport.model.Complaint;
import com.civicreport.service.ComplaintService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

/**
 * ComplaintController — CRUD operations for complaints.
 *
 * Endpoints:
 *   POST   /api/complaints              — Submit new complaint (user)
 *   GET    /api/complaints              — Get current user's complaints (user)
 *   GET    /api/complaints/{id}         — Get single complaint
 *   PUT    /api/complaints/{id}/status  — Update status (admin)
 *   GET    /api/admin/complaints        — Get ALL complaints (admin)
 *   POST   /api/complaints/{id}/feedback — Submit feedback
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // ── Submit complaint ───────────────────────────────────────
    @PostMapping("/complaints")
    public ResponseEntity<?> submitComplaint(
            @RequestParam("categoryId")   Integer categoryId,
            @RequestParam("title")        String title,
            @RequestParam("description")  String description,
            @RequestParam("location")     String location,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Complaint c = complaintService.create(categoryId, title, description, location, image);
            return ResponseEntity.ok(Map.of("success", true, "complaintId", c.getComplaintId(),
                "message", "Complaint submitted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── Get user's complaints ──────────────────────────────────
    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getUserComplaints() {
        return ResponseEntity.ok(complaintService.getMyComplaints());
    }

    // ── Get single complaint ───────────────────────────────────
    @GetMapping("/complaints/{id}")
    public ResponseEntity<?> getComplaint(@PathVariable Integer id) {
        return complaintService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ── Admin: Get all complaints ──────────────────────────────
    @GetMapping("/admin/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(complaintService.getAll(statusId, categoryId));
    }

    // ── Admin: Update status ───────────────────────────────────
    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody StatusUpdateRequest req) {
        try {
            Complaint c = complaintService.updateStatus(id, req.statusId(), req.adminNote());
            return ResponseEntity.ok(Map.of("success", true, "message", "Status updated", "complaint", c));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── Submit feedback ────────────────────────────────────────
    @PostMapping("/complaints/{id}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Integer id,
            @Valid @RequestBody FeedbackRequest req) {
        try {
            complaintService.submitFeedback(id, req.feedbackText(), req.rating());
            return ResponseEntity.ok(Map.of("success", true, "message", "Feedback submitted. Thank you!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── Admin: Stats ───────────────────────────────────────────
    @GetMapping("/admin/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(complaintService.getStats());
    }

    // ── DTOs ──────────────────────────────────────────────────
    record StatusUpdateRequest(Integer statusId, String adminNote) {}
    record FeedbackRequest(@NotBlank String feedbackText, @Min(1) @Max(5) Integer rating) {}
}
