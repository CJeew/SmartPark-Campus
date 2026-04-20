package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketCreateRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketUpdateRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.TicketRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class TicketService {

	@Autowired
	private TicketRepository ticketRepository;

	@Autowired
	private UserRepository userRepository;

	public TicketResponse create(Long userId, TicketCreateRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

		Ticket ticket = new Ticket();
		ticket.setCreatedBy(user);
		ticket.setTitle(request.getTitle().trim());
		ticket.setDescription(request.getDescription().trim());
		ticket.setPriority(request.getPriority());
		ticket.setTag(request.getTag());

		return toResponse(ticketRepository.save(ticket));
	}

	@Transactional(readOnly = true)
	public List<TicketResponse> listMyTickets(Long userId, TicketStatus status) {
		List<Ticket> tickets = status == null
			? ticketRepository.findByCreatedBy_IdOrderByCreatedAtDesc(userId)
			: ticketRepository.findByCreatedBy_IdAndStatusOrderByCreatedAtDesc(userId, status);
		return tickets.stream().map(TicketService::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public TicketResponse getMyTicket(Long userId, Long ticketId) {
		Ticket ticket = requireOwnedTicket(userId, ticketId);
		return toResponse(ticket);
	}

	public TicketResponse updateMyTicket(Long userId, Long ticketId, TicketUpdateRequest request, boolean canChangeStatus) {
		Ticket ticket = requireOwnedTicket(userId, ticketId);

		if (request.getTitle() != null) {
			ticket.setTitle(request.getTitle().trim());
		}
		if (request.getDescription() != null) {
			ticket.setDescription(request.getDescription().trim());
		}
		if (request.getPriority() != null) {
			ticket.setPriority(request.getPriority());
		}
		if (request.getTag() != null) {
			ticket.setTag(request.getTag());
		}
		if (request.getStatus() != null) {
			if (!canChangeStatus) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only staff can change ticket status");
			}
			ticket.setStatus(request.getStatus());
		}

		return toResponse(ticketRepository.save(ticket));
	}

	public void deleteMyTicket(Long userId, Long ticketId) {
		Ticket ticket = requireOwnedTicket(userId, ticketId);
		ticketRepository.delete(ticket);
	}

	private Ticket requireOwnedTicket(Long userId, Long ticketId) {
		Optional<Ticket> ticketOptional = ticketRepository.findById(ticketId);
		if (ticketOptional.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found");
		}
		Ticket ticket = ticketOptional.get();
		if (ticket.getCreatedBy() == null || ticket.getCreatedBy().getId() == null || !ticket.getCreatedBy().getId().equals(userId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}
		return ticket;
	}

	public static TicketResponse toResponse(Ticket ticket) {
		return new TicketResponse(
			ticket.getId(),
			ticket.getCreatedBy() == null ? null : ticket.getCreatedBy().getId(),
			ticket.getTitle(),
			ticket.getDescription(),
			ticket.getStatus(),
			ticket.getPriority(),
			ticket.getTag(),
			ticket.getCreatedAt(),
			ticket.getUpdatedAt()
		);
	}

	public static boolean isStaff(Set<Role> roles) {
		if (roles == null) return false;
		return roles.stream().anyMatch(r -> r.getName() == Role.RoleType.ADMIN || r.getName() == Role.RoleType.WARDEN);
	}
}

