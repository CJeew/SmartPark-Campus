package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.HelmetRackSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelmetRackSlotRepository extends JpaRepository<HelmetRackSlot, Long> {
}