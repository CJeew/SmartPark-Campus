# 🚗 Smart Campus Parking Hub
### IT3030 – Programming Applications and Frameworks (2026, Semester 1)
### SLIIT – Faculty of Computing

> **All Pages · All Components · Full Detail**
> Smart Campus Vehicle Parking Pre-Reservation System — Frontend Documentation

---

## 📑 Table of Contents

### Pages
- [P01 · Login Page](#p01--login-page)
- [P02 · Register Page](#p02--register-page)
- [P03 · Profile Page](#p03--profile-page)
- [P04 · User Dashboard](#p04--user-dashboard)
- [P05 · Admin Dashboard](#p05--admin-dashboard)
- [P06 · Parking Zone Browse Page](#p06--parking-zone-browse-page)
- [P07 · Slot Catalogue Page](#p07--slot-catalogue-page)
- [P08 · Book a Slot Page](#p08--book-a-slot-page)
- [P09 · My Bookings Page](#p09--my-bookings-page)
- [P10 · Booking Detail Page](#p10--booking-detail-page)
- [P11 · Admin Booking Review Page](#p11--admin-booking-review-page)
- [P12 · Report Incident Page](#p12--report-incident-page)
- [P13 · My Tickets Page](#p13--my-tickets-page)
- [P14 · Ticket Detail Page](#p14--ticket-detail-page)
- [P15 · Admin Ticket Dashboard](#p15--admin-ticket-dashboard)
- [P16 · Admin Zone Management Page](#p16--admin-zone-management-page)
- [P17 · Admin Slot Management Page](#p17--admin-slot-management-page)
- [P18 · Notifications Page](#p18--notifications-page)
- [P19 · Admin User Management Page](#p19--admin-user-management-page)

### Components (All)
- [C01 · InputField](#c01--inputfield)
- [C02 · Button](#c02--button)
- [C03 · AvatarCircle](#c03--avatarcircle)
- [C04 · StatusBadge](#c04--statusbadge)
- [C05 · TagBadge](#c05--tagbadge)
- [C06 · SearchBar](#c06--searchbar)
- [C07 · FilterDropdown](#c07--filterdropdown)
- [C08 · FilterBar](#c08--filterbar)
- [C09 · SlotCard](#c09--slotcard)
- [C10 · ZoneCard](#c10--zonecard)
- [C11 · BookingCard](#c11--bookingcard)
- [C12 · TicketCard](#c12--ticketcard)
- [C13 · StatCard](#c13--statcard)
- [C14 · NotificationItem](#c14--notificationitem)
- [C15 · PriorityBadge](#c15--prioritybadge)
- [C16 · FileUpload](#c16--fileupload)
- [C17 · CommentBox](#c17--commentbox)
- [C18 · TimeSlotPicker](#c18--timeslotpicker)
- [C19 · VehicleTypeBadge](#c19--vehicletypebadge)
- [C20 · ConfirmModal](#c20--confirmmodal)
- [C21 · EmptyState](#c21--emptystate)
- [C22 · LoadingSkeleton](#c22--loadingskeleton)
- [C23 · Toast](#c23--toast)
- [C24 · UserRoleBadge](#c24--userrolebadge)

---

# ═══════════════════════════════
# PAGES
# ═══════════════════════════════

---

## P01 · Login Page

**Route:** `/login`
**Access:** Public (unauthenticated users only)
**Member:** Member 4

### Purpose
Entry point for all users. Authenticates via Google OAuth 2.0 (SLIIT Google accounts) and redirects to the correct dashboard based on role.

### Layout
- Centered card on a clean background
- App logo and name at the top
- Google Sign-In button below
- Footer links at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `Button` | Center card | "Sign in with Google" OAuth button |
| `Toast` | Top of screen | Error message if login fails |

### Actions & Behavior
- Click "Sign in with Google" → OAuth 2.0 Google flow
- On successful login → redirect based on role:
  - `USER` → `/dashboard`
  - `WARDEN` → `/dashboard`
  - `ADMIN` → `/admin/dashboard`
- On failure → show `Toast` with error message
- "Don't have an account? Register" link at bottom

---

## P02 · Register Page

**Route:** `/register`
**Access:** Public
**Member:** Member 4

### Purpose
New user self-registration using university credentials. Collects vehicle details and personal info to set up the account.

### Layout
- Single scrollable form card
- Google OAuth at the top for identity
- Additional fields below

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `InputField` | Form | Full name input |
| `InputField` | Form | University ID / Index number |
| `InputField` | Form | Phone number input |
| `FilterDropdown` | Form | Faculty / Department selector |
| `FilterDropdown` | Form | User type (Student / Staff) |
| `VehicleTypeBadge` | Vehicle section | Select vehicle type (CAR / BIKE / THREE_WHEELER) |
| `InputField` | Vehicle section | Vehicle registration number |
| `Button` | Submit area | "Create Account" primary action |
| `Toast` | Top of screen | Success or error feedback |

### Fields

| Field | Type | Validation |
|---|---|---|
| Full Name | text | Required |
| University ID | text | Required, unique |
| Phone Number | text | Required, valid format |
| Faculty | dropdown | Required |
| User Type | dropdown | Required (Student / Staff) |
| Vehicle Type | chip selector | Required, min 1 |
| Vehicle Registration | text | Required, unique |

### Actions & Behavior
- On success → auto login → redirect to `/dashboard`
- "Already have an account? Login" link at bottom

---

## P03 · Profile Page

**Route:** `/profile` and `/profile/edit`
**Access:** All logged-in users
**Member:** Member 4

### Purpose
View and edit personal profile and registered vehicle details.

### Layout
- View mode: profile info displayed in sections
- Edit mode: same layout with editable input fields

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `AvatarCircle` | Top center | Display profile photo from Google |
| `UserRoleBadge` | Profile header | Shows role: USER / WARDEN / ADMIN |
| `InputField` | Edit mode | Name, phone fields |
| `FilterDropdown` | Edit mode | Faculty, user type dropdowns |
| `VehicleTypeBadge` | Vehicle section | Display / edit vehicle type |
| `InputField` | Vehicle section | Edit vehicle registration |
| `StatusBadge` | Vehicle section | Vehicle verification status |
| `Button` | Action area | "Edit Profile" / "Save Changes" |
| `Toast` | Top of screen | Save success or error |

### Sections on Page

| Section | Content |
|---|---|
| Header | Avatar, Name, Role badge, Faculty |
| Personal Info | University ID, Phone, Faculty, User type |
| Vehicle Info | Vehicle type badge, Registration number, Status |
| Activity Stats | Total bookings made, Tickets submitted |

---

## P04 · User Dashboard

**Route:** `/dashboard` (when role = USER or WARDEN)
**Access:** USER and WARDEN roles
**Member:** Member 4

### Purpose
Central hub for regular users. Shows active booking, upcoming reservations, recent tickets, and notifications at a glance.

### Layout
- StatCards row at the top
- Two-column section: active booking + recent tickets
- Upcoming bookings at the bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `StatCard` | Top row (×4) | Total Bookings, Active Booking, Tickets Open, Tickets Resolved |
| `BookingCard` | Active Booking section | Current active/upcoming booking |
| `TicketCard` | Recent Tickets section | Last 3 submitted tickets |
| `StatusBadge` | Booking section | Current booking status |
| `NotificationItem` | Notifications panel | Recent 3 notifications |
| `EmptyState` | Any empty section | "No active booking", "No tickets yet" |
| `LoadingSkeleton` | All sections | While data is fetching |

### StatCards Shown

| StatCard Label | Value Shown |
|---|---|
| Total Bookings | Total bookings ever made by user |
| Active Booking | Current approved/upcoming booking |
| Open Tickets | Tickets with OPEN or IN_PROGRESS status |
| Resolved Tickets | Total resolved/closed tickets |

---

## P05 · Admin Dashboard

**Route:** `/admin/dashboard` (when role = ADMIN)
**Access:** ADMIN only
**Member:** Member 4

### Purpose
Central hub for admins. Shows system-wide stats, pending booking requests, open tickets, and quick action shortcuts.

### Layout
- StatCards row at top
- Two-column: pending bookings + open tickets
- Zone occupancy overview at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `StatCard` | Top row (×4) | Total Slots, Active Bookings, Pending Requests, Open Tickets |
| `BookingCard` | Pending Bookings section | Latest PENDING booking requests |
| `TicketCard` | Open Tickets section | Latest OPEN tickets |
| `PriorityBadge` | Ticket items | Priority level indicator |
| `StatusBadge` | Booking items | PENDING status badge |
| `Button` | Each booking card | Quick "Approve" / "Reject" actions |
| `EmptyState` | Any empty section | "No pending requests" |
| `LoadingSkeleton` | All sections | While data is fetching |

### StatCards Shown

| StatCard Label | Value Shown |
|---|---|
| Total Slots | Total parking slots in the system |
| Active Bookings Today | Number of approved bookings for today |
| Pending Requests | Booking requests awaiting admin review |
| Open Tickets | Maintenance/incident tickets not yet resolved |

---

## P06 · Parking Zone Browse Page

**Route:** `/zones`
**Access:** All logged-in users
**Member:** Member 1

### Purpose
Users browse all available parking zones on campus. View zone details, total capacity, and navigate to slots within a zone.

### Layout
- SearchBar at the top
- ZoneCard grid below
- Slot availability summary per zone

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `SearchBar` | Top of page | Search zones by name or location |
| `ZoneCard` | Main grid | One card per parking zone |
| `StatusBadge` | Inside ZoneCard | Zone status: ACTIVE / FULL / OUT_OF_SERVICE |
| `VehicleTypeBadge` | Inside ZoneCard | Vehicle types supported in that zone |
| `Button` | Inside ZoneCard | "View Slots" navigate to slot catalogue |
| `EmptyState` | Grid area | "No zones available" |
| `LoadingSkeleton` | Grid area | While zone list loads |

### ZoneCard Info Shown

| Field | Content |
|---|---|
| Zone Name | Name of the parking zone |
| Location | Physical location on campus |
| Total Slots | Total number of slots in the zone |
| Available Slots | Current available count |
| Supported Types | VehicleTypeBadge chips |
| Status | ACTIVE / FULL / OUT_OF_SERVICE |

---

## P07 · Slot Catalogue Page

**Route:** `/zones/:zoneId/slots`
**Access:** All logged-in users
**Member:** Member 1

### Purpose
Browse all slots within a specific zone. Filter by vehicle type and availability. Select a slot to book.

### Layout
- Zone header with summary info
- FilterBar below header
- SlotCard grid (color-coded by status)
- Pagination at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `FilterBar` | Below zone header | Filter slots by type and status |
| `FilterDropdown` | Inside FilterBar (×2) | Vehicle type filter + Status filter |
| `SlotCard` | Main grid | One card per parking slot |
| `VehicleTypeBadge` | Inside SlotCard | Type: CAR / BIKE / THREE_WHEELER |
| `StatusBadge` | Inside SlotCard | AVAILABLE / BOOKED / OUT_OF_SERVICE |
| `Button` | Inside SlotCard | "Book This Slot" action |
| `EmptyState` | Grid area | "No slots match your filters" |
| `LoadingSkeleton` | Grid area | While slot list loads |

### Filter Options

| Filter | Options |
|---|---|
| Vehicle Type | All, CAR, BIKE, THREE_WHEELER |
| Status | All, Available, Booked, Out of Service |

### Slot Status Color Guide

| Status | Color |
|---|---|
| AVAILABLE | 🟢 Green card border |
| BOOKED | 🔴 Red card border |
| OUT_OF_SERVICE | ⚫ Grey card border |

---

## P08 · Book a Slot Page

**Route:** `/book/:slotId`
**Access:** USER and WARDEN roles
**Member:** Member 2

### Purpose
User fills in booking details for a selected slot: date, time range, and vehicle info. System checks for conflicts in real time before confirming.

### Layout
- Slot summary header (zone, type, location)
- Booking form below
- Conflict warning section
- Submit / Cancel buttons at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `SlotCard` | Top header | Summary of selected slot |
| `InputField` | Form | Date picker |
| `TimeSlotPicker` | Form | Start time and end time selector |
| `InputField` | Form | Vehicle registration number |
| `InputField` | Form | Purpose / reason for booking |
| `VehicleTypeBadge` | Form | Confirm vehicle type |
| `StatusBadge` | Conflict section | "CONFLICT DETECTED" warning |
| `Button` | Submit row | "Request Booking" primary action |
| `Button` | Submit row | "Cancel" secondary action |
| `Toast` | Top of screen | Booking submitted confirmation |
| `ConfirmModal` | On submit | "Confirm your booking?" modal |

### Form Fields

| Field | Type | Validation |
|---|---|---|
| Date | date picker | Required, not in the past |
| Start Time | time picker | Required |
| End Time | time picker | Required, after start time |
| Vehicle Registration | text | Required |
| Purpose | textarea | Optional, max 200 chars |

### Actions & Behavior
- On date/time change → real-time conflict check via API
- If conflict → show red warning banner "This slot is already booked for the selected time"
- On submit → show `ConfirmModal` → on confirm → POST booking → show `Toast`
- Booking created with PENDING status → awaits admin approval

---

## P09 · My Bookings Page

**Route:** `/my-bookings`
**Access:** USER and WARDEN roles
**Member:** Member 2

### Purpose
Users view all their own booking requests and their current statuses. Can cancel PENDING or APPROVED bookings.

### Layout
- Tab bar at top: All / Pending / Approved / Rejected / Cancelled
- List of BookingCards below

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `BookingCard` | Main list | Each booking summary |
| `StatusBadge` | Inside BookingCard | PENDING / APPROVED / REJECTED / CANCELLED |
| `VehicleTypeBadge` | Inside BookingCard | Slot vehicle type |
| `Button` | Inside BookingCard | "Cancel" for PENDING / APPROVED bookings |
| `Button` | Inside BookingCard | "View Details" navigate to detail page |
| `EmptyState` | List area | "No bookings found" |
| `LoadingSkeleton` | List area | While bookings load |
| `Toast` | Top of screen | Cancellation confirmed |

### Tab Views

| Tab | Bookings Shown |
|---|---|
| All | All bookings by the user |
| Pending | Awaiting admin approval |
| Approved | Confirmed bookings |
| Rejected | Rejected requests with reason |
| Cancelled | User-cancelled bookings |

---

## P10 · Booking Detail Page

**Route:** `/my-bookings/:bookingId`
**Access:** Booking owner (USER) or ADMIN
**Member:** Member 2

### Purpose
Full detail view of a single booking. Shows all booking info, status timeline, and rejection reason if applicable.

### Layout
- Booking status banner at top
- Booking info card
- Status timeline below
- Actions at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `StatusBadge` | Top banner | Large current status indicator |
| `SlotCard` | Booking info | Summary of the booked slot |
| `VehicleTypeBadge` | Info section | Vehicle type of the slot |
| `InputField` | Info section (read-only) | Date, time, vehicle reg, purpose |
| `Button` | Actions row | "Cancel Booking" (if PENDING or APPROVED) |
| `Toast` | Top of screen | Cancellation confirmation |
| `ConfirmModal` | On cancel | "Are you sure you want to cancel?" |

### Status Timeline

| Step | Status |
|---|---|
| 1 | PENDING – Submitted, awaiting review |
| 2 | APPROVED / REJECTED – Admin decision |
| 3 | CANCELLED – If user cancelled |

### Sections on Page

| Section | Content |
|---|---|
| Status Banner | Large status badge + timestamp |
| Slot Info | Zone, slot number, type, location |
| Booking Info | Date, time range, vehicle reg, purpose |
| Admin Notes | Rejection reason (if REJECTED) |
| Timeline | Status history with timestamps |

---

## P11 · Admin Booking Review Page

**Route:** `/admin/bookings`
**Access:** ADMIN only
**Member:** Member 2

### Purpose
Admin views all booking requests across all users. Can filter, approve, or reject individual bookings with a reason.

### Layout
- FilterBar at top
- Table or card list of all bookings
- Approve / Reject action per row

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `SearchBar` | Top of page | Search by user name or slot number |
| `FilterBar` | Below search | Filter by status, zone, date |
| `FilterDropdown` | Inside FilterBar (×3) | Status, Zone, Date Range filters |
| `BookingCard` | Main list | Each booking request row |
| `StatusBadge` | Inside BookingCard | Current booking status |
| `VehicleTypeBadge` | Inside BookingCard | Slot vehicle type |
| `AvatarCircle` | Inside BookingCard | Requester profile photo |
| `Button` | Inside BookingCard | "Approve" (green) / "Reject" (red) actions |
| `ConfirmModal` | On approve/reject | Enter reason modal for rejection |
| `InputField` | Inside ConfirmModal | Rejection reason textarea |
| `EmptyState` | List area | "No booking requests found" |
| `LoadingSkeleton` | List area | While bookings load |
| `Toast` | Top of screen | Approve / reject confirmed |

### Filter Options

| Filter | Options |
|---|---|
| Status | All, Pending, Approved, Rejected, Cancelled |
| Zone | All, Zone A, Zone B, Zone C, ... |
| Date Range | Today, This Week, This Month, Custom |

---

## P12 · Report Incident Page

**Route:** `/tickets/new`
**Access:** All logged-in users
**Member:** Member 3

### Purpose
Users submit a maintenance or incident report for a parking issue (damaged barriers, potholes, lighting faults, suspicious vehicles, etc.).

### Layout
- Single scrollable form
- Image upload section
- Submit / Cancel at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `InputField` | Form | Incident title |
| `FilterDropdown` | Form | Category selector |
| `FilterDropdown` | Form | Priority selector |
| `InputField` | Form | Location / Zone reference |
| `InputField` | Form | Description textarea |
| `InputField` | Form | Preferred contact number |
| `FileUpload` | Attachments section | Upload up to 3 evidence images |
| `Button` | Submit row | "Submit Ticket" primary action |
| `Button` | Submit row | "Cancel" secondary action |
| `Toast` | Top of screen | Ticket submitted confirmation |

### Form Fields

| Field | Type | Validation |
|---|---|---|
| Title | text | Required, max 100 chars |
| Category | dropdown | Required |
| Priority | dropdown | Required |
| Zone / Location | text | Required |
| Description | textarea | Required, max 1000 chars |
| Preferred Contact | text | Optional |
| Attachments | file upload | Optional, max 3 images, 5MB each |

### Category Options

| Category | Description |
|---|---|
| Infrastructure | Potholes, broken barriers, damaged walls |
| Electrical | Lighting faults, broken CCTV |
| Security | Suspicious vehicles, unauthorized parking |
| Cleanliness | Garbage, flooding, debris |
| Other | Any other issue |

---

## P13 · My Tickets Page

**Route:** `/my-tickets`
**Access:** All logged-in users
**Member:** Member 3

### Purpose
Users view all their submitted incident/maintenance tickets and track their current status.

### Layout
- Tab bar: All / Open / In Progress / Resolved / Closed
- List of TicketCards

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `TicketCard` | Main list | Each ticket summary |
| `StatusBadge` | Inside TicketCard | OPEN / IN_PROGRESS / RESOLVED / CLOSED / REJECTED |
| `PriorityBadge` | Inside TicketCard | LOW / MEDIUM / HIGH / CRITICAL |
| `TagBadge` | Inside TicketCard | Category tag |
| `Button` | Inside TicketCard | "View Details" navigate action |
| `EmptyState` | List area | "No tickets submitted yet" |
| `LoadingSkeleton` | List area | While tickets load |

### Tab Views

| Tab | Tickets Shown |
|---|---|
| All | All tickets by the user |
| Open | Newly submitted, not yet assigned |
| In Progress | Assigned to warden/technician |
| Resolved | Marked resolved by warden |
| Closed | Admin confirmed closed |

---

## P14 · Ticket Detail Page

**Route:** `/tickets/:ticketId`
**Access:** Ticket owner, assigned WARDEN, or ADMIN
**Member:** Member 3

### Purpose
Full details of a single ticket. Shows status timeline, attachments, comments thread, and resolution notes.

### Layout
- Status banner at top
- Ticket info sections
- Image attachment previews
- Status timeline
- Comments section at bottom

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `StatusBadge` | Top banner | Current ticket status |
| `PriorityBadge` | Header area | Ticket priority level |
| `TagBadge` | Header area | Category tag |
| `AvatarCircle` | Assigned section | Warden/technician photo |
| `FileUpload` | Attachments section | Preview of uploaded evidence images |
| `CommentBox` | Comments section | Add new comment input |
| `AvatarCircle` | Each comment | Commenter's profile photo |
| `Button` | Each own comment | "Edit" / "Delete" (own comments only) |
| `Button` | WARDEN view | "Update Status" + "Add Resolution Notes" |
| `InputField` | Resolution section | Resolution notes textarea (WARDEN/ADMIN) |
| `EmptyState` | Comments section | "No comments yet. Be the first." |
| `Toast` | Top of screen | Comment posted / status updated |

### Sections on Page

| Section | Content |
|---|---|
| Header | Title, Status, Priority, Category |
| Details | Zone/location, description, contact, submitted date |
| Assigned To | Warden/technician name + avatar |
| Attachments | Up to 3 image previews with download |
| Status Timeline | Full history of status changes with timestamps |
| Resolution Notes | Notes added by warden/admin on resolution |
| Comments | Full thread of user + staff comments |

---

## P15 · Admin Ticket Dashboard

**Route:** `/admin/tickets`
**Access:** ADMIN and WARDEN roles
**Member:** Member 3

### Purpose
Admin/Warden views all tickets across the system. Can filter, assign a warden/technician, update status, and add resolution notes.

### Layout
- SearchBar + FilterBar at top
- Table or card list of tickets
- Assign + status update actions per row

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `SearchBar` | Top of page | Search by title, zone, or reporter |
| `FilterBar` | Below search | Filter by status, priority, category |
| `FilterDropdown` | Inside FilterBar (×3) | Status, Priority, Category filters |
| `TicketCard` | Main list | Each ticket summary row |
| `StatusBadge` | Inside TicketCard | Current status |
| `PriorityBadge` | Inside TicketCard | Priority level |
| `AvatarCircle` | Inside TicketCard | Reporter photo |
| `Button` | Inside TicketCard | "Assign" / "Update Status" / "View" |
| `ConfirmModal` | On assign | Dropdown to select warden to assign |
| `FilterDropdown` | Inside ConfirmModal | Select warden/technician from user list |
| `EmptyState` | List area | "No tickets found" |
| `LoadingSkeleton` | List area | While tickets load |
| `Toast` | Top of screen | Assignment / status update confirmed |

### Filter Options

| Filter | Options |
|---|---|
| Status | All, Open, In Progress, Resolved, Closed, Rejected |
| Priority | All, Critical, High, Medium, Low |
| Category | All, Infrastructure, Electrical, Security, Cleanliness, Other |

---

## P16 · Admin Zone Management Page

**Route:** `/admin/zones`
**Access:** ADMIN only
**Member:** Member 1

### Purpose
Admin creates, edits, and deletes parking zones. Manages zone metadata including location, supported vehicle types, and status.

### Layout
- "Add New Zone" button at top right
- ZoneCard grid with edit/delete actions
- Add/Edit Zone modal form

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `Button` | Top right | "Add New Zone" open modal |
| `ZoneCard` | Main grid | Each zone with edit/delete actions |
| `StatusBadge` | Inside ZoneCard | ACTIVE / OUT_OF_SERVICE |
| `VehicleTypeBadge` | Inside ZoneCard | Supported vehicle types |
| `Button` | Inside ZoneCard | "Edit" and "Delete" actions |
| `ConfirmModal` | On delete | "Are you sure?" confirmation |
| `InputField` | Add/Edit modal | Zone name, location, description |
| `FilterDropdown` | Add/Edit modal | Status selector |
| `VehicleTypeBadge` | Add/Edit modal | Multi-select vehicle types supported |
| `InputField` | Add/Edit modal | Total slot capacity |
| `Button` | Modal footer | "Save Zone" / "Cancel" |
| `EmptyState` | Grid area | "No zones created yet" |
| `Toast` | Top of screen | Zone saved / deleted confirmation |

### Add / Edit Zone Form Fields

| Field | Type | Validation |
|---|---|---|
| Zone Name | text | Required |
| Location | text | Required |
| Description | textarea | Optional, max 300 chars |
| Supported Vehicle Types | multi-chip | Required, min 1 |
| Status | dropdown | Required |

---

## P17 · Admin Slot Management Page

**Route:** `/admin/zones/:zoneId/slots`
**Access:** ADMIN only
**Member:** Member 1

### Purpose
Admin manages individual slots within a zone. Add new slots, update slot status, and remove slots.

### Layout
- Zone info header
- "Add Slot" button at top right
- SlotCard grid with edit/delete per card
- Add/Edit Slot modal form

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `Button` | Top right | "Add Slot" open modal |
| `SlotCard` | Main grid | Each slot with edit/delete |
| `StatusBadge` | Inside SlotCard | ACTIVE / OUT_OF_SERVICE |
| `VehicleTypeBadge` | Inside SlotCard | Slot vehicle type |
| `Button` | Inside SlotCard | "Edit" and "Delete / Deactivate" |
| `ConfirmModal` | On delete/deactivate | Confirm action dialog |
| `InputField` | Add/Edit modal | Slot number/label |
| `FilterDropdown` | Add/Edit modal | Vehicle type selector |
| `FilterDropdown` | Add/Edit modal | Status selector |
| `Button` | Modal footer | "Save Slot" / "Cancel" |
| `EmptyState` | Grid area | "No slots in this zone yet" |
| `Toast` | Top of screen | Slot saved / deleted confirmation |

### Add / Edit Slot Form Fields

| Field | Type | Validation |
|---|---|---|
| Slot Number / Label | text | Required, unique within zone |
| Vehicle Type | dropdown | Required |
| Status | dropdown | Required, default: ACTIVE |

---

## P18 · Notifications Page

**Route:** `/notifications`
**Access:** All logged-in users
**Member:** Member 4

### Purpose
Users view all their system notifications. Mark as read individually or all at once. Delete old notifications.

### Layout
- "Mark All as Read" button at top right
- List of NotificationItems
- Unread items highlighted

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `Button` | Top right | "Mark All as Read" action |
| `NotificationItem` | Main list | Each notification entry |
| `StatusBadge` | Inside NotificationItem | Notification type badge |
| `AvatarCircle` | Inside NotificationItem | System or user avatar |
| `Button` | Inside NotificationItem | "Mark as Read" / "Delete" |
| `EmptyState` | List area | "You have no notifications" |
| `LoadingSkeleton` | List area | While notifications load |

### Notification Types

| Type | Trigger | Example Message |
|---|---|---|
| `BOOKING_APPROVED` | Admin approves booking | "Your booking for Slot A12 has been approved" |
| `BOOKING_REJECTED` | Admin rejects booking | "Your booking request was rejected: [reason]" |
| `BOOKING_CANCELLED` | Booking cancelled | "Your booking for Slot B05 was cancelled" |
| `TICKET_UPDATED` | Ticket status changes | "Your ticket #TK-042 is now In Progress" |
| `TICKET_ASSIGNED` | Ticket assigned to warden | "You have been assigned to ticket #TK-042" |
| `COMMENT_ADDED` | New comment on user's ticket | "A new comment was added to your ticket #TK-042" |

---

## P19 · Admin User Management Page

**Route:** `/admin/users`
**Access:** ADMIN only
**Member:** Member 4

### Purpose
Admin views all registered users, changes roles, and deactivates accounts.

### Layout
- SearchBar at top
- FilterDropdown for role filter
- User list/table with role and action per row

### Components Used

| Component | Location on Page | Purpose |
|---|---|---|
| `SearchBar` | Top of page | Search users by name or university ID |
| `FilterDropdown` | Top of page | Filter by role: All / USER / WARDEN / ADMIN |
| `AvatarCircle` | Each user row | User profile photo |
| `UserRoleBadge` | Each user row | Current role: USER / WARDEN / ADMIN |
| `StatusBadge` | Each user row | Account status: ACTIVE / DEACTIVATED |
| `VehicleTypeBadge` | Each user row | Registered vehicle type |
| `Button` | Each user row | "Change Role" dropdown action |
| `Button` | Each user row | "Deactivate" danger action |
| `ConfirmModal` | On role change / deactivate | Confirm the action |
| `FilterDropdown` | Inside ConfirmModal | New role selector |
| `EmptyState` | List area | "No users found" |
| `LoadingSkeleton` | List area | While users load |
| `Toast` | Top of screen | Role updated / account deactivated |

---

# ═══════════════════════════════
# COMPONENTS
# ═══════════════════════════════

---

## C01 · `InputField`

General-purpose text / textarea / date / number input. Used across all form pages.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | optional | Label text above input |
| `type` | `string` | `'text'` | `'text'` \| `'email'` \| `'password'` \| `'number'` \| `'date'` \| `'time'` \| `'textarea'` |
| `value` | `string` | `''` | Controlled value |
| `onChange` | `function` | required | Called on every change |
| `placeholder` | `string` | `''` | Placeholder text |
| `error` | `string` | `''` | Error message shown below input |
| `required` | `boolean` | `false` | Shows required asterisk on label |
| `disabled` | `boolean` | `false` | Disabled/greyed state |
| `readOnly` | `boolean` | `false` | Display-only, no editing |
| `maxLength` | `number` | optional | Character limit |

### States

| State | Appearance |
|---|---|
| Default | Grey border |
| Focus | Blue border with ring |
| Error | Red border + red error text below |
| Disabled | Grey background, no pointer events |
| Read Only | Light grey background, no cursor |

### Pages Used
`/register` · `/profile/edit` · `/book/:slotId` · `/tickets/new` · `/admin/zones` · `/admin/zones/:zoneId/slots` · `/admin/bookings` (modal)

---

## C02 · `Button`

Base button component used across the entire app.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Button text |
| `onClick` | `function` | required | Click handler |
| `variant` | `string` | `'primary'` | `'primary'` \| `'secondary'` \| `'danger'` \| `'ghost'` \| `'success'` |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner, disables click |
| `fullWidth` | `boolean` | `false` | Expands to full container width |
| `icon` | `string` | optional | Icon shown before label |

### Variants

| Variant | Appearance | Used For |
|---|---|---|
| `primary` | Blue filled | Main actions (Book, Submit, Save) |
| `secondary` | Grey outlined | Secondary actions (Cancel, Back) |
| `danger` | Red filled | Destructive actions (Reject, Delete, Deactivate) |
| `success` | Green filled | Positive actions (Approve) |
| `ghost` | Transparent text only | View Details, Reset filters |

### Pages Used
Every page in the app.

---

## C03 · `AvatarCircle`

Displays a user's profile photo in a circle. Falls back to initials if no photo available.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | optional | Photo URL (from Google) |
| `name` | `string` | required | Used for initials fallback |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` |
| `online` | `boolean` | `false` | Shows green dot indicator |

### Sizes

| Size | Pixel Dimensions |
|---|---|
| `sm` | 32 × 32 px |
| `md` | 48 × 48 px |
| `lg` | 72 × 72 px |
| `xl` | 120 × 120 px |

### Pages Used
`/profile` · `/admin/bookings` · `/admin/tickets` · `/tickets/:ticketId` · `/notifications` · `/admin/users`

---

## C04 · `StatusBadge`

Colored pill showing a booking, ticket, zone, or account status.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `string` | required | See status values below |
| `size` | `string` | `'sm'` | `'sm'` \| `'md'` |

### Status Values

| Status | Color | Used For |
|---|---|---|
| `PENDING` | 🟡 Yellow | Booking awaiting approval |
| `APPROVED` | 🟢 Green | Booking confirmed |
| `REJECTED` | 🔴 Red | Booking/ticket rejected |
| `CANCELLED` | ⚫ Grey | Booking cancelled |
| `OPEN` | 🔵 Blue | Ticket just submitted |
| `IN_PROGRESS` | 🟡 Yellow | Ticket assigned and being worked on |
| `RESOLVED` | 🟢 Green | Ticket resolved by warden |
| `CLOSED` | ⚫ Grey | Ticket closed by admin |
| `ACTIVE` | 🟢 Green | Zone/slot is active |
| `OUT_OF_SERVICE` | ⚫ Grey | Zone/slot out of service |
| `AVAILABLE` | 🟢 Green | Slot is free to book |
| `BOOKED` | 🔴 Red | Slot currently booked |
| `CONFLICT` | 🔴 Red (pulse) | Time conflict detected |

### Pages Used
`/my-bookings` · `/my-bookings/:bookingId` · `/admin/bookings` · `/my-tickets` · `/tickets/:ticketId` · `/admin/tickets` · `/zones` · `/zones/:zoneId/slots` · `/admin/zones` · `/admin/users` · `/dashboard`

---

## C05 · `TagBadge`

Small colored pill label for categories and general tags.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Text inside the badge |
| `color` | `string` | `'blue'` | `'blue'` \| `'green'` \| `'yellow'` \| `'red'` \| `'grey'` |
| `size` | `string` | `'sm'` | `'sm'` \| `'md'` |

### Color Guide

| Color | Used For |
|---|---|
| 🔵 Blue | Category tags, general labels |
| 🟢 Green | Resolved, cleanliness category |
| 🟡 Yellow | Security, warning labels |
| 🔴 Red | Infrastructure damage, urgent |
| ⚫ Grey | Other / default |

### Pages Used
`/my-tickets` · `/tickets/:ticketId` · `/admin/tickets` · `/dashboard`

---

## C06 · `SearchBar`

Text input for searching lists of items.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Controlled input value |
| `onChange` | `function` | required | Called on keystrokes |
| `placeholder` | `string` | `'Search...'` | Placeholder text |
| `onClear` | `function` | optional | Shows X clear button when value not empty |

### Behavior
- Debounce 300ms recommended
- `Escape` key clears the input
- X button appears when value is not empty

### Pages Used
`/zones` · `/admin/bookings` · `/admin/tickets` · `/admin/users`

---

## C07 · `FilterDropdown`

Single select dropdown for filtering list data.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Label above dropdown |
| `options` | `{ value, label }[]` | required | Selectable options |
| `value` | `string` | `''` | Selected value |
| `onChange` | `function` | required | Called on selection change |
| `placeholder` | `string` | `'All'` | Default "All" option text |

### Pages Used
`/register` · `/zones/:zoneId/slots` · `/admin/bookings` · `/admin/tickets` · `/admin/users` · `/tickets/new` · `/admin/zones` · `/admin/zones/:zoneId/slots`

---

## C08 · `FilterBar`

Container for multiple `FilterDropdown` components in a horizontal row.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `filters` | `object` | required | Current filter state object |
| `onFilterChange` | `function` | required | Called when any filter changes |
| `onReset` | `function` | optional | Resets all filters to default |

### Behavior
- Desktop: horizontal single row
- Mobile: stacked vertically, full width
- "Reset filters" link shown when any filter is active

### Pages Used
`/zones/:zoneId/slots` · `/admin/bookings` · `/admin/tickets`

---

## C09 · `SlotCard`

Card displaying a single parking slot with its status and actions.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slotId` | `string` | required | Unique slot ID |
| `slotNumber` | `string` | required | Slot label (e.g., "A-12") |
| `vehicleType` | `string` | required | `'CAR'` \| `'BIKE'` \| `'THREE_WHEELER'` |
| `status` | `string` | required | `'AVAILABLE'` \| `'BOOKED'` \| `'OUT_OF_SERVICE'` |
| `zoneName` | `string` | required | Parent zone name |
| `onBook` | `function` | optional | "Book" callback (USER view) |
| `onEdit` | `function` | optional | "Edit" callback (ADMIN view) |
| `onDelete` | `function` | optional | "Delete" callback (ADMIN view) |

### States

| State | Card Border Color |
|---|---|
| AVAILABLE | 🟢 Green |
| BOOKED | 🔴 Red |
| OUT_OF_SERVICE | ⚫ Grey |

### Pages Used
`/zones/:zoneId/slots` · `/book/:slotId` · `/admin/zones/:zoneId/slots`

---

## C10 · `ZoneCard`

Card showing a parking zone summary with capacity and actions.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `zoneId` | `string` | required | Zone ID |
| `name` | `string` | required | Zone name |
| `location` | `string` | required | Physical location |
| `totalSlots` | `number` | required | Total number of slots |
| `availableSlots` | `number` | required | Currently available slots |
| `vehicleTypes` | `string[]` | required | Supported vehicle types |
| `status` | `string` | required | `'ACTIVE'` \| `'OUT_OF_SERVICE'` |
| `onViewSlots` | `function` | optional | Navigate to slots (USER view) |
| `onEdit` | `function` | optional | Edit callback (ADMIN view) |
| `onDelete` | `function` | optional | Delete callback (ADMIN view) |

### Pages Used
`/zones` · `/admin/zones`

---

## C11 · `BookingCard`

Summary card for a single booking request or reservation.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `bookingId` | `string` | required | Booking ID |
| `slotNumber` | `string` | required | Slot label |
| `zoneName` | `string` | required | Zone name |
| `vehicleType` | `string` | required | Vehicle type |
| `date` | `string` | required | Booking date |
| `startTime` | `string` | required | Start time |
| `endTime` | `string` | required | End time |
| `status` | `string` | required | Booking status |
| `userName` | `string` | optional | Requester name (ADMIN view) |
| `userAvatar` | `string` | optional | Requester avatar (ADMIN view) |
| `rejectionReason` | `string` | optional | Shown if REJECTED |
| `onApprove` | `function` | optional | Approve callback (ADMIN) |
| `onReject` | `function` | optional | Reject callback (ADMIN) |
| `onCancel` | `function` | optional | Cancel callback (USER) |
| `onViewDetails` | `function` | optional | Navigate to detail |

### Pages Used
`/my-bookings` · `/dashboard` · `/admin/bookings` · `/admin/dashboard`

---

## C12 · `TicketCard`

Summary card for a single incident/maintenance ticket.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `ticketId` | `string` | required | Ticket ID |
| `title` | `string` | required | Ticket title |
| `category` | `string` | required | Incident category |
| `priority` | `string` | required | `'LOW'` \| `'MEDIUM'` \| `'HIGH'` \| `'CRITICAL'` |
| `status` | `string` | required | Ticket status |
| `location` | `string` | required | Zone/location reported |
| `createdAt` | `string` | required | Submission date |
| `assigneeName` | `string` | optional | Assigned warden/technician |
| `reporterName` | `string` | optional | Reporter name (ADMIN view) |
| `onView` | `function` | required | Navigate to detail |
| `onAssign` | `function` | optional | Assign callback (ADMIN/WARDEN) |
| `onUpdateStatus` | `function` | optional | Status update (ADMIN/WARDEN) |

### Pages Used
`/my-tickets` · `/tickets/:ticketId` · `/admin/tickets` · `/dashboard` · `/admin/dashboard`

---

## C13 · `StatCard`

Summary stat box showing a single number with a label, icon, and optional trend.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Stat description text |
| `value` | `string \| number` | required | The number or text to display |
| `icon` | `string` | optional | Emoji or icon |
| `color` | `string` | `'blue'` | Card accent color |
| `trend` | `string` | optional | `'up'` \| `'down'` — shows trend arrow |
| `trendValue` | `string` | optional | e.g., "+5 this week" |

### Pages Used
`/dashboard` (user) · `/admin/dashboard`

---

## C14 · `NotificationItem`

Single notification entry in the notifications list or panel.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `notificationId` | `string` | required | Notification ID |
| `message` | `string` | required | Notification text |
| `type` | `string` | required | Notification type (see types table) |
| `isRead` | `boolean` | `false` | Read/unread state |
| `createdAt` | `string` | required | Timestamp |
| `onMarkRead` | `function` | optional | Mark as read callback |
| `onDelete` | `function` | optional | Delete callback |
| `onClick` | `function` | optional | Navigate to related item |

### Unread Style
- Unread: light blue background highlight
- Read: white background, normal text weight

### Pages Used
`/notifications` · `/dashboard` (notification panel)

---

## C15 · `PriorityBadge`

Colored badge indicating the priority level of an incident ticket.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `priority` | `string` | required | `'LOW'` \| `'MEDIUM'` \| `'HIGH'` \| `'CRITICAL'` |
| `size` | `string` | `'sm'` | `'sm'` \| `'md'` |

### Priority Color Guide

| Priority | Color | Icon |
|---|---|---|
| `LOW` | ⚫ Grey | ↓ |
| `MEDIUM` | 🔵 Blue | → |
| `HIGH` | 🟡 Yellow | ↑ |
| `CRITICAL` | 🔴 Red (pulse) | ⚠️ |

### Pages Used
`/my-tickets` · `/tickets/:ticketId` · `/admin/tickets` · `/admin/dashboard` · `/dashboard`

---

## C16 · `FileUpload`

Drag-and-drop or click-to-upload image zone. Used for ticket evidence attachments.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onFileSelect` | `function` | required | Callback with array of File objects |
| `acceptedTypes` | `string[]` | `['.jpg','.jpeg','.png']` | Allowed file types |
| `maxSizeMB` | `number` | `5` | Max file size per image in MB |
| `maxFiles` | `number` | `3` | Maximum number of files |
| `selectedFiles` | `File[]` | `[]` | Controlled list of selected files |

### States

| State | Appearance |
|---|---|
| Idle | Dashed grey border, upload icon |
| Drag Over | Dashed blue border, light blue background |
| Files Selected | Shows image thumbnails with remove button |
| Max Reached | Upload zone greyed out, "Max 3 images" message |
| Error | Red border + error message |

### Pages Used
`/tickets/new` · `/tickets/:ticketId` (preview only)

---

## C17 · `CommentBox`

Input area for adding a comment to a ticket thread.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Controlled input value |
| `onChange` | `function` | required | Called on keystroke |
| `onSubmit` | `function` | required | Submit comment callback |
| `placeholder` | `string` | `'Add a comment...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables input |
| `loading` | `boolean` | `false` | Shows spinner on submit button |

### Pages Used
`/tickets/:ticketId`

---

## C18 · `TimeSlotPicker`

Paired time picker for selecting start and end times for a booking.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `startTime` | `string` | `''` | Controlled start time value |
| `endTime` | `string` | `''` | Controlled end time value |
| `onStartChange` | `function` | required | Called on start time change |
| `onEndChange` | `function` | required | Called on end time change |
| `minTime` | `string` | `'07:00'` | Earliest selectable time |
| `maxTime` | `string` | `'22:00'` | Latest selectable time |
| `error` | `string` | `''` | Error message (e.g., conflict warning) |

### Behavior
- End time options are filtered to only show times after start time
- Red error message shown below if conflict detected after API check

### Pages Used
`/book/:slotId`

---

## C19 · `VehicleTypeBadge`

Colored chip displaying or selecting a vehicle type.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | required | `'CAR'` \| `'BIKE'` \| `'THREE_WHEELER'` |
| `selected` | `boolean` | `false` | Highlighted if selected (interactive mode) |
| `onClick` | `function` | optional | If provided, becomes selectable chip |
| `size` | `string` | `'sm'` | `'sm'` \| `'md'` |

### Type Color Guide

| Type | Color | Icon |
|---|---|---|
| `CAR` | 🔵 Blue | 🚗 |
| `BIKE` | 🟢 Green | 🏍️ |
| `THREE_WHEELER` | 🟡 Yellow | 🛺 |

### Pages Used
`/register` · `/zones` · `/zones/:zoneId/slots` · `/book/:slotId` · `/my-bookings` · `/admin/bookings` · `/admin/zones` · `/admin/zones/:zoneId/slots` · `/admin/users` · `/profile`

---

## C20 · `ConfirmModal`

Reusable confirmation dialog modal for destructive or important actions.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | required | Controls visibility |
| `title` | `string` | required | Modal title |
| `message` | `string` | required | Confirmation message text |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `variant` | `string` | `'primary'` | `'primary'` \| `'danger'` — confirm button color |
| `onConfirm` | `function` | required | Called on confirm click |
| `onCancel` | `function` | required | Called on cancel or backdrop click |
| `children` | `ReactNode` | optional | Extra content inside modal (e.g., reason input) |

### Pages Used
`/book/:slotId` · `/my-bookings` · `/admin/bookings` · `/admin/zones` · `/admin/zones/:zoneId/slots` · `/admin/users` · `/admin/tickets`

---

## C21 · `EmptyState`

Placeholder shown when a list or section has no data to display.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | optional | Emoji icon to display |
| `title` | `string` | required | Main empty state heading |
| `description` | `string` | optional | Supporting text below title |
| `actionLabel` | `string` | optional | CTA button text |
| `onAction` | `function` | optional | CTA button callback |

### Examples

| Page | Title Shown |
|---|---|
| `/zones` | "No parking zones available." |
| `/zones/:zoneId/slots` | "No slots match your filters." |
| `/my-bookings` | "You have no bookings yet." |
| `/my-tickets` | "No tickets submitted yet." |
| `/admin/bookings` | "No booking requests found." |
| `/notifications` | "You have no notifications." |

### Pages Used
All list and data pages across the entire app.

---

## C22 · `LoadingSkeleton`

Animated placeholder shown while data is being fetched from the API.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `'card'` | `'card'` \| `'list'` \| `'text'` \| `'stat'` |
| `count` | `number` | `3` | Number of skeleton items to render |

### Skeleton Types

| Type | Used For |
|---|---|
| `card` | SlotCard, ZoneCard grids |
| `list` | BookingCard, TicketCard, NotificationItem lists |
| `text` | Profile sections, ticket details |
| `stat` | StatCard dashboard rows |

### Pages Used
All pages with lists, grids, or data-fetched sections.

---

## C23 · `Toast`

Temporary notification message shown at the top of the screen.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | required | Notification text |
| `type` | `string` | `'info'` | `'success'` \| `'error'` \| `'warning'` \| `'info'` |
| `duration` | `number` | `3000` | Auto-dismiss delay in ms |
| `onClose` | `function` | optional | Manual close callback |

### Toast Types

| Type | Color | Example Use |
|---|---|---|
| `success` | 🟢 Green | "Booking submitted!", "Ticket created!" |
| `error` | 🔴 Red | "Login failed", "Conflict detected" |
| `warning` | 🟡 Yellow | "Slot going out of service soon" |
| `info` | 🔵 Blue | "Your booking has been approved" |

### Pages Used
All pages — global component rendered once at the app root.

---

## C24 · `UserRoleBadge`

Badge displaying the user's system role with appropriate styling.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `role` | `string` | required | `'USER'` \| `'WARDEN'` \| `'ADMIN'` |
| `size` | `string` | `'sm'` | `'sm'` \| `'md'` |

### Role Color Guide

| Role | Color | Icon |
|---|---|---|
| `USER` | 🔵 Blue | 👤 |
| `WARDEN` | 🟡 Yellow | 🛡️ |
| `ADMIN` | 🔴 Red | ⚙️ |

### Pages Used
`/profile` · `/admin/users` · `/admin/dashboard`

---

# 🗺️ Complete Route Map

| Route | Page | Access |
|---|---|---|
| `/login` | Login Page | Public |
| `/register` | Register Page | Public |
| `/profile` | Profile View | All logged-in users |
| `/profile/edit` | Profile Edit | All logged-in users |
| `/dashboard` | User / Warden Dashboard | USER, WARDEN |
| `/admin/dashboard` | Admin Dashboard | ADMIN only |
| `/zones` | Parking Zone Browse | All logged-in users |
| `/zones/:zoneId/slots` | Slot Catalogue | All logged-in users |
| `/book/:slotId` | Book a Slot | USER, WARDEN |
| `/my-bookings` | My Bookings | USER, WARDEN |
| `/my-bookings/:bookingId` | Booking Detail | Booking owner, ADMIN |
| `/admin/bookings` | Admin Booking Review | ADMIN only |
| `/tickets/new` | Report Incident | All logged-in users |
| `/my-tickets` | My Tickets | All logged-in users |
| `/tickets/:ticketId` | Ticket Detail | Ticket owner, WARDEN, ADMIN |
| `/admin/tickets` | Admin Ticket Dashboard | ADMIN, WARDEN |
| `/admin/zones` | Admin Zone Management | ADMIN only |
| `/admin/zones/:zoneId/slots` | Admin Slot Management | ADMIN only |
| `/notifications` | Notifications Page | All logged-in users |
| `/admin/users` | Admin User Management | ADMIN only |

---

# 👥 Team Member Ownership

| Member | Module | Pages Owned | Backend Endpoints |
|---|---|---|---|
| **Member 1** | Module A – Parking Catalogue & Slot Management | P06, P07, P16, P17 | `GET/POST/PUT/DELETE /api/zones` · `GET/POST/PUT/DELETE /api/slots` · `GET /api/slots/available` |
| **Member 2** | Module B – Booking & Reservation Management | P08, P09, P10, P11 | `POST /api/bookings` · `GET /api/bookings` · `GET /api/bookings/my` · `PUT /api/bookings/{id}/approve` · `PUT /api/bookings/{id}/reject` · `PUT /api/bookings/{id}/cancel` |
| **Member 3** | Module C – Incident & Maintenance Ticketing | P12, P13, P14, P15 | `POST /api/tickets` · `GET /api/tickets` · `GET /api/tickets/my` · `PUT /api/tickets/{id}/status` · `PUT /api/tickets/{id}/assign` · `POST/PUT/DELETE /api/tickets/{id}/comments` · `POST /api/tickets/{id}/attachments` |
| **Member 4** | Modules D & E – Auth, Roles & Notifications | P01, P02, P03, P04, P05, P18, P19 | `GET /api/auth/me` · `PUT /api/users/{id}/role` · `GET /api/users` · `GET/PUT/DELETE /api/notifications` |

---

# 🎨 Global Color Tokens

```css
/* ===== SMART CAMPUS PARKING HUB — GLOBAL COLOR TOKENS ===== */

:root {
  /* Primary */
  --color-primary:        #2563EB;  /* Blue 600 — main actions, buttons */
  --color-primary-hover:  #1D4ED8;  /* Blue 700 — hover state */
  --color-primary-light:  #DBEAFE;  /* Blue 100 — backgrounds, highlights */

  /* Success */
  --color-success:        #16A34A;  /* Green 600 — approved, available, resolved */
  --color-success-hover:  #15803D;  /* Green 700 */
  --color-success-light:  #DCFCE7;  /* Green 100 — success backgrounds */

  /* Warning */
  --color-warning:        #D97706;  /* Amber 600 — pending, in progress */
  --color-warning-hover:  #B45309;  /* Amber 700 */
  --color-warning-light:  #FEF3C7;  /* Amber 100 — warning backgrounds */

  /* Danger */
  --color-danger:         #DC2626;  /* Red 600 — rejected, critical, delete */
  --color-danger-hover:   #B91C1C;  /* Red 700 */
  --color-danger-light:   #FEE2E2;  /* Red 100 — danger backgrounds */

  /* Neutral */
  --color-grey-50:        #F9FAFB;
  --color-grey-100:       #F3F4F6;
  --color-grey-200:       #E5E7EB;
  --color-grey-300:       #D1D5DB;
  --color-grey-400:       #9CA3AF;
  --color-grey-500:       #6B7280;
  --color-grey-600:       #4B5563;
  --color-grey-700:       #374151;
  --color-grey-800:       #1F2937;
  --color-grey-900:       #111827;

  /* Background */
  --color-bg:             #F9FAFB;  /* App background */
  --color-surface:        #FFFFFF;  /* Card / panel background */
  --color-border:         #E5E7EB;  /* Default border color */

  /* Text */
  --color-text-primary:   #111827;  /* Main body text */
  --color-text-secondary: #6B7280;  /* Subtext, labels */
  --color-text-disabled:  #D1D5DB;  /* Disabled state text */
  --color-text-inverse:   #FFFFFF;  /* Text on dark backgrounds */

  /* Vehicle Types */
  --color-car:            #2563EB;  /* Blue — CAR */
  --color-bike:           #16A34A;  /* Green — BIKE */
  --color-threewheeler:   #D97706;  /* Amber — THREE_WHEELER */

  /* Status — Booking */
  --color-pending:        #D97706;
  --color-approved:       #16A34A;
  --color-rejected:       #DC2626;
  --color-cancelled:      #6B7280;

  /* Status — Ticket */
  --color-open:           #2563EB;
  --color-in-progress:    #D97706;
  --color-resolved:       #16A34A;
  --color-closed:         #6B7280;

  /* Priority */
  --color-low:            #6B7280;
  --color-medium:         #2563EB;
  --color-high:           #D97706;
  --color-critical:       #DC2626;

  /* Roles */
  --color-role-user:      #2563EB;
  --color-role-warden:    #D97706;
  --color-role-admin:     #DC2626;
}
```

---

> 💡 **Build Order Recommendation:**
> 1. Shared components first: `Button`, `InputField`, `StatusBadge`, `TagBadge`, `Toast`, `EmptyState`, `LoadingSkeleton`, `ConfirmModal`
> 2. Auth pages: Login (OAuth), Register
> 3. Profile page
> 4. Parking catalogue: Zone Browse → Slot Catalogue → Admin Zone & Slot Management
> 5. Booking module: Book a Slot → My Bookings → Booking Detail → Admin Review
> 6. Tickets module: Report Incident → My Tickets → Ticket Detail → Admin Ticket Dashboard
> 7. Notifications page
> 8. Dashboards last — they pull data from all modules

---

*IT3030 – Programming Applications and Frameworks | SLIIT Faculty of Computing | 2026*
