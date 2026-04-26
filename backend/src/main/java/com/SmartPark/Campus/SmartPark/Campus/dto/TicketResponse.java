package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket.ContactMethod;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket.TicketPriority;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {
    private Long id;
    private String ticketId;
    private String title;
    private String category;
    private TicketPriority priority;
    private TicketStatus status;
    private String location;
    private String resourceType;
    private String resourceId;
    private String description;
    private ContactMethod preferredContactMethod;
    private String preferredContactName;
    private String preferredContactEmail;
    private String preferredContactPhone;
    private List<TicketAttachmentResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private String reporterName;
    private String reporterEmail;
    private List<TicketReplyResponse> replies;

    public TicketResponse(Long id,
                          String ticketId,
                          String title,
                          String category,
                          TicketPriority priority,
                          TicketStatus status,
                          String location,
                          String resourceType,
                          String resourceId,
                          String description,
                          ContactMethod preferredContactMethod,
                          String preferredContactName,
                          String preferredContactEmail,
                          String preferredContactPhone,
                          List<TicketAttachmentResponse> attachments,
                          LocalDateTime createdAt,
                          LocalDateTime updatedAt,
                          Long assignedTechnicianId,
                          String assignedTechnicianName,
                          String reporterName,
                          String reporterEmail,
                          List<TicketReplyResponse> replies) {
        this.id = id;
        this.ticketId = ticketId;
        this.title = title;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.location = location;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.description = description;
        this.preferredContactMethod = preferredContactMethod;
        this.preferredContactName = preferredContactName;
        this.preferredContactEmail = preferredContactEmail;
        this.preferredContactPhone = preferredContactPhone;
        this.attachments = attachments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.assignedTechnicianId = assignedTechnicianId;
        this.assignedTechnicianName = assignedTechnicianName;
        this.reporterName = reporterName;
        this.reporterEmail = reporterEmail;
        this.replies = replies;
    }

    public Long getId() {
        return id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public String getLocation() {
        return location;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getDescription() {
        return description;
    }

    public ContactMethod getPreferredContactMethod() {
        return preferredContactMethod;
    }

    public String getPreferredContactName() {
        return preferredContactName;
    }

    public String getPreferredContactEmail() {
        return preferredContactEmail;
    }

    public String getPreferredContactPhone() {
        return preferredContactPhone;
    }

    public List<TicketAttachmentResponse> getAttachments() {
        return attachments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Long getAssignedTechnicianId() {
        return assignedTechnicianId;
    }

    public String getAssignedTechnicianName() {
        return assignedTechnicianName;
    }

    public String getReporterName() {
        return reporterName;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public List<TicketReplyResponse> getReplies() {
        return replies;
    }
}
