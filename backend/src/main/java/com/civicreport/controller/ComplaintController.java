package com.civicreport.controller;

import com.civicreport.model.Complaint;
import com.civicreport.model.Feedback;
import com.civicreport.service.ComplaintService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * ComplaintController — REST API endpoints for complaints and admin operations.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
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
            return ResponseEntity.ok(Map.of(
                "success", true,
                "complaintId", c.getComplaintId(),
                "message", "Complaint submitted successfully!"
            ));
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
            Feedback f = complaintService.submitFeedback(id, req.feedbackText(), req.rating());
            return ResponseEntity.ok(Map.of("success", true, "message", "Feedback submitted. Thank you!", "feedbackId", f.getFeedbackId()));
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
    public record StatusUpdateRequest(Integer statusId, String adminNote) {}
    public record FeedbackRequest(@NotBlank String feedbackText, @NotNull @Min(1) @Max(5) Integer rating) {}
}

