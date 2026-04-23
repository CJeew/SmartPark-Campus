package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    boolean existsBySlotNumber(String slotNumber);
    boolean existsBySlotNumberIgnoreCase(String slotNumber);
    List<ParkingSlot> findByZone_Id(Long zoneId);
}
