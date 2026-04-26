package com.SmartPark.Campus.SmartPark.Campus.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaCompatibilityInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaCompatibilityInitializer.class);

    private final JdbcTemplate jdbcTemplate;

    public SchemaCompatibilityInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            ensureTypeColumn();
            ensureStatusColumn();
            ensureCapacityColumns();
        } catch (Exception ex) {
            // Keep startup alive even when database user has limited DDL permissions.
            log.warn("Schema compatibility update skipped: {}", ex.getMessage());
        }
    }

    private void ensureCapacityColumns() {
        if (!columnExists("parking_zones", "total_capacity")) {
            jdbcTemplate.execute("ALTER TABLE parking_zones ADD COLUMN total_capacity INTEGER");

            String sourceColumn = findFirstExistingColumn("parking_zones",
                    "totalcapacity", "capacity", "total_slots", "max_capacity");
            if (sourceColumn != null) {
                jdbcTemplate.execute("UPDATE parking_zones SET total_capacity = " + sourceColumn + " WHERE total_capacity IS NULL");
            }

            log.info("Added missing parking_zones.total_capacity column for schema compatibility");
        }

        if (columnExists("parking_zones", "total_slots")) {
            // Keep legacy schemas with NOT NULL total_slots compatible with current writes.
            jdbcTemplate.execute("UPDATE parking_zones SET total_slots = COALESCE(total_slots, total_capacity, available_slots, 0)");
            jdbcTemplate.execute("ALTER TABLE parking_zones ALTER COLUMN total_slots SET DEFAULT 0");
        }
    }

    private void ensureTypeColumn() {
        if (columnExists("parking_zones", "type")) {
            jdbcTemplate.execute("UPDATE parking_zones SET type = 'OPEN' WHERE type IS NULL OR UPPER(type) IN ('GENERAL','STANDARD','NORMAL')");
            jdbcTemplate.execute("UPDATE parking_zones SET type = 'MULTI_LEVEL' WHERE UPPER(type) = 'MULTILEVEL'");
            return;
        }

        jdbcTemplate.execute("ALTER TABLE parking_zones ADD COLUMN type VARCHAR(50)");

        String sourceColumn = findFirstExistingColumn("parking_zones", "zone_type", "category", "vehicle_type");
        if (sourceColumn != null) {
            jdbcTemplate.execute("UPDATE parking_zones SET type = " + sourceColumn + " WHERE type IS NULL");
        }

        // Keep reads stable even when there is no legacy source column.
        jdbcTemplate.execute("UPDATE parking_zones SET type = 'OPEN' WHERE type IS NULL");
        log.info("Added missing parking_zones.type column for schema compatibility");
    }

    private void ensureStatusColumn() {
        if (columnExists("parking_zones", "status")) {
            jdbcTemplate.execute("UPDATE parking_zones SET status = 'OUT_OF_SERVICE' WHERE UPPER(status) IN ('INACTIVE','DISABLED')");
            jdbcTemplate.execute("UPDATE parking_zones SET status = 'ACTIVE' WHERE status IS NULL");
            return;
        }

        jdbcTemplate.execute("ALTER TABLE parking_zones ADD COLUMN status VARCHAR(50)");

        String sourceColumn = findFirstExistingColumn("parking_zones", "zone_status", "state");
        if (sourceColumn != null) {
            jdbcTemplate.execute("UPDATE parking_zones SET status = " + sourceColumn + " WHERE status IS NULL");
        }

        jdbcTemplate.execute("UPDATE parking_zones SET status = 'ACTIVE' WHERE status IS NULL");
        log.info("Added missing parking_zones.status column for schema compatibility");
    }

    private boolean columnExists(String tableName, String columnName) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = ? AND column_name = ?",
                Integer.class,
                tableName,
                columnName
        );
        return count != null && count > 0;
    }

    private String findFirstExistingColumn(String tableName, String... candidates) {
        for (String candidate : candidates) {
            if (columnExists(tableName, candidate)) {
                return candidate;
            }
        }
        return null;
    }
}
