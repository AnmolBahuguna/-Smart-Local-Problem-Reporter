package com.civicreport.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @NotBlank
    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    private String icon;
    private String color;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Category() {}

    public Category(Integer categoryId, String categoryName, String icon, String color) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.icon = icon;
        this.color = color;
    }

    public Integer getCategoryId()            { return categoryId; }
    public void    setCategoryId(Integer id)  { this.categoryId = id; }
    public String  getCategoryName()          { return categoryName; }
    public void    setCategoryName(String n)  { this.categoryName = n; }
    public String  getIcon()                  { return icon; }
    public void    setIcon(String icon)       { this.icon = icon; }
    public String  getColor()                 { return color; }
    public void    setColor(String color)     { this.color = color; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
}

