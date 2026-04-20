package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.entity.Role;
import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.RoleRepository;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.util.JwtTokenProvider;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminTicketControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Test
	void adminCanListAndResolveTicket() throws Exception {
		Role adminRole = roleRepository.findByName(Role.RoleType.ADMIN)
			.orElseGet(() -> roleRepository.save(new Role(Role.RoleType.ADMIN)));

		User admin = new User(
			"admin@sliit.lk",
			"Admin User",
			"ADMIN001",
			"0770000000",
			"Computing",
			User.UserType.STAFF
		);
		admin.setGoogleId("google-admin");
		admin.setRoles(Set.of(adminRole));
		admin = userRepository.save(admin);

		User student = new User(
			"student@sliit.lk",
			"Student User",
			"STU001",
			"0771111111",
			"Computing",
			User.UserType.STUDENT
		);
		student.setGoogleId("google-student");
		student = userRepository.save(student);

		String studentToken = jwtTokenProvider.generateToken(student.getId().toString());
		String adminToken = jwtTokenProvider.generateToken(admin.getId().toString());

		String createdId = mockMvc.perform(
				post("/api/tickets")
					.header("Authorization", "Bearer " + studentToken)
					.contentType(MediaType.APPLICATION_JSON)
					.content("""
						{
						  "title": "Water leak",
						  "description": "Leak near parking bay B12.",
						  "priority": "MEDIUM",
						  "tag": "incident"
						}
						""")
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("OPEN"))
			.andReturn()
			.getResponse()
			.getContentAsString();

		Number idNumber = JsonPath.read(createdId, "$.id");
		Long ticketId = idNumber.longValue();

		mockMvc.perform(
				get("/api/admin/tickets")
					.header("Authorization", "Bearer " + adminToken)
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(1));

		mockMvc.perform(
				patch("/api/admin/tickets/" + ticketId + "/status")
					.header("Authorization", "Bearer " + adminToken)
					.contentType(MediaType.APPLICATION_JSON)
					.content("""
						{ "status": "RESOLVED" }
						""")
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("RESOLVED"));
	}

	@Test
	void studentCannotAccessAdminEndpoints() throws Exception {
		User student = new User(
			"student2@sliit.lk",
			"Student User 2",
			"STU002",
			"0772222222",
			"Computing",
			User.UserType.STUDENT
		);
		student.setGoogleId("google-student2");
		student = userRepository.save(student);

		String studentToken = jwtTokenProvider.generateToken(student.getId().toString());

		mockMvc.perform(
				get("/api/admin/tickets")
					.header("Authorization", "Bearer " + studentToken)
			)
			.andExpect(status().isForbidden());
	}
}
