package com.SmartPark.Campus.SmartPark.Campus.mapper;

import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingSlot;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingZone;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ParkingZoneMapper {

    public ParkingZone toEntity(ParkingZoneRequest req) {
        ParkingZone zone = new ParkingZone();
        zone.setName(req.getName());
        zone.setLocation(req.getLocation());
        zone.setType(req.getType());
        zone.setTotalCapacity(req.getTotalCapacity());
        zone.setAvailableSlots(req.getAvailableSlots() != null ? req.getAvailableSlots() : req.getTotalCapacity());
        zone.setStatus(req.getStatus() != null ? req.getStatus() : ZoneStatus.ACTIVE);
        zone.setDescription(req.getDescription());
        zone.setAvailabilityWindows(req.getAvailabilityWindows());
        return zone;
    }

    public void updateEntity(ParkingZone zone, ParkingZoneRequest req) {
        zone.setName(req.getName());
        zone.setLocation(req.getLocation());
        zone.setType(req.getType());
        zone.setTotalCapacity(req.getTotalCapacity());
        zone.setAvailableSlots(req.getAvailableSlots() != null ? req.getAvailableSlots() : req.getTotalCapacity());
        zone.setStatus(req.getStatus() != null ? req.getStatus() : zone.getStatus());
        zone.setDescription(req.getDescription());
        zone.setAvailabilityWindows(req.getAvailabilityWindows());
    }

    public ParkingZoneResponse toResponse(ParkingZone zone) {
        ParkingZoneResponse res = new ParkingZoneResponse();
        res.setId(zone.getId());
        res.setName(zone.getName());
        res.setLocation(zone.getLocation());
        res.setType(zone.getType());
        res.setStatus(zone.getStatus());
        res.setDescription(zone.getDescription());
        res.setAvailabilityWindows(zone.getAvailabilityWindows());
        res.setCreatedAt(zone.getCreatedAt());
        res.setUpdatedAt(zone.getUpdatedAt());

        List<ParkingSlot> slots = zone.getSlots();
        if (slots != null && !slots.isEmpty()) {
            int total = slots.size();
            long occupiedCount = slots.stream().filter(s -> !s.getIsAvailable()).count();
            res.setTotalCapacity(total);
            res.setAvailableSlots((int) (total - occupiedCount));
            res.setOccupancyRate(Math.round((double) occupiedCount / total * 10000.0) / 100.0);

            List<ParkingZoneResponse.SlotDto> slotDtos = slots.stream()
                    .map(s -> new ParkingZoneResponse.SlotDto(
                            s.getId(),
                            s.getSlotNumber(),
                            s.getVehicleType().name(),
                            s.getIsAvailable()))
                    .collect(Collectors.toList());
            res.setSlots(slotDtos);
        } else {
            res.setTotalCapacity(zone.getTotalCapacity());
            res.setAvailableSlots(zone.getAvailableSlots());
            res.setOccupancyRate(calculateOccupancyRate(zone));
        }

        return res;
    }

    private Double calculateOccupancyRate(ParkingZone zone) {
        if (zone.getTotalCapacity() == null || zone.getTotalCapacity() == 0) return 0.0;
        int occupied = zone.getTotalCapacity() - (zone.getAvailableSlots() != null ? zone.getAvailableSlots() : zone.getTotalCapacity());
        double rate = (double) occupied / zone.getTotalCapacity() * 100;
        return Math.round(rate * 100.0) / 100.0;
    }
}
