# Contribution – Member 2
## StudyBridge Parking Management System

---

# Frontend

## Pages Implemented

### P08 · Book a Slot Page
**Route:** `/book/:slotId`
**Access:** USER, WARDEN

Slot booking form page. Users can select date, time range, and enter vehicle details for a chosen slot. Real-time conflict detection runs on every date/time change via API call.

**Components Used:**
- `SlotCard` – displays selected slot summary at the top
- `InputField` – date picker, vehicle registration input, purpose textarea
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
| Purpose | Textarea | Optional, max 200 characters |

**Behavior:**
- On date/time change → triggers real-time conflict check via API
- If conflict exists → red warning banner rendered
- On submit → `ConfirmModal` opens → on confirm → POST request → `Toast` shown
- Booking created with `PENDING` status, awaits admin approval

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
| Booking Info | Date, time range, vehicle reg, purpose |
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

Admin-facing page to review, approve, or reject all booking requests system-wide.

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

# Backend

## API Endpoints Implemented

### Booking Management

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | USER, WARDEN | Create a new booking request (status: PENDING) |
| `GET` | `/api/bookings/my` | USER, WARDEN | Get all bookings for the logged-in user |
| `GET` | `/api/bookings/:bookingId` | USER, ADMIN | Get full detail of a single booking |
| `PATCH` | `/api/bookings/:bookingId/cancel` | USER, WARDEN | Cancel a PENDING or APPROVED booking |
| `GET` | `/api/bookings` | ADMIN | Get all bookings system-wide (with filters) |
| `PATCH` | `/api/bookings/:bookingId/approve` | ADMIN | Approve a PENDING booking |
| `PATCH` | `/api/bookings/:bookingId/reject` | ADMIN | Reject a booking with a reason |

---

### Conflict Detection

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings/conflict-check` | USER, WARDEN | Check if a slot has an overlapping booking for a given date/time range |

**Query Parameters:**
```
slotId    – ID of the slot being checked
date      – Booking date (YYYY-MM-DD)
startTime – Start time (HH:mm)
endTime   – End time (HH:mm)
```

**Response:**
```json
{
  "hasConflict": true | false
}
```

Triggered on every date/time field change from the frontend (P08 Book a Slot Page).

---

## Business Logic

### Booking Creation (`POST /api/bookings`)
- Validates date is not in the past
- Validates `endTime` is after `startTime`
- Runs a conflict check before persisting — rejects if overlapping booking exists for the same slot
- Creates booking with status `PENDING`
- Returns created booking object

### Booking Cancellation (`PATCH /api/bookings/:bookingId/cancel`)
- Only allowed if booking status is `PENDING` or `APPROVED`
- Ownership check – user can only cancel their own bookings
- Updates status to `CANCELLED`

### Admin Approve (`PATCH /api/bookings/:bookingId/approve`)
- ADMIN only
- Updates booking status from `PENDING` to `APPROVED`

### Admin Reject (`PATCH /api/bookings/:bookingId/reject`)
- ADMIN only
- Requires `reason` field in request body
- Updates booking status to `REJECTED`, stores admin notes

### Status History / Timeline
- Each status change (PENDING → APPROVED / REJECTED / CANCELLED) is recorded with a timestamp
- Exposed via the booking detail response for frontend timeline rendering (P10)

---

## Database Schema (Booking-Related Tables)

### `Booking`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | FK → User | Booking owner |
| `slotId` | FK → ParkingSlot | Target slot |
| `date` | Date | Booking date |
| `startTime` | Time | Booking start time |
| `endTime` | Time | Booking end time |
| `vehicleReg` | String | Vehicle registration number |
| `purpose` | String? | Optional reason (max 200 chars) |
| `status` | Enum | PENDING, APPROVED, REJECTED, CANCELLED |
| `adminNotes` | String? | Rejection reason from admin |
| `createdAt` | DateTime | Auto-generated |
| `updatedAt` | DateTime | Auto-updated |

### `BookingStatusHistory`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `bookingId` | FK → Booking | Associated booking |
| `status` | Enum | Status at this point |
| `changedAt` | DateTime | Timestamp of status change |
| `changedBy` | FK → User | Who triggered the change |

---

## Filters & Query Parameters

### `GET /api/bookings` (Admin)

| Parameter | Type | Description |
|---|---|---|
| `status` | Enum? | Filter by booking status |
| `zoneId` | UUID? | Filter by parking zone |
| `dateFrom` | Date? | Date range start |
| `dateTo` | Date? | Date range end |
| `search` | String? | Search by user name or slot number |

### `GET /api/bookings/my` (User)

| Parameter | Type | Description |
|---|---|---|
| `status` | Enum? | Filter by booking status (matches tab selection on P09) |

---

*Member 2 | StudyBridge Parking Management System*