# Campus Parking Management System
## Module A — Parking Zone Management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.x, Spring Data JPA, Spring Web |
| Database | PostgreSQL |
| Frontend | React 18, Axios, TailwindCSS |
| Build | Maven (backend), Vite (frontend) |

---

## Domain Model

### ParkingZone Entity

```java
@Entity
@Table(name = "parking_zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ZoneType type;           // OPEN | COVERED | MULTI_LEVEL | RESTRICTED

    @Min(1)
    private Integer totalCapacity;

    private Integer availableSlots;

    @Enumerated(EnumType.STRING)
    private ZoneStatus status;       // ACTIVE | OUT_OF_SERVICE | MAINTENANCE

    private String description;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<AvailabilityWindow> availabilityWindows;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Enums

```java
public enum ZoneType {
    OPEN, COVERED, MULTI_LEVEL, RESTRICTED
}

public enum ZoneStatus {
    ACTIVE, OUT_OF_SERVICE, MAINTENANCE
}
```

### AvailabilityWindow (embedded JSON)

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityWindow {
    private String day;        // "WEEKDAYS" | "WEEKENDS" | "DAILY" | "MONDAY" etc.
    private String openTime;   // "07:00"
    private String closeTime;  // "22:00"
}
```

---

## REST API Endpoints

Base URL: `/api/v1/parking-zones`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/parking-zones` | Get all zones (with filters + pagination) |
| GET | `/api/v1/parking-zones/{id}` | Get single zone |
| POST | `/api/v1/parking-zones` | Create zone |
| PUT | `/api/v1/parking-zones/{id}` | Full update |
| PATCH | `/api/v1/parking-zones/{id}/status` | Status update only |
| DELETE | `/api/v1/parking-zones/{id}` | Delete zone |

### Query Params — GET All

```
GET /api/v1/parking-zones?type=COVERED&status=ACTIVE&location=Block&minCapacity=50&page=0&size=10
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | String | Filter by ZoneType |
| `status` | String | Filter by ZoneStatus |
| `location` | String | Partial match |
| `minCapacity` | Integer | Min total capacity |
| `maxCapacity` | Integer | Max total capacity |
| `search` | String | Free-text on name/location |
| `page` | Integer | Page number (default 0) |
| `size` | Integer | Page size (default 10) |

---

## DTOs

### ParkingZoneRequest (POST / PUT body)

```json
{
  "name": "Zone A - Main Gate",
  "location": "Near Main Entrance, Block 1",
  "type": "COVERED",
  "totalCapacity": 120,
  "availableSlots": 85,
  "status": "ACTIVE",
  "description": "Covered parking for staff",
  "availabilityWindows": [
    { "day": "WEEKDAYS", "openTime": "07:00", "closeTime": "22:00" },
    { "day": "WEEKENDS", "openTime": "08:00", "closeTime": "18:00" }
  ]
}
```

### ParkingZoneResponse (GET response)

```json
{
  "id": 1,
  "name": "Zone A - Main Gate",
  "location": "Near Main Entrance, Block 1",
  "type": "COVERED",
  "totalCapacity": 120,
  "availableSlots": 85,
  "occupancyRate": 29.17,
  "status": "ACTIVE",
  "description": "Covered parking for staff",
  "availabilityWindows": [
    { "day": "WEEKDAYS", "openTime": "07:00", "closeTime": "22:00" },
    { "day": "WEEKENDS", "openTime": "08:00", "closeTime": "18:00" }
  ],
  "createdAt": "2026-04-23T10:00:00",
  "updatedAt": "2026-04-23T10:00:00"
}
```

### StatusUpdateRequest (PATCH body)

```json
{ "status": "OUT_OF_SERVICE" }
```

---

## Spring Boot Project Structure

```
src/main/java/com/campus/parking/
├── controller/
│   └── ParkingZoneController.java
├── service/
│   ├── ParkingZoneService.java
│   └── ParkingZoneServiceImpl.java
├── repository/
│   └── ParkingZoneRepository.java
├── entity/
│   ├── ParkingZone.java
│   ├── ZoneType.java
│   ├── ZoneStatus.java
│   └── AvailabilityWindow.java
├── dto/
│   ├── ParkingZoneRequest.java
│   ├── ParkingZoneResponse.java
│   └── StatusUpdateRequest.java
├── mapper/
│   └── ParkingZoneMapper.java
├── exception/
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java
└── CampusParkingApplication.java
```

---

## Key Implementation Snippets

### Controller

