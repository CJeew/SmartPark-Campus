package com.SmartPark.Campus.SmartPark.Campus.dto;

public class TicketAttachmentResponse {
    private Long id;
    private String fileName;
    private String contentType;
    private long size;

    public TicketAttachmentResponse(Long id, String fileName, String contentType, long size) {
        this.id = id;
        this.fileName = fileName;
        this.contentType = contentType;
        this.size = size;
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSize() {
        return size;
    }
}
