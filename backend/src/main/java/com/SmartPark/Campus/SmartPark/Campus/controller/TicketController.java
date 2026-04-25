package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketCreateRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.service.TicketService;
import com.SmartPark.Campus.SmartPark.Campus.util.RequestAuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
}
