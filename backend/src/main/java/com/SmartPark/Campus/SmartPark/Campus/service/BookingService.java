package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.BookingRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingStatusRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.Booking;
import com.SmartPark.Campus.SmartPark.Campus.entity.NotificationType;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingSlot;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.BookingRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.ParkingSlotRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ParkingSlotRepository slotRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<BookingResponse> getBookings(String statusStr, String zone, String dateRange) {
        String status = null;
        if (statusStr != null && !statusStr.isBlank() && !statusStr.equalsIgnoreCase("all")) {
            status = statusStr.toUpperCase();
        }

        String zoneName = (zone != null && !zone.isBlank() && !zone.equalsIgnoreCase("all")) ? zone : null;

        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        if (dateRange != null) {
            switch (dateRange.toLowerCase()) {
                case "today" -> {
                    startDate = LocalDateTime.now().with(LocalTime.MIN);
                    endDate = LocalDateTime.now().with(LocalTime.MAX);
                }
                case "week" -> startDate = LocalDateTime.now().minusDays(7);
                case "month" -> startDate = LocalDateTime.now().minusDays(30);
            }
        }

            final String statusFilter = status;
            final String zoneFilter = zoneName;
            final LocalDateTime startDateFilter = startDate;
            final LocalDateTime endDateFilter = endDate;

        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .filter(booking -> statusFilter == null || booking.getStatus().name().equals(statusFilter))
                .filter(booking -> zoneFilter == null || booking.getSlot().getZone().getName().equals(zoneFilter))
                .filter(booking -> startDateFilter == null || !booking.getCreatedAt().isBefore(startDateFilter))
                .filter(booking -> endDateFilter == null || !booking.getCreatedAt().isAfter(endDateFilter))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        // Validate input
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end times are required");
        }
        
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        
        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot book for past times");
        }

        // Get user and slot
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ParkingSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getSlotId(),
                request.getStartTime(),
                request.getEndTime()
        );
        
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Selected time slot has overlapping booking(s)");
        }

        // Create booking
        Booking booking = new Booking(user, slot, request.getStartTime(), request.getEndTime());
        booking.setStatus(Booking.BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);

        // Notify user that their booking request was submitted
        String slotLabel = slot.getSlotNumber() + " (" + slot.getZone().getName() + ")";
        notificationService.createNotification(
                userId,
                "Booking Submitted",
                "Your booking request for Slot " + slotLabel + " has been submitted and is pending approval.",
                NotificationType.BOOKING_APPROVED
        );

        return toResponse(saved);
    }

    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUser_Id(userId)
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot cancel a rejected booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.getSlot().setIsAvailable(true);
        Booking saved = bookingRepository.save(booking);

        // Notify user
        String slotLabel = booking.getSlot().getSlotNumber() + " (" + booking.getSlot().getZone().getName() + ")";
        notificationService.createNotification(
                userId,
                "Booking Cancelled",
                "Your booking for Slot " + slotLabel + " has been cancelled.",
                NotificationType.BOOKING_CANCELLED
        );

        return toResponse(saved);
    }

    public List<BookingResponse> getUserBookingsByStatus(Long userId, String status) {
        try {
            Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            return bookingRepository.findByUser_IdAndStatus(userId, bookingStatus)
                    .stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid booking status: " + status);
        }
    }
    public BookingResponse updateStatus(Long bookingId, BookingStatusRequest request) {
        Optional<Booking> opt = bookingRepository.findById(bookingId);
        if (opt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = opt.get();
        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(request.getStatus().toUpperCase());
        booking.setStatus(newStatus);

        if (newStatus == Booking.BookingStatus.REJECTED && request.getReason() != null) {
            booking.setReason(request.getReason());
        }

        if (newStatus == Booking.BookingStatus.APPROVED) {
            booking.getSlot().setIsAvailable(false);
        } else if (newStatus == Booking.BookingStatus.REJECTED || newStatus == Booking.BookingStatus.CANCELLED) {
            booking.getSlot().setIsAvailable(true);
        }

        Booking saved = bookingRepository.save(booking);

        // Fire notification to booking owner
        Long ownerId = booking.getUser().getId();
        String slotLabel = booking.getSlot().getSlotNumber() + " (" + booking.getSlot().getZone().getName() + ")";

        if (newStatus == Booking.BookingStatus.APPROVED) {
            notificationService.createNotification(
                    ownerId,
                    "Booking Approved",
                    "Your booking for Slot " + slotLabel + " has been approved.",
                    NotificationType.BOOKING_APPROVED
            );
        } else if (newStatus == Booking.BookingStatus.REJECTED) {
            String reason = request.getReason() != null ? ": " + request.getReason() : ".";
            notificationService.createNotification(
                    ownerId,
                    "Booking Rejected",
                    "Your booking request for Slot " + slotLabel + " was rejected" + reason,
                    NotificationType.BOOKING_REJECTED
            );
        } else if (newStatus == Booking.BookingStatus.CANCELLED) {
            notificationService.createNotification(
                    ownerId,
                    "Booking Cancelled",
                    "Your booking for Slot " + slotLabel + " has been cancelled.",
                    NotificationType.BOOKING_CANCELLED
            );
        }

        return toResponse(saved);
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getUser().getId(),
                b.getUser().getFullName(),
                b.getUser().getEmail(),
                b.getUser().getUniversityId(),
                b.getSlot().getId(),
                b.getSlot().getSlotNumber(),
                b.getSlot().getZone().getId(),
                b.getSlot().getZone().getName(),
                b.getSlot().getVehicleType().name(),
                b.getStatus().name(),
                b.getReason(),
                b.getStartTime(),
                b.getEndTime(),
                b.getCreatedAt()
        );
    }
}
