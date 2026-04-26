package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneResponse.SlotDto;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingSlot;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingZone;
import com.SmartPark.Campus.SmartPark.Campus.entity.Vehicle;
import com.SmartPark.Campus.SmartPark.Campus.repository.BookingRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.ParkingSlotRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.ParkingZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/parking-zones/{zoneId}/slots")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ParkingSlotController {

    @Autowired private ParkingSlotRepository slotRepository;
    @Autowired private ParkingZoneRepository zoneRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<List<SlotDto>> getSlots(@PathVariable Long zoneId) {
        List<SlotDto> slots = slotRepository.findByZone_Id(zoneId).stream()
                .map(s -> new SlotDto(s.getId(), s.getSlotNumber(), s.getVehicleType().name(), s.getIsAvailable()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(slots);
    }

    @PostMapping
    public ResponseEntity<?> addSlot(
            @PathVariable Long zoneId,
            @RequestBody Map<String, String> body
    ) {
        ParkingZone zone = zoneRepository.findById(zoneId).orElse(null);
        if (zone == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Zone not found"));
        }

        String slotNumber = body.get("slotNumber");
        String vehicleTypeStr = body.get("vehicleType");

        if (slotNumber == null || slotNumber.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Slot number is required"));
        }
        String normalizedSlotNumber = slotNumber.trim().toUpperCase();
        if (slotRepository.existsBySlotNumberIgnoreCase(normalizedSlotNumber)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Slot number '" + normalizedSlotNumber + "' already exists. Please use a unique slot number."));
        }

        Vehicle.VehicleType vehicleType;
        try {
            vehicleType = Vehicle.VehicleType.valueOf(vehicleTypeStr.toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid vehicle type: " + vehicleTypeStr));
        }

        try {
            ParkingSlot slot = new ParkingSlot(zone, normalizedSlotNumber, vehicleType);
            slot.setStatus(resolveDefaultSlotStatus());
            slotRepository.save(slot);

            int currentCapacity = zone.getTotalCapacity() == null ? 0 : zone.getTotalCapacity();
            int currentAvailable = zone.getAvailableSlots() == null ? 0 : zone.getAvailableSlots();
            zone.setTotalCapacity(currentCapacity + 1);
            zone.setAvailableSlots(currentAvailable + 1);
            zoneRepository.save(zone);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new SlotDto(slot.getId(), slot.getSlotNumber(), slot.getVehicleType().name(), slot.getIsAvailable()));
        } catch (DataIntegrityViolationException e) {
            String rootMessage = extractRootCause(e);
            if (rootMessage.toLowerCase().contains("slot_number") || rootMessage.toLowerCase().contains("duplicate")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Slot number '" + normalizedSlotNumber + "' already exists. Please use a unique slot number."));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add slot: " + rootMessage));
        }
    }

    private String resolveDefaultSlotStatus() {
        try {
            String checkClause = jdbcTemplate.queryForObject(
                    "SELECT cc.check_clause " +
                            "FROM information_schema.table_constraints tc " +
                            "JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name " +
                            "WHERE tc.table_name = 'parking_slots' AND tc.constraint_type = 'CHECK' " +
                            "AND tc.constraint_name ILIKE '%status%' LIMIT 1",
                    String.class
            );

            if (checkClause != null) {
                Matcher matcher = Pattern.compile("'([A-Za-z_]+)'").matcher(checkClause);
                if (matcher.find()) {
                    return matcher.group(1).toUpperCase();
                }
            }
        } catch (Exception ignored) {
            // Fall back below when metadata query is unavailable.
        }
        return "AVAILABLE";
    }

    private String extractRootCause(Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage() != null ? root.getMessage() : "Database constraint violation";
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<?> deleteSlot(
            @PathVariable Long zoneId,
            @PathVariable Long slotId
    ) {
        ParkingSlot slot = slotRepository.findById(slotId).orElse(null);
        if (slot == null || !slot.getZone().getId().equals(zoneId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Slot not found"));
        }

        if (bookingRepository.existsBySlot_Id(slotId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Cannot remove slot '" + slot.getSlotNumber() + "' — it has booking history"));
        }

        boolean wasAvailable = slot.getIsAvailable();
        slotRepository.deleteById(slotId);

        ParkingZone zone = zoneRepository.findById(zoneId).orElse(null);
        if (zone != null) {
            zone.setTotalCapacity(Math.max(0, (zone.getTotalCapacity() == null ? 0 : zone.getTotalCapacity()) - 1));
            if (wasAvailable) {
                zone.setAvailableSlots(Math.max(0, (zone.getAvailableSlots() == null ? 0 : zone.getAvailableSlots()) - 1));
            }
            zoneRepository.save(zone);
        }

        return ResponseEntity.noContent().build();
    }
}
