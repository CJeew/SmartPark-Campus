package com.SmartPark.Campus.SmartPark.Campus.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalVehicles;
    private long activeUsers;
    private long totalBookings;
    private long pendingBookings;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalVehicles, long activeUsers,
                               long totalBookings, long pendingBookings) {
        this.totalUsers = totalUsers;
        this.totalVehicles = totalVehicles;
        this.activeUsers = activeUsers;
        this.totalBookings = totalBookings;
        this.pendingBookings = pendingBookings;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }
    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }
}
