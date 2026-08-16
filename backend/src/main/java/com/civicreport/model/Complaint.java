package com.civicreport.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

// ── Complaint Entity ───────────────────────────────────────────
@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer complaintId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false)
    private String location;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ── Getters & Setters ──────────────────────────────────────
    public Integer   getComplaintId()                    { return complaintId; }
    public User      getUser()                           { return user; }
    public void      setUser(User user)                  { this.user = user; }
    public Category  getCategory()                       { return category; }
    public void      setCategory(Category c)             { this.category = c; }
    public Status    getStatus()                         { return status; }
    public void      setStatus(Status s)                 { this.status = s; }
    public String    getTitle()                          { return title; }
    public void      setTitle(String title)              { this.title = title; }
    public String    getDescription()                    { return description; }
    public void      setDescription(String d)            { this.description = d; }
    public String    getLocation()                       { return location; }
    public void      setLocation(String l)               { this.location = l; }
    public String    getImagePath()                      { return imagePath; }
    public void      setImagePath(String p)              { this.imagePath = p; }
    public String    getAdminNote()                      { return adminNote; }
    public void      setAdminNote(String n)              { this.adminNote = n; }
    public LocalDateTime getCreatedAt()                  { return createdAt; }
    public LocalDateTime getUpdatedAt()                  { return updatedAt; }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}


// ── Category Entity ────────────────────────────────────────────
@Entity
@Table(name = "categories")
class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @NotBlank
    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    private String icon;
    private String color;

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Integer getCategoryId()            { return categoryId; }
    public String  getCategoryName()          { return categoryName; }
    public void    setCategoryName(String n)  { this.categoryName = n; }
    public String  getIcon()                  { return icon; }
    public void    setIcon(String icon)       { this.icon = icon; }
    public String  getColor()                 { return color; }
    public void    setColor(String color)     { this.color = color; }
}


// ── Status Entity ──────────────────────────────────────────────
@Entity
@Table(name = "statuses")
class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statusId;

    @NotBlank
    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;

    public Integer getStatusId()            { return statusId; }
    public String  getStatusName()          { return statusName; }
    public void    setStatusName(String n)  { this.statusName = n; }
}


// ── Feedback Entity ────────────────────────────────────────────
@Entity
@Table(name = "feedback")
class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
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
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    public Integer    getFeedbackId()           { return feedbackId; }
    public Complaint  getComplaint()            { return complaint; }
    public void       setComplaint(Complaint c) { this.complaint = c; }
    public User       getUser()                 { return user; }
    public void       setUser(User u)           { this.user = u; }
    public String     getFeedbackText()         { return feedbackText; }
    public void       setFeedbackText(String t) { this.feedbackText = t; }
    public Integer    getRating()               { return rating; }
    public void       setRating(Integer r)      { this.rating = r; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
}
