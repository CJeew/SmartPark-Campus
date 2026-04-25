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

    private TicketResponse toResponse(Ticket ticket) {
        List<TicketAttachmentResponse> attachments = ticket.getAttachments() == null
                ? List.of()
                : ticket.getAttachments().stream()
                .map(a -> new TicketAttachmentResponse(a.getId(), a.getFileName(), a.getContentType(), a.getSize()))
                .collect(Collectors.toList());

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
                ticket.getCreatedAt()
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
}
