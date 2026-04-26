package com.SmartPark.Campus.SmartPark.Campus.entity;

public class AvailabilityWindow {

    private String day;       // "WEEKDAYS" | "WEEKENDS" | "DAILY" | "MONDAY" etc.
    private String openTime;  // "07:00"
    private String closeTime; // "22:00"

    public AvailabilityWindow() {}

    public AvailabilityWindow(String day, String openTime, String closeTime) {
        this.day = day;
        this.openTime = openTime;
        this.closeTime = closeTime;
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public String getOpenTime() { return openTime; }
    public void setOpenTime(String openTime) { this.openTime = openTime; }
    public String getCloseTime() { return closeTime; }
    public void setCloseTime(String closeTime) { this.closeTime = closeTime; }
}
