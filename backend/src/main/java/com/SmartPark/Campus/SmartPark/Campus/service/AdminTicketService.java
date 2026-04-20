package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import com.SmartPark.Campus.SmartPark.Campus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class AdminTicketService {

	@Autowired
	private TicketRepository ticketRepository;

	@Transactional(readOnly = true)
	public List<TicketResponse> listTickets(TicketStatus status) {
		List<Ticket> tickets = (status == null)
			? ticketRepository.findAllByOrderByCreatedAtDesc()
			: ticketRepository.findByStatusOrderByCreatedAtDesc(status);
		return tickets.stream().map(TicketService::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public TicketResponse getTicket(Long ticketId) {
		Ticket ticket = ticketRepository.findById(ticketId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
		return TicketService.toResponse(ticket);
	}

	public TicketResponse updateStatus(Long ticketId, TicketStatus newStatus) {
		Ticket ticket = ticketRepository.findById(ticketId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
		ticket.setStatus(newStatus);
		return TicketService.toResponse(ticketRepository.save(ticket));
	}
}

