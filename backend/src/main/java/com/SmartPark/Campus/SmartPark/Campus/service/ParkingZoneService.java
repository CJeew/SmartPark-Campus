package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.ParkingZoneResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import org.springframework.data.domain.Page;

public interface ParkingZoneService {

    Page<ParkingZoneResponse> findAll(String type, String status, String location,
                                      Integer minCapacity, Integer maxCapacity,
                                      String search, int page, int size);

    ParkingZoneResponse findById(Long id);

    ParkingZoneResponse create(ParkingZoneRequest request);

    ParkingZoneResponse update(Long id, ParkingZoneRequest request);

    ParkingZoneResponse updateStatus(Long id, ZoneStatus status);

    void delete(Long id);
}