```java
@RestController
@RequestMapping("/api/v1/parking-zones")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ParkingZoneController {

    private final ParkingZoneService service;

    @GetMapping
    public ResponseEntity<Page<ParkingZoneResponse>> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.findAll(type, status, location, minCapacity, maxCapacity, search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingZoneResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ParkingZoneResponse> create(@Valid @RequestBody ParkingZoneRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingZoneResponse> update(@PathVariable Long id,
            @Valid @RequestBody ParkingZoneRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingZoneResponse> updateStatus(@PathVariable Long id,
            @RequestBody StatusUpdateRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Repository — Dynamic Filtering with Specification

```java
@Repository
public interface ParkingZoneRepository
    extends JpaRepository<ParkingZone, Long>, JpaSpecificationExecutor<ParkingZone> {
}
```

```java
// In ServiceImpl — build Specification dynamically
Specification<ParkingZone> spec = Specification.where(null);

if (type != null)
    spec = spec.and((root, q, cb) -> cb.equal(root.get("type"), ZoneType.valueOf(type)));
if (status != null)
    spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), ZoneStatus.valueOf(status)));
if (location != null)
    spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
if (minCapacity != null)
    spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("totalCapacity"), minCapacity));
if (search != null) {
    String pattern = "%" + search.toLowerCase() + "%";
    spec = spec.and((root, q, cb) -> cb.or(
        cb.like(cb.lower(root.get("name")), pattern),
        cb.like(cb.lower(root.get("location")), pattern)
    ));
}

return repository.findAll(spec, PageRequest.of(page, size))
    .map(mapper::toResponse);
```

### application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campus_parking
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### pom.xml — Key Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <!-- JSONB support for AvailabilityWindow -->
    <dependency>
        <groupId>io.hypersistence</groupId>
        <artifactId>hypersistence-utils-hibernate-62</artifactId>
        <version>3.7.0</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## Database Schema (PostgreSQL)

```sql
CREATE TABLE parking_zones (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    location        VARCHAR(200) NOT NULL,
    type            VARCHAR(20)  NOT NULL CHECK (type IN ('OPEN','COVERED','MULTI_LEVEL','RESTRICTED')),
    total_capacity  INTEGER      NOT NULL CHECK (total_capacity > 0),
    available_slots INTEGER      NOT NULL DEFAULT 0,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE','OUT_OF_SERVICE','MAINTENANCE')),
    description     TEXT,
    availability_windows JSONB,
    created_at      TIMESTAMP    DEFAULT NOW(),
    updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX idx_zone_type     ON parking_zones(type);
CREATE INDEX idx_zone_status   ON parking_zones(status);
CREATE INDEX idx_zone_location ON parking_zones(location);
```

---

## React Frontend Structure

```
src/
├── pages/admin/
│   └── ZoneManagement.jsx       ← Main admin page
├── components/parking/
│   ├── ZoneTable.jsx            ← Data table with search + filters
│   ├── ZoneFormModal.jsx        ← Add / Edit modal
│   ├── ZoneStatusBadge.jsx      ← Colored status chip
│   └── AvailabilityEditor.jsx   ← Availability windows UI
├── services/
│   └── parkingZoneService.js    ← Axios wrapper
├── hooks/
│   └── useParkingZones.js       ← Data fetching hook
└── constants/
    └── parkingConstants.js      ← Enum mirrors (ZONE_TYPES, ZONE_STATUSES)
```

### parkingZoneService.js

```js
import axios from 'axios';

const BASE = 'http://localhost:8080/api/v1/parking-zones';

export const parkingZoneService = {
  getAll:       (params)       => axios.get(BASE, { params }),
  getById:      (id)           => axios.get(`${BASE}/${id}`),
  create:       (data)         => axios.post(BASE, data),
  update:       (id, data)     => axios.put(`${BASE}/${id}`, data),
  updateStatus: (id, status)   => axios.patch(`${BASE}/${id}/status`, { status }),
  delete:       (id)           => axios.delete(`${BASE}/${id}`),
};
```

---

## Error Response Format

```json
{
  "timestamp": "2026-04-23T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Parking zone not found with id: 99",
  "path": "/api/v1/parking-zones/99"
}
```

| HTTP Status | Scenario |
|-------------|----------|
| 200 | Success |
| 201 | Zone created |
| 400 | Validation error |
| 404 | Zone not found |
| 409 | Duplicate zone name |
| 500 | Server error |

---

*Campus Parking Management System — Module A: Parking Zone Management*