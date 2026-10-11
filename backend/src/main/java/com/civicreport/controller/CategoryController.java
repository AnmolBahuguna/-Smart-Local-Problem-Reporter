package com.civicreport.controller;

import com.civicreport.model.Category;
import com.civicreport.model.Status;
import com.civicreport.repository.CategoryRepository;
import com.civicreport.repository.StatusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final StatusRepository statusRepository;

    public CategoryController(CategoryRepository categoryRepository, StatusRepository statusRepository) {
        this.categoryRepository = categoryRepository;
        this.statusRepository = statusRepository;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<Status>> getAllStatuses() {
        return ResponseEntity.ok(statusRepository.findAll());
    }
}

