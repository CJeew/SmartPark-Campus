package com.SmartPark.Campus.SmartPark.Campus.dto;

public class HelmetCheckInRequest {
    private String studentId;
    private String studentName;
    private String helmetTag;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getHelmetTag() {
        return helmetTag;
    }

    public void setHelmetTag(String helmetTag) {
        this.helmetTag = helmetTag;
    }
}