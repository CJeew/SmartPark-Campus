package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
	List<Ticket> findByCreatedBy_IdOrderByCreatedAtDesc(Long userId);

	List<Ticket> findByCreatedBy_IdAndStatusOrderByCreatedAtDesc(Long userId, TicketStatus status);

	List<Ticket> findAllByOrderByCreatedAtDesc();

	List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
}
