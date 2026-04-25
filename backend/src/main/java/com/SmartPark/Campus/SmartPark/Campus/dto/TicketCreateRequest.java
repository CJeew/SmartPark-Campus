package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket.ContactMethod;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket.TicketPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketCreateRequest {

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    @Size(max = 40)
    private String category;

    @NotNull
    private TicketPriority priority;

    @NotBlank
    @Size(max = 120)
    private String location;

    @Size(max = 40)
    private String resourceType;

    @Size(max = 80)
    private String resourceId;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    private ContactMethod preferredContactMethod;

    @Size(max = 80)
    private String preferredContactName;

    @Email
    @Size(max = 120)
    private String preferredContactEmail;

    @Size(max = 30)
    private String preferredContactPhone;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContactMethod getPreferredContactMethod() {
        return preferredContactMethod;
    }

    public void setPreferredContactMethod(ContactMethod preferredContactMethod) {
        this.preferredContactMethod = preferredContactMethod;
    }

    public String getPreferredContactName() {
        return preferredContactName;
    }

    public void setPreferredContactName(String preferredContactName) {
        this.preferredContactName = preferredContactName;
    }

    public String getPreferredContactEmail() {
        return preferredContactEmail;
    }

    public void setPreferredContactEmail(String preferredContactEmail) {
        this.preferredContactEmail = preferredContactEmail;
    }

    public String getPreferredContactPhone() {
        return preferredContactPhone;
    }

    public void setPreferredContactPhone(String preferredContactPhone) {
        this.preferredContactPhone = preferredContactPhone;
    }
}
