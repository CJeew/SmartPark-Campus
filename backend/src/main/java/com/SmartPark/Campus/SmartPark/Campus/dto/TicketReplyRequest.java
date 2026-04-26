package com.SmartPark.Campus.SmartPark.Campus.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketReplyRequest {
    @NotBlank(message = "Message cannot be empty")
    private String message;

    public TicketReplyRequest() {
    }

    public TicketReplyRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
