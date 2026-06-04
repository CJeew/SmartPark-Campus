package com.SmartPark.Campus.SmartPark.Campus.dto;

public class HelmetRackStatsResponse {
    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
    private long flaggedSlots;
    private double occupancyRate;

    public HelmetRackStatsResponse(long totalSlots, long availableSlots, long occupiedSlots,
                                   long flaggedSlots, double occupancyRate) {
        this.totalSlots = totalSlots;
        this.availableSlots = availableSlots;
        this.occupiedSlots = occupiedSlots;
        this.flaggedSlots = flaggedSlots;
        this.occupancyRate = occupancyRate;
    }

    public long getTotalSlots() {
        return totalSlots;
    }

    public long getAvailableSlots() {
        return availableSlots;
    }

    public long getOccupiedSlots() {
        return occupiedSlots;
    }

    public long getFlaggedSlots() {
        return flaggedSlots;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }
}