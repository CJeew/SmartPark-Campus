package com.SmartPark.Campus.SmartPark.Campus.dto;

public class TicketAttachmentResponse {
    private Long id;
    private String fileName;
    private String contentType;
    private long size;
    private String imageData; // base64-encoded image bytes

    /** Used for list responses (no image data to keep payload small) */
    public TicketAttachmentResponse(Long id, String fileName, String contentType, long size) {
        this.id = id;
        this.fileName = fileName;
        this.contentType = contentType;
        this.size = size;
    }

    /** Used for detail responses (includes base64 image data) */
    public TicketAttachmentResponse(Long id, String fileName, String contentType, long size, String imageData) {
        this.id = id;
        this.fileName = fileName;
        this.contentType = contentType;
        this.size = size;
        this.imageData = imageData;
    }

    public Long getId() { return id; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public long getSize() { return size; }
    public String getImageData() { return imageData; }

    /** Returns a ready-to-use data URI: "data:image/jpeg;base64,..." */
    public String getImageDataUrl() {
        if (imageData == null || imageData.isBlank()) return null;
        String mime = (contentType != null && !contentType.isBlank()) ? contentType : "image/jpeg";
        return "data:" + mime + ";base64," + imageData;
    }
}
