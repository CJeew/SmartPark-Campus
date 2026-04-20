package com.SmartPark.Campus.SmartPark.Campus.config;

import com.SmartPark.Campus.SmartPark.Campus.entity.User;
import com.SmartPark.Campus.SmartPark.Campus.repository.UserRepository;
import com.SmartPark.Campus.SmartPark.Campus.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
			String token = header.substring(7);
			if (jwtTokenProvider.validateToken(token)) {
				String userId = jwtTokenProvider.getUserIdFromToken(token);
				userRepository.findById(Long.valueOf(userId))
					.filter(User::getIsActive)
					.ifPresent(user -> {
						List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
							.map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().name()))
							.toList();

						UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							userId,
							null,
							authorities
						);
						SecurityContextHolder.getContext().setAuthentication(authentication);
					});
			}
		}

		filterChain.doFilter(request, response);
	}
}
