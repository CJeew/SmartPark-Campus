package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.*;
import com.SmartPark.Campus.SmartPark.Campus.service.HelmetRackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/helmet-rack")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HelmetRackController {

    @Autowired
    private HelmetRackService helmetRackService;

    @GetMapping("/overview")
    public ResponseEntity<HelmetRackOverviewResponse> getOverview() {
        return ResponseEntity.ok(helmetRackService.getOverview());
    }

    @PostMapping("/slots/{slotId}/check-in")
    public ResponseEntity<HelmetSlotResponse> checkIn(@PathVariable Long slotId,
                                                      @RequestBody HelmetCheckInRequest request) {
        try {
            return ResponseEntity.ok(helmetRackService.checkIn(slotId, request, currentActor()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/slots/{slotId}/check-out")
    public ResponseEntity<HelmetSlotResponse> checkOut(@PathVariable Long slotId,
                                                       @RequestBody HelmetCheckOutRequest request) {
        try {
            return ResponseEntity.ok(helmetRackService.checkOut(slotId, request, currentActor()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/slots/{slotId}/flag")
    public ResponseEntity<HelmetSlotResponse> flag(@PathVariable Long slotId,
                                                   @RequestBody HelmetFlagRequest request) {
        try {
            return ResponseEntity.ok(helmetRackService.flagSlot(slotId, request, currentActor()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/slots/{slotId}/unflag")
    public ResponseEntity<HelmetSlotResponse> unflag(@PathVariable Long slotId) {
        try {
            return ResponseEntity.ok(helmetRackService.unflagSlot(slotId, currentActor()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<List<HelmetActivityResponse>> getActivities(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(helmetRackService.getActivities(q));
    }

    private String currentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? String.valueOf(authentication.getPrincipal()) : "admin";
    }
}