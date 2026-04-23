package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.AvailabilityWindow;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneType;

import java.time.LocalDateTime;
import java.util.List;

public class ParkingZoneResponse {

    private Long id;
    private String name;
    private String location;
    private ZoneType type;
    private Integer totalCapacity;
    private Integer availableSlots;
    private Double occupancyRate;
    private ZoneStatus status;
    private String description;
    private List<AvailabilityWindow> availabilityWindows;
    private List<SlotDto> slots;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class SlotDto {
        private Long id;
        private String slotNumber;
        private String vehicleType;
        private boolean isAvailable;

        public SlotDto() {}

        public SlotDto(Long id, String slotNumber, String vehicleType, boolean isAvailable) {
            this.id = id;
            this.slotNumber = slotNumber;
            this.vehicleType = vehicleType;
            this.isAvailable = isAvailable;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSlotNumber() { return slotNumber; }
        public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }
        public String getVehicleType() { return vehicleType; }
        public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
        public boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public ZoneType getType() { return type; }
    public void setType(ZoneType type) { this.type = type; }
    public Integer getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(Integer totalCapacity) { this.totalCapacity = totalCapacity; }
    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }
    public Double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Double occupancyRate) { this.occupancyRate = occupancyRate; }
    public ZoneStatus getStatus() { return status; }
    public void setStatus(ZoneStatus status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<AvailabilityWindow> availabilityWindows) { this.availabilityWindows = availabilityWindows; }
    public List<SlotDto> getSlots() { return slots; }
    public void setSlots(List<SlotDto> slots) { this.slots = slots; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
