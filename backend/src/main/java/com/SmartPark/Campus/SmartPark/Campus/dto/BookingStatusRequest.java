package com.SmartPark.Campus.SmartPark.Campus.dto;

public class BookingStatusRequest {
    private String status;
    private String reason;

    public BookingStatusRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
