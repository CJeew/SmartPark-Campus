package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.*;
import com.SmartPark.Campus.SmartPark.Campus.service.TicketService;
import com.SmartPark.Campus.SmartPark.Campus.util.RequestAuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private RequestAuthUtil requestAuthUtil;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @RequestHeader("Authorization") String authorization,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @ModelAttribute TicketCreateRequest request,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        Long resolvedUserId = requestAuthUtil.resolveUserId(authorization, userId);
        TicketResponse created = ticketService.createTicket(resolvedUserId, request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @RequestHeader("Authorization") String authorization,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Long resolvedUserId = requestAuthUtil.resolveUserId(authorization, userId);
        return ResponseEntity.ok(ticketService.getMyTickets(resolvedUserId, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(
            @RequestHeader("Authorization") String authorization,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id
    ) {
        Long resolvedUserId = requestAuthUtil.resolveUserId(authorization, userId);
        return ResponseEntity.ok(ticketService.getTicketById(resolvedUserId, id));
    }

    @GetMapping("/my-assigned")
    public ResponseEntity<List<TicketResponse>> getMyAssignedTickets(
            @RequestHeader("Authorization") String authorization,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        Long resolvedUserId = requestAuthUtil.resolveUserId(authorization, userId);
        return ResponseEntity.ok(ticketService.getMyAssignedTickets(resolvedUserId));
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<?> addReply(
            @RequestHeader("Authorization") String authorization,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id,
            @Valid @RequestBody TicketReplyRequest request
    ) {
        try {
            Long resolvedUserId = requestAuthUtil.resolveUserId(authorization, userId);
            return ResponseEntity.ok(ticketService.addReply(id, resolvedUserId, request));
        } catch (Exception e) {
            Map<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("error", "Debug Info");
            errorInfo.put("message", e.getMessage() != null ? e.getMessage() : "No message");
            errorInfo.put("details", e.getClass().getSimpleName());
            errorInfo.put("receivedBody", (request != null && request.getMessage() != null) ? request.getMessage() : "null or empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorInfo);
        }
    }

    // ── Admin endpoints ────────────────────────────────────────────────────────

    @GetMapping("/admin/all")
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestHeader("Authorization") String authorization
    ) {
        // Auth check — only admins should call this; JWT validation handled by filter
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }

    @GetMapping("/admin/technicians")
    public ResponseEntity<List<Map<String, Object>>> getTechnicians(
            @RequestHeader("Authorization") String authorization
    ) {
        return ResponseEntity.ok(ticketService.getTechnicians());
    }

    @PatchMapping("/admin/{id}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id,
            @RequestParam(required = false) Long technicianId
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }
}
