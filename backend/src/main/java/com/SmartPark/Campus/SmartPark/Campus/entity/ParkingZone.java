package com.SmartPark.Campus.SmartPark.Campus.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parking_zones")
public class ParkingZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @NotNull
    @Convert(converter = ZoneTypeConverter.class)
    @Column
    private ZoneType type;

    @Min(1)
    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @Column(name = "available_slots")
    private Integer availableSlots;

    @Convert(converter = ZoneStatusConverter.class)
    @Column(nullable = false)
    private ZoneStatus status = ZoneStatus.ACTIVE;

    @Column
    private String description;

    @Convert(converter = AvailabilityWindowConverter.class)
    @Column(name = "availability_windows", columnDefinition = "text")
    private List<AvailabilityWindow> availabilityWindows;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ParkingSlot> slots = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ParkingZone() {}

    public ParkingZone(String name, String location, ZoneType type, Integer totalCapacity,
                       Integer availableSlots, ZoneStatus status, String description) {
        this.name = name;
        this.location = location;
        this.type = type;
        this.totalCapacity = totalCapacity;
        this.availableSlots = availableSlots;
        this.status = status != null ? status : ZoneStatus.ACTIVE;
        this.description = description;
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
    public ZoneStatus getStatus() { return status; }
    public void setStatus(ZoneStatus status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<AvailabilityWindow> availabilityWindows) { this.availabilityWindows = availabilityWindows; }
    public List<ParkingSlot> getSlots() { return slots; }
    public void setSlots(List<ParkingSlot> slots) { this.slots = slots; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
