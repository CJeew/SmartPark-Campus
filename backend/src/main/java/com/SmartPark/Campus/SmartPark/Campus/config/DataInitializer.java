package com.SmartPark.Campus.SmartPark.Campus.config;

import com.SmartPark.Campus.SmartPark.Campus.entity.*;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneStatus;
import com.SmartPark.Campus.SmartPark.Campus.entity.ZoneType;
import com.SmartPark.Campus.SmartPark.Campus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

// @Component  // Disabled: causes EntityManagerFactory closed error during startup
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private ParkingZoneRepository zoneRepository;
    @Autowired private ParkingSlotRepository slotRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRolesAndAdmin();
        seedZonesAndSlots();
        seedSampleBookings();
    }

    private void seedRolesAndAdmin() {
        for (Role.RoleType type : Role.RoleType.values()) {
            roleRepository.findByName(type)
                    .orElseGet(() -> roleRepository.save(new Role(type)));
        }
        Role adminRole = roleRepository.findByName(Role.RoleType.ADMIN).orElseThrow();

        if (!userRepository.existsByEmail("admin@smartpark.com")) {
            User admin = new User("admin@smartpark.com", "System Admin", "ADMIN001",
                    "0000000000", "Administration", User.UserType.STAFF);
            admin.setPassword(passwordEncoder.encode("admin123"));
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Admin created: admin@smartpark.com / admin123");
        }
    }

    private void seedZonesAndSlots() {
        if (zoneRepository.count() > 0) return;

        Object[][] zoneData = {
            {"Zone A", "Faculty of Computing — Level 1", ZoneType.COVERED,  20},
            {"Zone B", "Faculty of Engineering — Level 1", ZoneType.OPEN,    20},
            {"Zone C", "Faculty of Business — Ground Floor", ZoneType.OPEN,  15},
        };

        Vehicle.VehicleType[][] slotTypes = {
            {Vehicle.VehicleType.CAR, Vehicle.VehicleType.CAR, Vehicle.VehicleType.BIKE,
             Vehicle.VehicleType.BIKE, Vehicle.VehicleType.THREE_WHEELER},
            {Vehicle.VehicleType.CAR, Vehicle.VehicleType.CAR, Vehicle.VehicleType.CAR,
             Vehicle.VehicleType.BIKE, Vehicle.VehicleType.BIKE},
            {Vehicle.VehicleType.CAR, Vehicle.VehicleType.BIKE, Vehicle.VehicleType.BIKE,
             Vehicle.VehicleType.THREE_WHEELER, Vehicle.VehicleType.CAR},
        };

        String[] zoneCodes = {"A", "B", "C"};

        for (int z = 0; z < zoneData.length; z++) {
            int capacity = (int) zoneData[z][3];
            ParkingZone zone = new ParkingZone(
                    (String) zoneData[z][0], (String) zoneData[z][1],
                    (ZoneType) zoneData[z][2], capacity, capacity, ZoneStatus.ACTIVE, null);
            zoneRepository.save(zone);

            for (int s = 0; s < 5; s++) {
                String slotNumber = zoneCodes[z] + "-" + String.format("%03d", s + 1);
                ParkingSlot slot = new ParkingSlot(zone, slotNumber, slotTypes[z][s]);
                slotRepository.save(slot);
            }
        }
    }

    private void seedSampleBookings() {
        if (bookingRepository.count() > 0) return;

        Role userRole = roleRepository.findByName(Role.RoleType.USER).orElse(null);
        if (userRole == null) return;

        String[][] sampleUsers = {
            {"john.doe@sliit.lk", "John Doe", "IT21000001", "0771234001", "Computing", "CAR001"},
            {"jane.smith@sliit.lk", "Jane Smith", "IT21000002", "0771234002", "Engineering", "BIKE001"},
            {"alex.k@sliit.lk", "Alex Kumar", "IT21000003", "0771234003", "Business", "CAR002"},
        };

        for (String[] userData : sampleUsers) {
            if (!userRepository.existsByEmail(userData[0])) {
                User u = new User(userData[0], userData[1], userData[2],
                        userData[3], userData[4], User.UserType.STUDENT);
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                u.setRoles(roles);
                u = userRepository.save(u);

                Vehicle.VehicleType vType = userData[5].startsWith("BIKE")
                        ? Vehicle.VehicleType.BIKE : Vehicle.VehicleType.CAR;
                vehicleRepository.save(new Vehicle(u, vType, userData[5]));
            }
        }

        List<ParkingSlot> slots = slotRepository.findAll();
        List<User> regularUsers = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().noneMatch(r -> r.getName() == Role.RoleType.ADMIN))
                .toList();

        if (slots.size() < 5 || regularUsers.isEmpty()) return;

        Booking.BookingStatus[] statuses = {
            Booking.BookingStatus.PENDING,
            Booking.BookingStatus.APPROVED,
            Booking.BookingStatus.REJECTED,
            Booking.BookingStatus.PENDING,
            Booking.BookingStatus.CANCELLED,
        };

        for (int i = 0; i < Math.min(5, slots.size()); i++) {
            User u = regularUsers.get(i % regularUsers.size());
            ParkingSlot slot = slots.get(i);
            LocalDateTime start = LocalDateTime.now().plusDays(i).withHour(8).withMinute(0);
            LocalDateTime end = start.plusHours(8);

            Booking booking = new Booking(u, slot, start, end);
            booking.setStatus(statuses[i]);
            if (statuses[i] == Booking.BookingStatus.REJECTED) {
                booking.setReason("Slot reserved for staff vehicles");
            }
            bookingRepository.save(booking);
        }
    }
}
