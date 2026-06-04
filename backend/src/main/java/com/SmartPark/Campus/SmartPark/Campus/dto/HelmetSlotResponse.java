package com.SmartPark.Campus.SmartPark.Campus.dto;

import java.time.LocalDateTime;

public class HelmetSlotResponse {
    private Long id;
    private String slotCode;
    private String status;
    private String currentStudentId;
    private String currentStudentName;
    private String currentHelmetTag;
    private String flagReason;
    private String flaggedBy;
    private LocalDateTime flaggedAt;
    private LocalDateTime lastCheckInAt;

    public HelmetSlotResponse(Long id, String slotCode, String status, String currentStudentId,
                              String currentStudentName, String currentHelmetTag, String flagReason,
                              String flaggedBy, LocalDateTime flaggedAt, LocalDateTime lastCheckInAt) {
        this.id = id;
        this.slotCode = slotCode;
        this.status = status;
        this.currentStudentId = currentStudentId;
        this.currentStudentName = currentStudentName;
        this.currentHelmetTag = currentHelmetTag;
        this.flagReason = flagReason;
        this.flaggedBy = flaggedBy;
        this.flaggedAt = flaggedAt;
        this.lastCheckInAt = lastCheckInAt;
    }

    public Long getId() {
        return id;
    }

    public String getSlotCode() {
        return slotCode;
    }

    public String getStatus() {
        return status;
    }

    public String getCurrentStudentId() {
        return currentStudentId;
    }

    public String getCurrentStudentName() {
        return currentStudentName;
    }

    public String getCurrentHelmetTag() {
        return currentHelmetTag;
    }

    public String getFlagReason() {
        return flagReason;
    }

    public String getFlaggedBy() {
        return flaggedBy;
    }

    public LocalDateTime getFlaggedAt() {
        return flaggedAt;
    }

    public LocalDateTime getLastCheckInAt() {
        return lastCheckInAt;
    }
}