package com.SmartPark.Campus.SmartPark.Campus.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "helmet_rack_slots")
public class HelmetRackSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_code", nullable = false, unique = true)
    private String slotCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Column(name = "current_student_id")
    private String currentStudentId;

    @Column(name = "current_student_name")
    private String currentStudentName;

    @Column(name = "current_helmet_tag")
    private String currentHelmetTag;

    @Column(name = "last_check_in_at")
    private LocalDateTime lastCheckInAt;

    @Column(name = "flag_reason")
    private String flagReason;

    @Column(name = "flagged_by")
    private String flaggedBy;

    @Column(name = "flagged_at")
    private LocalDateTime flaggedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum SlotStatus {
        AVAILABLE,
        OCCUPIED,
        FLAGGED
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlotCode() {
        return slotCode;
    }

    public void setSlotCode(String slotCode) {
        this.slotCode = slotCode;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }

    public String getCurrentStudentId() {
        return currentStudentId;
    }

    public void setCurrentStudentId(String currentStudentId) {
        this.currentStudentId = currentStudentId;
    }

    public String getCurrentStudentName() {
        return currentStudentName;
    }

    public void setCurrentStudentName(String currentStudentName) {
        this.currentStudentName = currentStudentName;
    }

    public String getCurrentHelmetTag() {
        return currentHelmetTag;
    }

    public void setCurrentHelmetTag(String currentHelmetTag) {
        this.currentHelmetTag = currentHelmetTag;
    }

    public LocalDateTime getLastCheckInAt() {
        return lastCheckInAt;
    }

    public void setLastCheckInAt(LocalDateTime lastCheckInAt) {
        this.lastCheckInAt = lastCheckInAt;
    }

    public String getFlagReason() {
        return flagReason;
    }

    public void setFlagReason(String flagReason) {
        this.flagReason = flagReason;
    }

    public String getFlaggedBy() {
        return flaggedBy;
    }

    public void setFlaggedBy(String flaggedBy) {
        this.flaggedBy = flaggedBy;
    }

    public LocalDateTime getFlaggedAt() {
        return flaggedAt;
    }

    public void setFlaggedAt(LocalDateTime flaggedAt) {
        this.flaggedAt = flaggedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}