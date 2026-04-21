package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.*;
import com.SmartPark.Campus.SmartPark.Campus.entity.HelmetRackActivity;
import com.SmartPark.Campus.SmartPark.Campus.entity.HelmetRackSlot;
import com.SmartPark.Campus.SmartPark.Campus.repository.HelmetRackActivityRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.HelmetRackSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class HelmetRackService {

    private static final int DEFAULT_SLOT_COUNT = 48;

    @Autowired
    private HelmetRackSlotRepository slotRepository;

    @Autowired
    private HelmetRackActivityRepository activityRepository;

    public HelmetRackOverviewResponse getOverview() {
        ensureDefaultSlots();
        List<HelmetRackSlot> slots = slotRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(HelmetRackSlot::getSlotCode))
                .toList();

        long total = slots.size();
        long available = slots.stream().filter(s -> s.getStatus() == HelmetRackSlot.SlotStatus.AVAILABLE).count();
        long occupied = slots.stream().filter(s -> s.getStatus() == HelmetRackSlot.SlotStatus.OCCUPIED).count();
        long flagged = slots.stream().filter(s -> s.getStatus() == HelmetRackSlot.SlotStatus.FLAGGED).count();
        double occupancy = total == 0 ? 0d : (occupied * 100.0) / total;

        HelmetRackStatsResponse stats = new HelmetRackStatsResponse(total, available, occupied, flagged, occupancy);
        List<HelmetSlotResponse> slotResponses = slots.stream().map(this::toSlotResponse).toList();
        return new HelmetRackOverviewResponse(stats, slotResponses);
    }

    public HelmetSlotResponse checkIn(Long slotId, HelmetCheckInRequest request, String performedBy) {
        validateText(request.getStudentId(), "Student ID is required");
        validateText(request.getStudentName(), "Student name is required");
        validateText(request.getHelmetTag(), "Helmet tag is required");

        HelmetRackSlot slot = getSlot(slotId);
        if (slot.getStatus() != HelmetRackSlot.SlotStatus.AVAILABLE) {
            throw new RuntimeException("Only available slots can be checked in");
        }

        slot.setStatus(HelmetRackSlot.SlotStatus.OCCUPIED);
        slot.setCurrentStudentId(request.getStudentId().trim());
        slot.setCurrentStudentName(request.getStudentName().trim());
        slot.setCurrentHelmetTag(request.getHelmetTag().trim());
        slot.setLastCheckInAt(LocalDateTime.now());
        slot.setFlagReason(null);
        slot.setFlaggedBy(null);
        slot.setFlaggedAt(null);

        HelmetRackSlot saved = slotRepository.save(slot);
        saveActivity(saved, HelmetRackActivity.ActionType.CHECK_IN, saved.getCurrentStudentId(),
                saved.getCurrentStudentName(), saved.getCurrentHelmetTag(), null, performedBy);
        return toSlotResponse(saved);
    }

    public HelmetSlotResponse checkOut(Long slotId, HelmetCheckOutRequest request, String performedBy) {
        validateText(request.getStudentId(), "Student ID verification is required for check-out");

        HelmetRackSlot slot = getSlot(slotId);
        if (slot.getStatus() == HelmetRackSlot.SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot is already available");
        }
        if (slot.getCurrentStudentId() == null || !slot.getCurrentStudentId().equalsIgnoreCase(request.getStudentId().trim())) {
            throw new RuntimeException("Student ID does not match current slot owner");
        }

        String prevStudentId = slot.getCurrentStudentId();
        String prevStudentName = slot.getCurrentStudentName();
        String prevHelmetTag = slot.getCurrentHelmetTag();

        slot.setStatus(HelmetRackSlot.SlotStatus.AVAILABLE);
        slot.setCurrentStudentId(null);
        slot.setCurrentStudentName(null);
        slot.setCurrentHelmetTag(null);
        slot.setLastCheckInAt(null);
        slot.setFlagReason(null);
        slot.setFlaggedBy(null);
        slot.setFlaggedAt(null);

        HelmetRackSlot saved = slotRepository.save(slot);
        saveActivity(saved, HelmetRackActivity.ActionType.CHECK_OUT, prevStudentId, prevStudentName,
                prevHelmetTag, null, performedBy);
        return toSlotResponse(saved);
    }

    public HelmetSlotResponse flagSlot(Long slotId, HelmetFlagRequest request, String performedBy) {
        validateText(request.getReason(), "Reason is required when flagging a slot");

        HelmetRackSlot slot = getSlot(slotId);
        if (slot.getStatus() == HelmetRackSlot.SlotStatus.FLAGGED) {
            throw new RuntimeException("Slot is already flagged");
        }

        slot.setStatus(HelmetRackSlot.SlotStatus.FLAGGED);
        slot.setFlagReason(request.getReason().trim());
        slot.setFlaggedBy(performedBy);
        slot.setFlaggedAt(LocalDateTime.now());

        HelmetRackSlot saved = slotRepository.save(slot);
        saveActivity(saved, HelmetRackActivity.ActionType.FLAGGED, saved.getCurrentStudentId(),
                saved.getCurrentStudentName(), saved.getCurrentHelmetTag(), saved.getFlagReason(), performedBy);
        return toSlotResponse(saved);
    }

    public HelmetSlotResponse unflagSlot(Long slotId, String performedBy) {
        HelmetRackSlot slot = getSlot(slotId);
        if (slot.getStatus() != HelmetRackSlot.SlotStatus.FLAGGED) {
            throw new RuntimeException("Only flagged slots can be unflagged");
        }

        String previousReason = slot.getFlagReason();
        slot.setStatus(slot.getCurrentStudentId() == null ? HelmetRackSlot.SlotStatus.AVAILABLE : HelmetRackSlot.SlotStatus.OCCUPIED);
        slot.setFlagReason(null);
        slot.setFlaggedBy(null);
        slot.setFlaggedAt(null);

        HelmetRackSlot saved = slotRepository.save(slot);
        saveActivity(saved, HelmetRackActivity.ActionType.UNFLAGGED, saved.getCurrentStudentId(),
                saved.getCurrentStudentName(), saved.getCurrentHelmetTag(), previousReason, performedBy);
        return toSlotResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<HelmetActivityResponse> getActivities(String q) {
        String keyword = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return activityRepository.findTop200ByOrderByPerformedAtDesc()
                .stream()
                .filter(a -> keyword.isBlank() || containsIgnoreCase(a, keyword))
                .map(this::toActivityResponse)
                .toList();
    }

    private boolean containsIgnoreCase(HelmetRackActivity activity, String keyword) {
        return contains(activity.getSlot().getSlotCode(), keyword)
                || contains(activity.getStudentId(), keyword)
                || contains(activity.getStudentName(), keyword)
                || contains(activity.getHelmetTag(), keyword)
                || contains(activity.getReason(), keyword)
                || contains(activity.getPerformedBy(), keyword)
                || contains(activity.getActionType().name(), keyword);
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private HelmetRackSlot getSlot(Long slotId) {
        return slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Helmet slot not found"));
    }

    private void saveActivity(HelmetRackSlot slot,
                              HelmetRackActivity.ActionType action,
                              String studentId,
                              String studentName,
                              String helmetTag,
                              String reason,
                              String performedBy) {
        HelmetRackActivity activity = new HelmetRackActivity();
        activity.setSlot(slot);
        activity.setActionType(action);
        activity.setStudentId(studentId);
        activity.setStudentName(studentName);
        activity.setHelmetTag(helmetTag);
        activity.setReason(reason);
        activity.setPerformedBy(performedBy == null || performedBy.isBlank() ? "admin" : performedBy);
        activityRepository.save(activity);
    }

    private HelmetSlotResponse toSlotResponse(HelmetRackSlot slot) {
        return new HelmetSlotResponse(
                slot.getId(),
                slot.getSlotCode(),
                slot.getStatus().name(),
                slot.getCurrentStudentId(),
                slot.getCurrentStudentName(),
                slot.getCurrentHelmetTag(),
                slot.getFlagReason(),
                slot.getFlaggedBy(),
                slot.getFlaggedAt(),
                slot.getLastCheckInAt()
        );
    }

    private HelmetActivityResponse toActivityResponse(HelmetRackActivity activity) {
        return new HelmetActivityResponse(
                activity.getId(),
                activity.getSlot().getSlotCode(),
                activity.getActionType().name(),
                activity.getStudentId(),
                activity.getStudentName(),
                activity.getHelmetTag(),
                activity.getReason(),
                activity.getPerformedBy(),
                activity.getPerformedAt()
        );
    }

    private void ensureDefaultSlots() {
        if (slotRepository.count() > 0) {
            return;
        }
        for (int i = 1; i <= DEFAULT_SLOT_COUNT; i++) {
            HelmetRackSlot slot = new HelmetRackSlot();
            slot.setSlotCode("H" + String.format("%02d", i));
            slot.setStatus(HelmetRackSlot.SlotStatus.AVAILABLE);
            slotRepository.save(slot);
        }
    }

    private void validateText(String value, String message) {
        if (value == null || value.trim().isBlank()) {
            throw new RuntimeException(message);
        }
    }
}