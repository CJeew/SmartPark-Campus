package com.SmartPark.Campus.SmartPark.Campus.config;

import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.RoleRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName(Role.RoleType.ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(Role.RoleType.ADMIN)));

        roleRepository.findByName(Role.RoleType.USER)
                .orElseGet(() -> roleRepository.save(new Role(Role.RoleType.USER)));

        if (!userRepository.existsByEmail("admin@smartpark.com")) {
            User admin = new User(
                    "admin@smartpark.com",
                    "System Admin",
                    "ADMIN001",
                    "0000000000",
                    "Administration",
                    User.UserType.STAFF
            );
            admin.setPassword(passwordEncoder.encode("admin123"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Admin user created: admin@smartpark.com / admin123");
        }
    }
}
