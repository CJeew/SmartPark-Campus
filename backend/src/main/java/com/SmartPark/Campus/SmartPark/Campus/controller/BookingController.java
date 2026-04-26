package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.BookingRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingStatusRequest;
import com.SmartPark.Campus.SmartPark.Campus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String dateRange
    ) {
        return ResponseEntity.ok(bookingService.getBookings(status, zone, dateRange));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody BookingStatusRequest request
    ) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request));
    }

    // User endpoints for creating and viewing bookings
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody BookingRequest request
    ) {
        try {
            BookingResponse booking = bookingService.createBooking(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<BookingResponse>> getUserBookings(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/user/status/{status}")
    public ResponseEntity<List<BookingResponse>> getUserBookingsByStatus(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String status
    ) {
        try {
            return ResponseEntity.ok(bookingService.getUserBookingsByStatus(userId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }
}
