package com.SmartPark.Campus.SmartPark.Campus.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot slot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "reason")
    private String reason;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }

    public Booking() {}

    public Booking(User user, ParkingSlot slot, LocalDateTime startTime, LocalDateTime endTime) {
        this.user = user;
        this.slot = slot;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ParkingSlot getSlot() { return slot; }
    public void setSlot(ParkingSlot slot) { this.slot = slot; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
