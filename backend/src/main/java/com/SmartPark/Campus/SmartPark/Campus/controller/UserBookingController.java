package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.BookingRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.BookingResponse;
import com.SmartPark.Campus.SmartPark.Campus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserBookingController {

    @Autowired
    private BookingService bookingService;

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

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) {
        try {
            BookingResponse booking = bookingService.cancelBooking(id, userId);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
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
