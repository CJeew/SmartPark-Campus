package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketStatusUpdateRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import com.SmartPark.Campus.SmartPark.Campus.service.AdminTicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminTicketController {

	@Autowired
	private AdminTicketService adminTicketService;

	@GetMapping
	public List<TicketResponse> listTickets(@RequestParam(value = "status", required = false) TicketStatus status) {
		return adminTicketService.listTickets(status);
	}

	@GetMapping("/{ticketId}")
	public TicketResponse getTicket(@PathVariable Long ticketId) {
		return adminTicketService.getTicket(ticketId);
	}

	@PatchMapping("/{ticketId}/status")
	public TicketResponse updateStatus(@PathVariable Long ticketId, @Valid @RequestBody TicketStatusUpdateRequest request) {
		return adminTicketService.updateStatus(ticketId, request.getStatus());
	}
}

