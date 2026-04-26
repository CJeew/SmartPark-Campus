package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.HelmetRackOverviewResponse;
import com.SmartPark.Campus.SmartPark.Campus.service.HelmetRackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/helmet-rack")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserHelmetRackController {

    @Autowired
    private HelmetRackService helmetRackService;

    @GetMapping("/overview")
    public ResponseEntity<HelmetRackOverviewResponse> getOverview() {
        return ResponseEntity.ok(helmetRackService.getOverview());
    }
}
