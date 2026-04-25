package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByReporterIdOrderByCreatedAtDesc(Long reporterId, Pageable pageable);
}
