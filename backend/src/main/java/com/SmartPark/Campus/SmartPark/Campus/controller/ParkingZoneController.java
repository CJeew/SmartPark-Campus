package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.StatusUpdateRequest;
import com.SmartPark.Campus.SmartPark.Campus.service.ParkingZoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/parking-zones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ParkingZoneController {

    @Autowired
    private ParkingZoneService service;

    @GetMapping
    public ResponseEntity<Page<ParkingZoneResponse>> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.findAll(type, status, location, minCapacity, maxCapacity, search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingZoneResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ParkingZoneResponse> create(@Valid @RequestBody ParkingZoneRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingZoneResponse> update(@PathVariable Long id,
                                                       @Valid @RequestBody ParkingZoneRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingZoneResponse> updateStatus(@PathVariable Long id,
                                                             @RequestBody StatusUpdateRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
