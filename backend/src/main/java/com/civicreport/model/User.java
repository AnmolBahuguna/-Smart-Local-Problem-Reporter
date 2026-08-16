package com.civicreport.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

// ── User Entity ────────────────────────────────────────────────
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Size(max = 5)
    private String avatar;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Complaint> complaints;

    public enum Role { USER, ADMIN }

    // ── Getters & Setters ──────────────────────────────────────
    public Integer getUserId()                    { return userId; }
    public void    setUserId(Integer userId)      { this.userId = userId; }
    public String  getName()                      { return name; }
    public void    setName(String name)           { this.name = name; }
    public String  getEmail()                     { return email; }
    public void    setEmail(String email)         { this.email = email; }
    public String  getPasswordHash()              { return passwordHash; }
    public void    setPasswordHash(String h)      { this.passwordHash = h; }
    public String  getPhone()                     { return phone; }
    public void    setPhone(String phone)         { this.phone = phone; }
    public Role    getRole()                      { return role; }
    public void    setRole(Role role)             { this.role = role; }
    public String  getAvatar()                    { return avatar; }
    public void    setAvatar(String avatar)       { this.avatar = avatar; }
    public Boolean getIsActive()                  { return isActive; }
    public void    setIsActive(Boolean a)         { this.isActive = a; }
    public LocalDateTime getCreatedAt()           { return createdAt; }
    public LocalDateTime getUpdatedAt()           { return updatedAt; }
    public List<Complaint> getComplaints()        { return complaints; }

    @PreUpdate
    public void preUpdate()                       { this.updatedAt = LocalDateTime.now(); }
}
