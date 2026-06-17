package com.smartcare.model;

import jakarta.persistence.*;

@Entity
@Table(name = "queues")
public class Queue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private Integer currentToken;
    private Integer nextToken;
    private Integer estimatedWaitTime;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Integer getCurrentToken() { return currentToken; }
    public void setCurrentToken(Integer currentToken) { this.currentToken = currentToken; }
    public Integer getNextToken() { return nextToken; }
    public void setNextToken(Integer nextToken) { this.nextToken = nextToken; }
    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }
}
