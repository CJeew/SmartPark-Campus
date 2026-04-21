package com.SmartPark.Campus.SmartPark.Campus.repository;

import com.SmartPark.Campus.SmartPark.Campus.entity.HelmetRackActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelmetRackActivityRepository extends JpaRepository<HelmetRackActivity, Long> {
    List<HelmetRackActivity> findTop200ByOrderByPerformedAtDesc();
}