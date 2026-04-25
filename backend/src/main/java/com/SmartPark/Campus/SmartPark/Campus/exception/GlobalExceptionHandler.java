package com.SmartPark.Campus.SmartPark.Campus.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return buildResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArg(IllegalArgumentException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String cause = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : "";
        log.warn("Data integrity violation at {}: {}", request.getRequestURI(), cause, ex);

        if (cause != null && cause.toLowerCase().contains("duplicate key")) {
            return buildResponse(HttpStatus.CONFLICT, "A record with the same unique value already exists", request.getRequestURI());
        }

        if (cause != null && cause.toLowerCase().contains("null value in column")) {
            String missingField = extractPostgresNullColumn(cause);
            if (missingField != null) {
                return buildResponse(HttpStatus.BAD_REQUEST, "Missing required field: " + missingField, request.getRequestURI());
            }
            return buildResponse(HttpStatus.BAD_REQUEST, "Missing required field(s) for this operation", request.getRequestURI());
        }

        if (cause != null && cause.toLowerCase().contains("violates foreign key constraint")) {
            return buildResponse(HttpStatus.CONFLICT, "Referenced record was not found or cannot be linked", request.getRequestURI());
        }

        return buildResponse(HttpStatus.CONFLICT, "Operation could not be completed due to related records", request.getRequestURI());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUpload(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Image size is too large. Please upload smaller files.", request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request.getRequestURI());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", path);
        return ResponseEntity.status(status).body(body);
    }

    private String extractPostgresNullColumn(String cause) {
        if (cause == null) {
            return null;
        }

        String lower = cause.toLowerCase();
        int start = lower.indexOf("null value in column");
        if (start < 0) {
            return null;
        }

        int firstQuote = cause.indexOf('"', start);
        if (firstQuote < 0) {
            return null;
        }
        int secondQuote = cause.indexOf('"', firstQuote + 1);
        if (secondQuote < 0) {
            return null;
        }

        String column = cause.substring(firstQuote + 1, secondQuote).trim();
        return column.isEmpty() ? null : column;
    }
}
