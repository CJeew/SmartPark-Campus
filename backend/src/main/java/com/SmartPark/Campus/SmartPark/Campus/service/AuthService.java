package com.SmartPark.Campus.SmartPark.Campus.service;

import com.SmartPark.Campus.SmartPark.Campus.dto.AuthResponse;
import com.SmartPark.Campus.SmartPark.Campus.dto.LoginRequest;
import com.SmartPark.Campus.SmartPark.Campus.dto.RegisterRequest;
import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.Role.RoleType;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.entity.Vehicle;
import com.SmartPark.Campus.SmartPark.Campus.repository.RoleRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.VehicleRepository;
import com.SmartPark.Campus.SmartPark.Campus.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        // Validate email doesn't exist
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email already registered", null, null);
        }

        // Validate university ID is unique
        if (userRepository.existsByUniversityId(request.getUniversityId())) {
            return new AuthResponse(false, "University ID already registered", null, null);
        }

        // Validate vehicle registration number is unique
        if (vehicleRepository.existsByRegistrationNumber(request.getVehicleRegistrationNumber())) {
            return new AuthResponse(false, "Vehicle registration number already in use", null, null);
        }

        try {
            // Create new user
            User user = new User(
                    request.getEmail(),
                    request.getFullName(),
                    request.getUniversityId(),
                    request.getPhoneNumber(),
                    request.getFaculty(),
                    request.getUserType()
            );
            user.setGoogleId(request.getGoogleId());

            // Assign USER role
            Role userRole = roleRepository.findByName(RoleType.USER)
                    .orElseGet(() -> {
                        Role newRole = new Role(RoleType.USER);
                        return roleRepository.save(newRole);
                    });
            
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);

            // Save user
            User savedUser = userRepository.save(user);

            // Create vehicle
            Vehicle vehicle = new Vehicle(
                    savedUser,
                    request.getVehicleType(),
                    request.getVehicleRegistrationNumber()
            );
            vehicleRepository.save(vehicle);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(savedUser.getId().toString());

            // Build response
            AuthResponse.UserResponse userResponse = buildUserResponse(savedUser);
            return new AuthResponse(true, "Registration successful", userResponse, token);

        } catch (Exception e) {
            return new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null);
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByGoogleId(request.getGoogleId());

            User user;
            if (userOptional.isEmpty()) {
                // First time login - check if email exists
                Optional<User> emailUser = userRepository.findByEmail(request.getEmail());
                if (emailUser.isPresent()) {
                    user = emailUser.get();
                    user.setGoogleId(request.getGoogleId());
                    userRepository.save(user);
                } else {
                    // Auto-register the user on first Google login
                    user = new User(
                            request.getEmail(),
                            request.getFullName(),
                            request.getEmail().split("@")[0], // Use email prefix as university ID
                            "N/A", // Phone number not provided by Google
                            "N/A", // Faculty not provided by Google
                            User.UserType.STUDENT // Default role
                    );
                    user.setGoogleId(request.getGoogleId());
                    
                    // Assign USER role
                    Role userRole = roleRepository.findByName(RoleType.USER)
                            .orElseGet(() -> {
                                Role newRole = new Role(RoleType.USER);
                                return roleRepository.save(newRole);
                            });
                    
                    Set<Role> roles = new HashSet<>();
                    roles.add(userRole);
                    user.setRoles(roles);
                    
                    user = userRepository.save(user);
                }
            } else {
                user = userOptional.get();
            }

            // Check if user is active
            if (!user.getIsActive()) {
                return new AuthResponse(false, "User account is inactive", null, null);
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(user.getId().toString());

            // Build response
            AuthResponse.UserResponse userResponse = buildUserResponse(user);
            return new AuthResponse(true, "Login successful", userResponse, token);

        } catch (Exception e) {
            return new AuthResponse(false, "Login failed: " + e.getMessage(), null, null);
        }
    }

    private AuthResponse.UserResponse buildUserResponse(User user) {
        List<RoleType> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        List<AuthResponse.VehicleResponse> vehicles = user.getVehicles().stream()
                .map(v -> new AuthResponse.VehicleResponse(
                        v.getId(),
                        v.getVehicleType(),
                        v.getRegistrationNumber(),
                        v.getIsActive()
                ))
                .collect(Collectors.toList());

        return new AuthResponse.UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getUniversityId(),
                user.getPhoneNumber(),
                user.getFaculty(),
                user.getUserType(),
                roles,
                vehicles
        );
    }

    public AuthResponse getCurrentUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return new AuthResponse(false, "User not found", null, null);
        }

        User user = userOptional.get();
        AuthResponse.UserResponse userResponse = buildUserResponse(user);
        return new AuthResponse(true, "User found", userResponse, null);
    }
}
