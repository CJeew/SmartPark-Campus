package com.SmartPark.Campus.SmartPark.Campus.dto;

public class LoginRequest {
    private String googleId;
    private String email;
    private String fullName;
    private String imageUrl;

    public LoginRequest() {
    }

    public LoginRequest(String googleId, String email, String fullName, String imageUrl) {
        this.googleId = googleId;
        this.email = email;
        this.fullName = fullName;
        this.imageUrl = imageUrl;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
