
Email: admin@smartpark.com
Password: admin123



# Contribution – Member 2
## StudyBridge Parking Management System

---

# Frontend

## Pages Implemented

### P08 · Book a Slot Page
**Route:** `/book/:slotId`
**Access:** USER, WARDEN

Slot booking form page. Users can request a booking for a resource by providing date, time range, purpose, and expected attendees. Real-time conflict detection runs on every date/time change via API call to prevent scheduling conflicts for the same resource.

**Components Used:**
- `SlotCard` – displays selected slot summary at the top
- `InputField` – date picker, vehicle registration input, purpose textarea, expected attendees input
- `TimeSlotPicker` – start time and end time selector
- `VehicleTypeBadge` – confirms vehicle type
- `StatusBadge` – shows "CONFLICT DETECTED" warning banner
- `Button` – "Request Booking" (primary) and "Cancel" (secondary)
- `ConfirmModal` – confirmation dialog before submitting
- `Toast` – booking submitted success notification

**Form Fields:**

| Field | Type | Validation |
|---|---|---|
| Date | Date picker | Required, not in the past |
| Start Time | Time picker | Required |
| End Time | Time picker | Required, must be after start time |
| Vehicle Registration | Text input | Required |
| Purpose | Textarea | Required, max 200 characters |
| Expected Attendees | Number input | Optional, where applicable |

**Behavior:**
- On date/time change → triggers real-time conflict check via API to detect overlapping time ranges
- If conflict exists → red warning banner rendered
- On submit → `ConfirmModal` opens → on confirm → POST request → `Toast` shown
- Booking created with `PENDING` status, enters PENDING → APPROVED/REJECTED workflow

---

### P09 · My Bookings Page
**Route:** `/my-bookings`
**Access:** USER, WARDEN

Lists all bookings made by the logged-in user. Tab-based filtering by status.

**Components Used:**
- `BookingCard` – displays each booking summary
- `StatusBadge` – shows PENDING / APPROVED / REJECTED / CANCELLED
- `VehicleTypeBadge` – slot vehicle type indicator
- `Button` – "Cancel" (for PENDING/APPROVED), "View Details" (navigate to detail page)
- `EmptyState` – shown when no bookings match the selected tab
- `LoadingSkeleton` – loading placeholder while bookings fetch
- `Toast` – cancellation confirmed notification

**Tab Views:**

| Tab | Shows |
|---|---|
| All | All user bookings |
| Pending | Awaiting admin approval |
| Approved | Confirmed bookings |
| Rejected | Rejected with reason |
| Cancelled | User-cancelled bookings |

---

### P10 · Booking Detail Page
**Route:** `/my-bookings/:bookingId`
**Access:** Booking owner (USER) or ADMIN

Full detail view of a single booking with status timeline and admin notes.

**Components Used:**
- `StatusBadge` – large status indicator at top banner
- `SlotCard` – booked slot summary
- `VehicleTypeBadge` – vehicle type
- `InputField` (read-only) – date, time, vehicle reg, purpose display
- `Button` – "Cancel Booking" (visible if PENDING or APPROVED)
- `ConfirmModal` – "Are you sure you want to cancel?" dialog
- `Toast` – cancellation confirmed notification

**Page Sections:**

| Section | Content |
|---|---|
| Status Banner | Large status badge with timestamp |
| Slot Info | Zone, slot number, type, location |
| Booking Info | Date, time range, vehicle reg, purpose, expected attendees |
| Admin Notes | Rejection reason (if REJECTED) |
| Timeline | Status history with timestamps |

**Status Timeline Steps:**
1. PENDING – Submitted, awaiting review
2. APPROVED / REJECTED – Admin decision recorded
3. CANCELLED – If user cancelled

---

### P11 · Admin Booking Review Page
**Route:** `/admin/bookings`
**Access:** ADMIN only

Admin-facing page to review, approve, or reject all booking requests system-wide with a reason. Admin can view all bookings with filters applied.

