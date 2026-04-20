package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketCreateRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketUpdateRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TicketController {

	@Autowired
	private TicketService ticketService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public TicketResponse create(Authentication authentication, @Valid @RequestBody TicketCreateRequest request) {
		return ticketService.create(currentUserId(authentication), request);
	}

	@GetMapping("/my")
	public List<TicketResponse> listMyTickets(
		Authentication authentication,
		@RequestParam(value = "status", required = false) TicketStatus status
	) {
		return ticketService.listMyTickets(currentUserId(authentication), status);
	}

	@GetMapping("/{ticketId}")
	public TicketResponse getMyTicket(Authentication authentication, @PathVariable Long ticketId) {
		return ticketService.getMyTicket(currentUserId(authentication), ticketId);
	}

	@PatchMapping("/{ticketId}")
	public TicketResponse updateMyTicket(
		Authentication authentication,
		@PathVariable Long ticketId,
		@Valid @RequestBody TicketUpdateRequest request
	) {
		Long userId = currentUserId(authentication);
		Set<Role> roles = userRepository.findById(userId).map(u -> u.getRoles()).orElse(Set.of());
		boolean canChangeStatus = TicketService.isStaff(roles);
		return ticketService.updateMyTicket(userId, ticketId, request, canChangeStatus);
	}

	@DeleteMapping("/{ticketId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteMyTicket(Authentication authentication, @PathVariable Long ticketId) {
		ticketService.deleteMyTicket(currentUserId(authentication), ticketId);
	}

	private static Long currentUserId(Authentication authentication) {
		if (authentication == null || authentication.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authentication");
		}
		try {
			return Long.valueOf(authentication.getName());
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication");
		}
	}
}

