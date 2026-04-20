package com.SmartPark.Campus.SmartPark.Campus.dto;

import com.SmartPark.Campus.SmartPark.Campus.entity.TicketPriority;
import com.SmartPark.Campus.SmartPark.Campus.entity.TicketStatus;
import jakarta.validation.constraints.Size;

public class TicketUpdateRequest {

	@Size(max = 120)
	private String title;

	@Size(max = 2000)
	private String description;

	private TicketPriority priority;

	@Size(max = 60)
	private String tag;

	private TicketStatus status;

	public TicketUpdateRequest() {
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

	public TicketStatus getStatus() {
		return status;
	}

	public void setStatus(TicketStatus status) {
		this.status = status;
	}
}