**Components Used:**
- `SearchBar` – search by user name or slot number
- `FilterBar` – filter by status, zone, date range
- `FilterDropdown` (×3) – Status, Zone, Date Range filters
- `BookingCard` – each booking request row
- `StatusBadge` – current booking status
- `VehicleTypeBadge` – slot vehicle type
- `AvatarCircle` – requester profile photo
- `Button` – "Approve" (green) / "Reject" (red) per booking
- `ConfirmModal` – rejection reason entry dialog
- `InputField` – rejection reason textarea (inside modal)
- `EmptyState` – "No booking requests found"
- `LoadingSkeleton` – while bookings load
- `Toast` – approve/reject confirmation notification

**Filter Options:**

| Filter | Options |
|---|---|
| Status | All, Pending, Approved, Rejected, Cancelled |
| Zone | All, Zone A, Zone B, Zone C, … |
| Date Range | Today, This Week, This Month, Custom |

---

## Dashboard Booking-Related Sections

### P04 · User Dashboard – Booking Sections
**Route:** `/dashboard`

Booking-relevant StatCards and sections contributed:
- **Active Booking StatCard** – shows current approved/upcoming booking count
- **Total Bookings StatCard** – total bookings ever made by user
- **BookingCard** in Active Booking section – displays current active/upcoming booking with `StatusBadge`
- `EmptyState` – "No active booking" shown when no current booking exists

### P05 · Admin Dashboard – Booking Sections
**Route:** `/admin/dashboard`

Booking-relevant StatCards and sections contributed:
- **Active Bookings Today StatCard** – number of approved bookings for today
- **Pending Requests StatCard** – booking requests awaiting admin review
- **BookingCard** in Pending Bookings section – latest PENDING requests with "Approve" / "Reject" quick action `Button`s
- `EmptyState` – "No pending requests" shown when queue is clear

---

# Backend (Spring Boot)

## Technology Stack
- **Framework:** Spring Boot (REST API)
- **ORM:** Spring Data JPA (Hibernate)
- **Database:** MySQL / PostgreSQL
- **Security:** Spring Security with role-based access (USER, WARDEN, ADMIN)
- **Build Tool:** Maven

---

## Controller – `BookingController`

**Base Mapping:** `@RequestMapping("/api/bookings")`

| HTTP Method | Endpoint | Annotation | Access | Description |
|---|---|---|---|---|
| `POST` | `/api/bookings` | `@PostMapping` | USER, WARDEN | Submit a new booking request (status defaults to PENDING) |
| `GET` | `/api/bookings/my` | `@GetMapping("/my")` | USER, WARDEN | Get all bookings belonging to the authenticated user |
| `GET` | `/api/bookings/{bookingId}` | `@GetMapping("/{bookingId}")` | USER, ADMIN | Get full detail of a single booking by ID |
| `PATCH` | `/api/bookings/{bookingId}/cancel` | `@PatchMapping("/{bookingId}/cancel")` | USER, WARDEN | Cancel a PENDING or APPROVED booking |
| `GET` | `/api/bookings` | `@GetMapping` | ADMIN | Get all bookings system-wide with optional filters |
| `PATCH` | `/api/bookings/{bookingId}/approve` | `@PatchMapping("/{bookingId}/approve")` | ADMIN | Approve a PENDING booking |
| `PATCH` | `/api/bookings/{bookingId}/reject` | `@PatchMapping("/{bookingId}/reject")` | ADMIN | Reject a booking with a mandatory reason |
| `GET` | `/api/bookings/conflict-check` | `@GetMapping("/conflict-check")` | USER, WARDEN | Check for overlapping bookings on the same resource |

---

## Request / Response DTOs

### `BookingRequestDTO` (used in `POST /api/bookings`)
```java
private Long slotId;
private LocalDate date;
private LocalTime startTime;
private LocalTime endTime;
private String vehicleReg;
private String purpose;          // max 200 chars
private Integer expectedAttendees; // nullable, where applicable
```

