package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR CAST(b.status as string) = :status) AND " +
           "(:zoneName IS NULL OR b.slot.zone.name = :zoneName) AND " +
           "(:startDate IS NULL OR b.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR b.createdAt <= :endDate) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findWithFilters(
            @Param("status") String status,
            @Param("zoneName") String zoneName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    boolean existsBySlot_Id(Long slotId);

    long countByStatus(Booking.BookingStatus status);

    long countBySlot_Zone_Id(Long zoneId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Booking b WHERE b.slot.zone.id = :zoneId")
    void deleteBySlotZoneId(@Param("zoneId") Long zoneId);

    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByUser_IdAndStatus(Long userId, Booking.BookingStatus status);

    // Find overlapping bookings for conflict detection
    @Query("SELECT b FROM Booking b WHERE b.slot.id = :slotId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
            @Param("slotId") Long slotId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
