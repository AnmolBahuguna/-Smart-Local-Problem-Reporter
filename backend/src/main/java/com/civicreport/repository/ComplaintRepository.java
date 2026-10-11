package com.civicreport.repository;

import com.civicreport.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {

    List<Complaint> findByUserUserIdOrderByCreatedAtDesc(Integer userId);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:statusId IS NULL OR c.status.statusId = :statusId) AND " +
           "(:categoryId IS NULL OR c.category.categoryId = :categoryId) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> findByFilter(@Param("statusId") Integer statusId,
                                 @Param("categoryId") Integer categoryId);

    long countByStatusStatusId(Integer statusId);
}

