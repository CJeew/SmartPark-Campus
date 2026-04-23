package com.SmartPark.Campus.SmartPark.Campus.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class ZoneTypeConverter implements AttributeConverter<ZoneType, String> {

    @Override
    public String convertToDatabaseColumn(ZoneType attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public ZoneType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return ZoneType.OPEN;
        }

        String normalized = dbData.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        return switch (normalized) {
            case "GENERAL", "STANDARD", "NORMAL" -> ZoneType.OPEN;
            case "MULTILEVEL" -> ZoneType.MULTI_LEVEL;
            default -> {
                try {
                    yield ZoneType.valueOf(normalized);
                } catch (IllegalArgumentException ignored) {
                    yield ZoneType.OPEN;
                }
            }
        };
    }
}
