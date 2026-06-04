package com.SmartPark.Campus.SmartPark.Campus.dto;

import java.util.List;

public class HelmetRackOverviewResponse {
    private HelmetRackStatsResponse stats;
    private List<HelmetSlotResponse> slots;

    public HelmetRackOverviewResponse(HelmetRackStatsResponse stats, List<HelmetSlotResponse> slots) {
        this.stats = stats;
        this.slots = slots;
    }

    public HelmetRackStatsResponse getStats() {
        return stats;
    }

    public List<HelmetSlotResponse> getSlots() {
        return slots;
    }
}