### `RejectRequestDTO` (used in `PATCH /{bookingId}/reject`)
```java
private String reason; // required
```

### Conflict Check Query Parameters (`GET /conflict-check`)
```
slotId    – ID of the resource/slot being checked
date      – Booking date (yyyy-MM-dd)
startTime – Start time (HH:mm)
endTime   – End time (HH:mm)
```

**Response:**
```json
{
  "hasConflict": true | false
}
```

---

## Service – `BookingService`

### `createBooking(BookingRequestDTO dto, Long userId)`
- Validates `date` is not in the past
- Validates `endTime` is after `startTime`
- Calls conflict check — throws `ConflictException` if overlapping booking exists for the same resource and time range
- Persists booking with status `PENDING`
- Logs initial status entry in `BookingStatusHistory`

### `cancelBooking(Long bookingId, Long userId)`
- Fetches booking by ID, throws `NotFoundException` if not found
- Verifies ownership — throws `ForbiddenException` if user does not own the booking
- Validates status is `PENDING` or `APPROVED` — throws `InvalidStateException` otherwise
- Updates status to `CANCELLED`, logs history entry

### `approveBooking(Long bookingId)`
- ADMIN only (enforced via `@PreAuthorize`)
- Updates status from `PENDING` to `APPROVED`
- Logs history entry with timestamp

### `rejectBooking(Long bookingId, String reason)`
- ADMIN only
- Updates status to `REJECTED`, stores `adminNotes`
- Logs history entry with timestamp

### `checkConflict(Long slotId, LocalDate date, LocalTime startTime, LocalTime endTime)`
- Queries `BookingRepository` for any APPROVED or PENDING bookings on the same slot where time ranges overlap
- Returns `true` if conflict found, `false` otherwise

### `getAllBookings(BookingFilterParams params)`
- ADMIN only
- Supports filtering by `status`, `zoneId`, `dateFrom`, `dateTo`, `search` (user name or slot number)
- Returns paginated result

### `getMyBookings(Long userId, BookingStatus status)`
- Returns all bookings for the authenticated user
- Optional `status` filter matches tab selection on P09

---

## Entity – `Booking`

```java
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot slot;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String vehicleReg;

    @Column(length = 200)
    private String purpose;

    @Column
    private Integer expectedAttendees; // nullable, where applicable

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status; // PENDING, APPROVED, REJECTED, CANCELLED

    @Column
    private String adminNotes; // populated on rejection

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### `BookingStatus` Enum
```java
public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED
}
```

**Allowed Workflow Transitions:**
```
PENDING → APPROVED
PENDING → REJECTED
PENDING → CANCELLED
APPROVED → CANCELLED
```

---

## Entity – `BookingStatusHistory`

```java
@Entity
@Table(name = "booking_status_history")
public class BookingStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "changed_by")
    private User changedBy;
}
```

Records every status change with a timestamp and the user who triggered it. Exposed via booking detail response for timeline rendering on P10.

---

## Repository – `BookingRepository`

```java
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings by user
    List<Booking> findByUserId(Long userId);

    // Get bookings by user filtered by status
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    // Conflict detection query
    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.slot.id = :slotId
        AND b.date = :date
        AND b.status IN ('PENDING', 'APPROVED')
        AND b.startTime < :endTime
        AND b.endTime > :startTime
    """)
    boolean existsConflict(
        @Param("slotId") Long slotId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}
```

---

## Admin Filter Params – `BookingFilterParams`

| Parameter | Type | Description |
|---|---|---|
| `status` | `BookingStatus?` | Filter by booking status |
| `zoneId` | `Long?` | Filter by parking zone |
| `dateFrom` | `LocalDate?` | Date range start |
| `dateTo` | `LocalDate?` | Date range end |
| `search` | `String?` | Search by user name or slot number |

---

*Member 2 | StudyBridge Parking Management System*