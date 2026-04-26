package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.TicketAttachmentResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketCreateRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.TicketResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.Ticket;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketAttachment;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.exception.ResourceNotFoundException;
import com.SmartPark.Campus.SmartPark.Campus.repository.TicketRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.Base64;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TicketResponse createTicket(Long userId, TicketCreateRequest request, MultipartFile[] images) {
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!reporter.getIsActive()) {
            throw new IllegalArgumentException("User account is inactive");
        }

        validatePreferredContact(request);
        validateImages(images);

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle().trim());
        ticket.setCategory(request.getCategory().trim());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(Ticket.TicketStatus.OPEN);
        ticket.setLocation(request.getLocation().trim());
        ticket.setResourceType(trimOrNull(request.getResourceType()));
        ticket.setResourceId(trimOrNull(request.getResourceId()));
        ticket.setDescription(request.getDescription().trim());
        ticket.setPreferredContactMethod(request.getPreferredContactMethod());
        ticket.setPreferredContactName(trimOrNull(request.getPreferredContactName()));
        ticket.setPreferredContactEmail(trimOrNull(request.getPreferredContactEmail()));
        ticket.setPreferredContactPhone(trimOrNull(request.getPreferredContactPhone()));
        ticket.setReporter(reporter);
        ticket.setTicketId(generateTemporaryTicketId());

        if (images != null) {
            for (MultipartFile image : images) {
                if (image == null || image.isEmpty()) {
                    continue;
                }
                TicketAttachment attachment = new TicketAttachment();
                attachment.setTicket(ticket);
                attachment.setFileName(Objects.toString(image.getOriginalFilename(), "image"));
                attachment.setContentType(Objects.toString(image.getContentType(), "application/octet-stream"));
                attachment.setSize(image.getSize());
                try {
                    attachment.setData(Base64.getEncoder().encodeToString(image.getBytes()));
                } catch (Exception ex) {
                    throw new IllegalArgumentException("Failed to read image attachment");
                }
                ticket.getAttachments().add(attachment);
            }
        }

        Ticket saved = ticketRepository.save(ticket);
        saved.setTicketId(formatTicketId(saved.getId()));
        saved = ticketRepository.save(saved);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(Long userId, int limit) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        int safeLimit = Math.max(1, Math.min(limit, 50));
        return ticketRepository.findByReporterIdOrderByCreatedAtDesc(
                        userId,
                        PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"))
                )
                .map(this::toResponse)
                .getContent();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long userId, Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        // Only the reporter can view their own ticket
        if (ticket.getReporter() == null || !ticket.getReporter().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ticket not found");
        }
        return toDetailResponse(ticket);
    }

    /** Admin: return all tickets sorted newest-first. */
    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Technician: return all tickets assigned to this technician. */
    @Transactional(readOnly = true)
    public List<TicketResponse> getMyAssignedTickets(Long technicianId) {
        if (!userRepository.existsById(technicianId)) {
            throw new ResourceNotFoundException("Technician not found");
        }
        return ticketRepository.findByAssignedTechnicianIdOrderByCreatedAtDesc(technicianId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /** Admin: update the status of any ticket. */
    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        try {
            ticket.setStatus(Ticket.TicketStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ticket status: " + status);
        }
        return toResponse(ticketRepository.save(ticket));
    }

    private TicketResponse toResponse(Ticket ticket) {
        List<TicketAttachmentResponse> attachments = ticket.getAttachments() == null
                ? List.of()
                : ticket.getAttachments().stream()
                .map(a -> new TicketAttachmentResponse(a.getId(), a.getFileName(), a.getContentType(), a.getSize()))
                .collect(Collectors.toList());

        Long techId = ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getId() : null;
        String techName = ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getFullName() : null;

        return new TicketResponse(
                ticket.getId(),
                ticket.getTicketId(),
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getLocation(),
                ticket.getResourceType(),
                ticket.getResourceId(),
                ticket.getDescription(),
                ticket.getPreferredContactMethod(),
                ticket.getPreferredContactName(),
                ticket.getPreferredContactEmail(),
                ticket.getPreferredContactPhone(),
                attachments,
                ticket.getCreatedAt(),
                techId,
                techName
        );
    }

    /** Detail response: includes base64 image data for each attachment. */
    private TicketResponse toDetailResponse(Ticket ticket) {
        List<TicketAttachmentResponse> attachments = ticket.getAttachments() == null
                ? List.of()
                : ticket.getAttachments().stream()
                .map(a -> new TicketAttachmentResponse(
                        a.getId(), a.getFileName(), a.getContentType(), a.getSize(), a.getData()))
                .collect(Collectors.toList());

        Long techId = ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getId() : null;
        String techName = ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getFullName() : null;

        return new TicketResponse(
                ticket.getId(),
                ticket.getTicketId(),
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getLocation(),
                ticket.getResourceType(),
                ticket.getResourceId(),
                ticket.getDescription(),
                ticket.getPreferredContactMethod(),
                ticket.getPreferredContactName(),
                ticket.getPreferredContactEmail(),
                ticket.getPreferredContactPhone(),
                attachments,
                ticket.getCreatedAt(),
                techId,
                techName
        );
    }

    private void validatePreferredContact(TicketCreateRequest request) {
        String email = trimOrNull(request.getPreferredContactEmail());
        String phone = trimOrNull(request.getPreferredContactPhone());

        if (request.getPreferredContactMethod() == Ticket.ContactMethod.EMAIL && email == null) {
            throw new IllegalArgumentException("Preferred contact email is required");
        }

        if (request.getPreferredContactMethod() == Ticket.ContactMethod.PHONE && phone == null) {
            throw new IllegalArgumentException("Preferred contact phone is required");
        }
    }

    private void validateImages(MultipartFile[] images) {
        if (images == null) {
            return;
        }

        long nonEmptyCount = Arrays.stream(images)
                .filter(Objects::nonNull)
                .filter(image -> !image.isEmpty())
                .count();

        if (nonEmptyCount > 3) {
            throw new IllegalArgumentException("Up to 3 image attachments are allowed");
        }

        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                continue;
            }
            String contentType = image.getContentType();
            if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
                throw new IllegalArgumentException("Only image attachments are allowed");
            }
        }
    }

    private String trimOrNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String generateTemporaryTicketId() {
        return "TK-TMP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private String formatTicketId(Long id) {
        if (id == null) {
            return generateTemporaryTicketId();
        }
        return String.format("TK-%05d", id);
    }

    /** Admin: assign or unassign a technician to a ticket. */
    @Transactional
    public TicketResponse assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        if (technicianId == null) {
            ticket.setAssignedTechnician(null);
        } else {
            User technician = userRepository.findById(technicianId)
                    .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
            boolean isTechnician = technician.getRoles().stream()
                    .anyMatch(r -> r.getName() == com.SmartPark.Campus.SmartPark.Campus.entity.Role.RoleType.TECHNICIAN);
            if (!isTechnician) {
                throw new IllegalArgumentException("User is not a technician");
            }
            ticket.setAssignedTechnician(technician);
        }
        return toResponse(ticketRepository.save(ticket));
    }

    /** Admin: list all users with the TECHNICIAN role. */
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getTechnicians() {
        return userRepository.findByRolesName(com.SmartPark.Campus.SmartPark.Campus.entity.Role.RoleType.TECHNICIAN)
                .stream()
                .map(u -> {
                    java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", u.getId());
                    m.put("fullName", u.getFullName());
                    m.put("email", u.getEmail());
                    return m;
                })
                .collect(Collectors.toList());
    }
}
