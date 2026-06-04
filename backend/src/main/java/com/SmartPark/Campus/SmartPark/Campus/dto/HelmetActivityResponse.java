package com.SmartPark.Campus.SmartPark.Campus.dto;

import java.time.LocalDateTime;

public class HelmetActivityResponse {
    private Long id;
    private String slotCode;
    private String actionType;
    private String studentId;
    private String studentName;
    private String helmetTag;
    private String reason;
    private String performedBy;
    private LocalDateTime performedAt;

    public HelmetActivityResponse(Long id, String slotCode, String actionType, String studentId,
                                  String studentName, String helmetTag, String reason,
                                  String performedBy, LocalDateTime performedAt) {
        this.id = id;
        this.slotCode = slotCode;
        this.actionType = actionType;
        this.studentId = studentId;
        this.studentName = studentName;
        this.helmetTag = helmetTag;
        this.reason = reason;
        this.performedBy = performedBy;
        this.performedAt = performedAt;
    }

    public Long getId() {
        return id;
    }

    public String getSlotCode() {
        return slotCode;
    }

    public String getActionType() {
        return actionType;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getHelmetTag() {
        return helmetTag;
    }

    public String getReason() {
        return reason;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public LocalDateTime getPerformedAt() {
        return performedAt;
    }
}