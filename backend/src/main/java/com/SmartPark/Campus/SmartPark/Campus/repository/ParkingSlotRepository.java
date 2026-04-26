package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    boolean existsBySlotNumber(String slotNumber);
    boolean existsBySlotNumberIgnoreCase(String slotNumber);
    List<ParkingSlot> findByZone_Id(Long zoneId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM ParkingSlot s WHERE s.zone.id = :zoneId")
    void deleteByZoneId(@Param("zoneId") Long zoneId);
}
