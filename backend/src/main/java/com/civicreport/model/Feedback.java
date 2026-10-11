package com.civicreport.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    @JsonIgnore
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @Min(1) @Max(5)
    @Column(nullable = false)
    private Integer rating;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {}

    public Feedback(Complaint complaint, User user, String feedbackText, Integer rating) {
        this.complaint = complaint;
        this.user = user;
        this.feedbackText = feedbackText;
        this.rating = rating;
    }

    public Integer    getFeedbackId()           { return feedbackId; }
    public void       setFeedbackId(Integer id) { this.feedbackId = id; }
    public Complaint  getComplaint()            { return complaint; }
    public void       setComplaint(Complaint c) { this.complaint = c; }
    public User       getUser()                 { return user; }
    public void       setUser(User u)           { this.user = u; }
    public String     getFeedbackText()         { return feedbackText; }
    public void       setFeedbackText(String t) { this.feedbackText = t; }
    public Integer    getRating()               { return rating; }
    public void       setRating(Integer r)      { this.rating = r; }
    public LocalDateTime getCreatedAt()         { return createdAt; }
}

