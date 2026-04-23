package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingZone;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneType;
import com.SmartPark.Campus.SmartPark.Campus.exception.ResourceNotFoundException;
import com.SmartPark.Campus.SmartPark.Campus.mapper.ParkingZoneMapper;
import com.SmartPark.Campus.SmartPark.Campus.repository.BookingRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.ParkingZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ParkingZoneServiceImpl implements ParkingZoneService {

    private static final Logger log = LoggerFactory.getLogger(ParkingZoneServiceImpl.class);

    @Autowired
    private ParkingZoneRepository repository;

    @Autowired
    private ParkingZoneMapper mapper;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Page<ParkingZoneResponse> findAll(String type, String status, String location,
                                              Integer minCapacity, Integer maxCapacity,
                                              String search, int page, int size) {
        Specification<ParkingZone> spec = (root, query, cb) -> cb.conjunction();

        if (type != null && !type.isBlank()) {
            ZoneType zoneType = ZoneType.valueOf(type.toUpperCase());
            spec = spec.and((root, q, cb) -> cb.equal(root.get("type"), zoneType));
        }
        if (status != null && !status.isBlank()) {
            ZoneStatus zoneStatus = ZoneStatus.valueOf(status.toUpperCase());
            spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), zoneStatus));
        }
        if (location != null && !location.isBlank()) {
            String pattern = "%" + location.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("location")), pattern));
        }
        if (minCapacity != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("totalCapacity"), minCapacity));
        }
        if (maxCapacity != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("totalCapacity"), maxCapacity));
        }
        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("location")), pattern)
            ));
        }

        return repository.findAll(spec, PageRequest.of(page, size)).map(mapper::toResponse);
    }

    @Override
    public ParkingZoneResponse findById(Long id) {
        ParkingZone zone = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));
        return mapper.toResponse(zone);
    }

    @Override
    public ParkingZoneResponse create(ParkingZoneRequest request) {
        String zoneName = request.getName() != null ? request.getName().trim() : null;
        if (zoneName != null && repository.existsByNameIgnoreCase(zoneName)) {
            throw new IllegalStateException("A parking zone with this name already exists");
        }

        ParkingZone zone = mapper.toEntity(request);
        if (zoneName != null) {
            zone.setName(zoneName);
        }
        return mapper.toResponse(repository.save(zone));
    }

    @Override
    public ParkingZoneResponse update(Long id, ParkingZoneRequest request) {
        ParkingZone zone = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));

        String zoneName = request.getName() != null ? request.getName().trim() : null;
        if (zoneName != null && repository.existsByNameIgnoreCaseAndIdNot(zoneName, id)) {
            throw new IllegalStateException("A parking zone with this name already exists");
        }

        mapper.updateEntity(zone, request);
        if (zoneName != null) {
            zone.setName(zoneName);
        }
        return mapper.toResponse(repository.save(zone));
    }

    @Override
    public ParkingZoneResponse updateStatus(Long id, ZoneStatus status) {
        ParkingZone zone = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parking zone not found with id: " + id));

        try {
            zone.setStatus(status);
            return mapper.toResponse(repository.save(zone));
        } catch (DataIntegrityViolationException ex) {
            // Some legacy schemas still constrain status values and may reject MAINTENANCE.
            if (status == ZoneStatus.MAINTENANCE) {
                log.warn("MAINTENANCE status rejected by DB constraint for zone {}. Falling back to OUT_OF_SERVICE.", id);
                zone.setStatus(ZoneStatus.OUT_OF_SERVICE);
                return mapper.toResponse(repository.save(zone));
            }
            throw ex;
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Parking zone not found with id: " + id);
        }

        long linkedBookings = bookingRepository.countBySlot_Zone_Id(id);
        if (linkedBookings > 0) {
            throw new IllegalStateException("Cannot delete this zone because it has booking history");
        }

        cleanupSupportedTypeLinks(id);

        repository.deleteById(id);
    }

    private void cleanupSupportedTypeLinks(Long zoneId) {
        List<String> columns = jdbcTemplate.queryForList(
                "SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'zone_supported_types'",
                String.class
        );

        Set<String> normalized = columns.stream()
                .map(c -> c.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        String joinColumn = null;
        if (normalized.contains("zone_id")) {
            joinColumn = "zone_id";
        } else if (normalized.contains("parking_zone_id")) {
            joinColumn = "parking_zone_id";
        }

        if (joinColumn != null) {
            jdbcTemplate.update("DELETE FROM zone_supported_types WHERE " + joinColumn + " = ?", zoneId);
        }
    }
}
