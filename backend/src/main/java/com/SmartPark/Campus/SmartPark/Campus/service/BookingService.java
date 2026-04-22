package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.BookingResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingStatusRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.Booking;
import com.SmartPark.Campus.SmartPark.Campus.repository.BookingRepository;
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

        return toResponse(bookingRepository.save(booking));
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
