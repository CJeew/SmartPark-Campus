package com.SmartPark.Campus.SmartPark.Campus.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalVehicles;
    private long activeUsers;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalVehicles, long activeUsers) {
        this.totalUsers = totalUsers;
        this.totalVehicles = totalVehicles;
        this.activeUsers = activeUsers;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
}
