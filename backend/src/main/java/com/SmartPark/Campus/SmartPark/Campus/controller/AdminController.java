package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.dto.AdminLoginRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.AdminStatsResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.AuthResponse;
import com.SmartPark.Campus.SmartPark.Campus.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody AdminLoginRequest request) {
        AuthResponse response = adminService.adminLogin(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AuthResponse.UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            AuthResponse.UserResponse updated = adminService.toggleUserStatus(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
