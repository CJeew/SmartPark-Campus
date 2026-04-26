package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.AvailabilityWindow;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ParkingZoneRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @NotNull
    private ZoneType type;

    @Min(1)
    @NotNull
    private Integer totalCapacity;

    private Integer availableSlots;

    private ZoneStatus status;

    private String description;

    private List<AvailabilityWindow> availabilityWindows;

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
    public ZoneStatus getStatus() { return status; }
    public void setStatus(ZoneStatus status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<AvailabilityWindow> availabilityWindows) { this.availabilityWindows = availabilityWindows; }
}
