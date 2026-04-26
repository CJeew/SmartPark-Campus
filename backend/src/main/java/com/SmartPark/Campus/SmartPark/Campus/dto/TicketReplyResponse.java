package com.SmartPark.Campus.SmartPark.Campus.dto;

import java.time.LocalDateTime;

public class TicketReplyResponse {
    private Long id;
    private String userName;
    private String message;
    private LocalDateTime createdAt;

    public TicketReplyResponse() {
    }

    public TicketReplyResponse(Long id, String userName, String message, LocalDateTime createdAt) {
        this.id = id;
        this.userName = userName;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
