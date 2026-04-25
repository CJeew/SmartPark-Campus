package com.SmartPark.Campus.SmartPark.Campus.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class RequestAuthUtil {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public Long resolveUserId(String authorization, Long userIdHeader) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Authorization header");
        }

        String token = authorization.substring(7);
        if (token.isBlank() || !jwtTokenProvider.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }

        Long resolved;
        try {
            String tokenUserId = jwtTokenProvider.getUserIdFromToken(token);
            resolved = Long.parseLong(tokenUserId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        if (userIdHeader != null && !userIdHeader.equals(resolved)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "X-User-Id does not match authenticated user");
        }

        return resolved;
    }
}
