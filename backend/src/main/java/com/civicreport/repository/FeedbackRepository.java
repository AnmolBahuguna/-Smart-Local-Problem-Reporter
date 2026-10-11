package com.civicreport.repository;

import com.civicreport.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByComplaintComplaintId(Integer complaintId);
    boolean existsByComplaintComplaintIdAndUserUserId(Integer complaintId, Integer userId);
}

