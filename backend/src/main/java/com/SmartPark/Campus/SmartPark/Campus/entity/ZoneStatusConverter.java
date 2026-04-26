package com.SmartPark.Campus.SmartPark.Campus.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class ZoneStatusConverter implements AttributeConverter<ZoneStatus, String> {

    @Override
    public String convertToDatabaseColumn(ZoneStatus attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public ZoneStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return ZoneStatus.ACTIVE;
        }

        String normalized = dbData.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        return switch (normalized) {
            case "INACTIVE", "DISABLED" -> ZoneStatus.OUT_OF_SERVICE;
            default -> {
                try {
                    yield ZoneStatus.valueOf(normalized);
                } catch (IllegalArgumentException ignored) {
                    yield ZoneStatus.ACTIVE;
                }
            }
        };
    }
}
