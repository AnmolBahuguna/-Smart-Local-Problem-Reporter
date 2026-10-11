package com.civicreport.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer complaintId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "complaints"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
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

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbackList = new ArrayList<>();

    public Complaint() {}

    public Complaint(User user, Category category, Status status, String title, String description, String location, String imagePath) {
        this.user = user;
        this.category = category;
        this.status = status;
        this.title = title;
        this.description = description;
        this.location = location;
        this.imagePath = imagePath;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Integer       getComplaintId()            { return complaintId; }
    public void          setComplaintId(Integer id)  { this.complaintId = id; }
    public User          getUser()                   { return user; }
    public void          setUser(User user)          { this.user = user; }
    public Category      getCategory()               { return category; }
    public void          setCategory(Category c)     { this.category = c; }
    public Status        getStatus()                 { return status; }
    public void          setStatus(Status s)         { this.status = s; }
    public String        getTitle()                  { return title; }
    public void          setTitle(String title)      { this.title = title; }
    public String        getDescription()            { return description; }
    public void          setDescription(String d)    { this.description = d; }
    public String        getLocation()               { return location; }
    public void          setLocation(String l)       { this.location = l; }
    public String        getImagePath()              { return imagePath; }
    public void          setImagePath(String p)      { this.imagePath = p; }
    public String        getAdminNote()              { return adminNote; }
    public void          setAdminNote(String n)      { this.adminNote = n; }
    public LocalDateTime getCreatedAt()              { return createdAt; }
    public LocalDateTime getUpdatedAt()              { return updatedAt; }
    public List<Feedback> getFeedbackList()          { return feedbackList; }
    public void          setFeedbackList(List<Feedback> f) { this.feedbackList = f; }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
