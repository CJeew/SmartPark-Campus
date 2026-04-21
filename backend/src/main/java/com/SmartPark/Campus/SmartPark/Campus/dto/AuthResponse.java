package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.Role.RoleType;
import com.SmartPark.Campus.SmartPark.Campus.entity.User.UserType;
import com.SmartPark.Campus.SmartPark.Campus.entity.Vehicle.VehicleType;

import java.util.List;

public class AuthResponse {
    private boolean success;
    private String message;
    private UserResponse user;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, UserResponse user, String token) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public static class UserResponse {
        private Long id;
        private String email;
        private String fullName;
        private String universityId;
        private String phoneNumber;
        private String faculty;
        private UserType userType;
        private List<RoleType> roles;
        private List<VehicleResponse> vehicles;
        private Boolean isActive;

        public UserResponse() {
        }

        public UserResponse(Long id, String email, String fullName, String universityId,
                          String phoneNumber, String faculty, UserType userType,
                          List<RoleType> roles, List<VehicleResponse> vehicles) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.universityId = universityId;
            this.phoneNumber = phoneNumber;
            this.faculty = faculty;
            this.userType = userType;
            this.roles = roles;
            this.vehicles = vehicles;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getUniversityId() {
            return universityId;
        }

        public void setUniversityId(String universityId) {
            this.universityId = universityId;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getFaculty() {
            return faculty;
        }

        public void setFaculty(String faculty) {
            this.faculty = faculty;
        }

        public UserType getUserType() {
            return userType;
        }

        public void setUserType(UserType userType) {
            this.userType = userType;
        }

        public List<RoleType> getRoles() {
            return roles;
        }

        public void setRoles(List<RoleType> roles) {
            this.roles = roles;
        }

        public List<VehicleResponse> getVehicles() {
            return vehicles;
        }

        public void setVehicles(List<VehicleResponse> vehicles) {
            this.vehicles = vehicles;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }

    public static class VehicleResponse {
        private Long id;
        private VehicleType vehicleType;
        private String registrationNumber;
        private Boolean isActive;

        public VehicleResponse() {
        }

        public VehicleResponse(Long id, VehicleType vehicleType, String registrationNumber, Boolean isActive) {
            this.id = id;
            this.vehicleType = vehicleType;
            this.registrationNumber = registrationNumber;
            this.isActive = isActive;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public VehicleType getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(VehicleType vehicleType) {
            this.vehicleType = vehicleType;
        }

        public String getRegistrationNumber() {
            return registrationNumber;
        }

        public void setRegistrationNumber(String registrationNumber) {
            this.registrationNumber = registrationNumber;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }
}
