package com.civicreport.service;

import com.civicreport.model.*;
import com.civicreport.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final StatusRepository statusRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    @Value("${app.upload.dir:./uploads/complaints}")
    private String uploadDir;

    public ComplaintService(ComplaintRepository complaintRepository,
                            CategoryRepository categoryRepository,
                            StatusRepository statusRepository,
                            FeedbackRepository feedbackRepository,
                            UserService userService) {
        this.complaintRepository = complaintRepository;
        this.categoryRepository = categoryRepository;
        this.statusRepository = statusRepository;
        this.feedbackRepository = feedbackRepository;
        this.userService = userService;
    }

    public Complaint create(Integer categoryId, String title, String description, String location, MultipartFile image) throws IOException {
        User user = userService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("You must be logged in to submit a complaint."));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + categoryId));

        // Default status is Pending (id = 1)
        Status pendingStatus = statusRepository.findById(1)
                .orElseGet(() -> statusRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new IllegalStateException("No status found in database")));

        String savedImagePath = null;
        if (image != null && !image.isEmpty()) {
            Path targetFolder = Paths.get(uploadDir);
            if (!Files.exists(targetFolder)) {
                Files.createDirectories(targetFolder);
            }
            String ext = "";
            String orig = image.getOriginalFilename();
            if (orig != null && orig.contains(".")) {
                ext = orig.substring(orig.lastIndexOf('.'));
            }
            String filename = "cmp_" + UUID.randomUUID() + ext;
            Path filePath = targetFolder.resolve(filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            savedImagePath = filename;
        }

        Complaint complaint = new Complaint(user, category, pendingStatus, title, description, location, savedImagePath);
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getMyComplaints() {
        User user = userService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));
        return complaintRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
    }

    public Optional<Complaint> findById(Integer id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getAll(Integer statusId, Integer categoryId) {
        return complaintRepository.findByFilter(statusId, categoryId);
    }

    public Complaint updateStatus(Integer complaintId, Integer statusId, String adminNote) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + complaintId));

        if (statusId != null) {
            Status newStatus = statusRepository.findById(statusId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid status ID: " + statusId));
            complaint.setStatus(newStatus);
        }

        if (adminNote != null) {
            complaint.setAdminNote(adminNote.trim());
        }

        return complaintRepository.save(complaint);
    }

    public Feedback submitFeedback(Integer complaintId, String feedbackText, Integer rating) {
        User user = userService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("Not authenticated"));

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + complaintId));

        if (feedbackRepository.existsByComplaintComplaintIdAndUserUserId(complaintId, user.getUserId())) {
            throw new IllegalArgumentException("You have already submitted feedback for this complaint.");
        }

        Feedback feedback = new Feedback(complaint, user, feedbackText, rating);
        return feedbackRepository.save(feedback);
    }

    public Map<String, Object> getStats() {
        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatusStatusId(1);
        long inProgress = complaintRepository.countByStatusStatusId(2);
        long resolved = complaintRepository.countByStatusStatusId(3);
        long citizens = userService.countUsers();

        double resolutionRate = total > 0 ? ((double) resolved / total) * 100.0 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);
        stats.put("resolved", resolved);
        stats.put("citizens", citizens);
        stats.put("resolutionRate", Math.round(resolutionRate * 10.0) / 10.0);
        return stats;
    }
}

