package com.civicreport.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "statuses")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statusId;

    @NotBlank
    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;

    public Status() {}

    public Status(Integer statusId, String statusName) {
        this.statusId = statusId;
        this.statusName = statusName;
    }

    public Integer getStatusId()            { return statusId; }
    public void    setStatusId(Integer id)  { this.statusId = id; }
    public String  getStatusName()          { return statusName; }
    public void    setStatusName(String n)  { this.statusName = n; }
}

