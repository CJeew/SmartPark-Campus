package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.TicketPriority;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import java.time.LocalDateTime;

public class TicketResponse {
	private Long id;
	private Long createdByUserId;
	private String title;
	private String description;
	private TicketStatus status;
	private TicketPriority priority;
	private String tag;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public TicketResponse() {
	}

	public TicketResponse(
		Long id,
		Long createdByUserId,
		String title,
		String description,
		TicketStatus status,
		TicketPriority priority,
		String tag,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
	) {
		this.id = id;
		this.createdByUserId = createdByUserId;
		this.title = title;
		this.description = description;
		this.status = status;
		this.priority = priority;
		this.tag = tag;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCreatedByUserId() {
		return createdByUserId;
	}

	public void setCreatedByUserId(Long createdByUserId) {
		this.createdByUserId = createdByUserId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public TicketStatus getStatus() {
		return status;
	}

	public void setStatus(TicketStatus status) {
		this.status = status;
	}

	public TicketPriority getPriority() {
		return priority;
	}

	public void setPriority(TicketPriority priority) {
		this.priority = priority;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}

