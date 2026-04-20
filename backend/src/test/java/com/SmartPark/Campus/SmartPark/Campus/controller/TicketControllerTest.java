package com.SmartPark.Campus.SmartPark.Campus.controller;

import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.util.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TicketControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Test
	void createAndListMyTickets() throws Exception {
		User user = new User(
			"demo@student.com",
			"Demo Student",
			"U123456",
			"0771234567",
			"Computing",
			User.UserType.STUDENT
		);
		user.setGoogleId("google-demo");
		user = userRepository.save(user);

		String token = jwtTokenProvider.generateToken(user.getId().toString());

		mockMvc.perform(
				post("/api/tickets")
					.header("Authorization", "Bearer " + token)
					.contentType(MediaType.APPLICATION_JSON)
					.content("""
						{
						  "title": "Broken gate arm",
						  "description": "Gate arm at Entrance A is stuck in the down position.",
						  "priority": "HIGH",
						  "tag": "maintenance"
						}
						""")
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").isNumber())
			.andExpect(jsonPath("$.status").value("OPEN"))
			.andExpect(jsonPath("$.createdByUserId").value(user.getId().intValue()));

		mockMvc.perform(
				get("/api/tickets/my")
					.header("Authorization", "Bearer " + token)
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(1));

		mockMvc.perform(
				get("/api/tickets/my?status=OPEN")
					.header("Authorization", "Bearer " + token)
			)
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(1));
	}
}
