package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.AdminLoginRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.AdminStatsResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.AuthResponse;
import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.entity.Booking;
import com.SmartPark.Campus.SmartPark.Campus.repository.BookingRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.VehicleRepository;
import com.SmartPark.Campus.SmartPark.Campus.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.SmartPark.Campus.SmartPark.Campus.repository.RoleRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse adminLogin(AdminLoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getUsername());

        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid credentials", null, null);
        }

        User user = userOpt.get();

        boolean isAdminOrTech = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleType.ADMIN || r.getName() == Role.RoleType.TECHNICIAN);
        if (!isAdminOrTech) {
            return new AuthResponse(false, "Access denied", null, null);
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid credentials", null, null);
        }

        if (!user.getIsActive()) {
            return new AuthResponse(false, "Account is inactive", null, null);
        }

        String token = jwtTokenProvider.generateToken(user.getId().toString());

        List<Role.RoleType> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                user.getId(), user.getEmail(), user.getFullName(), user.getUniversityId(),
                user.getPhoneNumber(), user.getFaculty(), user.getUserType(), roles, List.of()
        );

        return new AuthResponse(true, "Login successful", userResponse, token);
    }

    public AdminStatsResponse getDashboardStats() {
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(User::getIsActive).count();
        long totalVehicles = vehicleRepository.count();
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(Booking.BookingStatus.PENDING);

        return new AdminStatsResponse(totalUsers, totalVehicles, activeUsers, totalBookings, pendingBookings);
    }

    public List<AuthResponse.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Autowired
    private RoleRepository roleRepository;

    public AuthResponse.UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleType.ADMIN);
        if (isAdmin) {
            throw new RuntimeException("Cannot deactivate an admin account");
        }

        user.setIsActive(!user.getIsActive());
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    public AuthResponse.UserResponse updateUserRoles(Long userId, List<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean currentIsAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        boolean targetIsAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == Role.RoleType.ADMIN);
        boolean requestsAdmin = roleNames.contains("ADMIN");

        if ((targetIsAdmin || requestsAdmin) && !currentIsAdmin) {
            throw new RuntimeException("Only ADMINs can modify ADMIN roles");
        }

        if (roleNames.isEmpty()) {
            throw new RuntimeException("User must have at least one role");
        }

        java.util.Set<Role> newRoles = new java.util.HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(Role.RoleType.valueOf(roleName))
                    .orElseGet(() -> roleRepository.save(new Role(Role.RoleType.valueOf(roleName))));
            newRoles.add(role);
        }
        user.setRoles(newRoles);
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    private AuthResponse.UserResponse toUserResponse(User user) {
        List<Role.RoleType> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        AuthResponse.UserResponse response = new AuthResponse.UserResponse(
                user.getId(), user.getEmail(), user.getFullName(), user.getUniversityId(),
                user.getPhoneNumber(), user.getFaculty(), user.getUserType(), roles, List.of()
        );
        response.setIsActive(user.getIsActive());
        return response;
    }
}
