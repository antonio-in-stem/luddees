package org.generation.luddies.controller;

import org.generation.luddies.dto.auth.AuthLoginRequest;
import org.generation.luddies.dto.auth.AuthRegisterRequest;
import org.generation.luddies.dto.auth.AuthUserResponse;
import org.generation.luddies.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthLoginRequest body, HttpServletRequest request) {
        if (body == null || body.getEmail() == null || body.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "invalid_payload"));
        }
        if (!authService.isEmailFormatValid(body.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "invalid_email"));
        }
        Optional<AuthUserResponse> res = authService.login(body.getEmail(), body.getPassword());
        return res.<ResponseEntity<?>>map(user -> {
            HttpSession previous = request.getSession(false);
            if (previous != null) previous.invalidate();
            request.getSession(true).setAttribute("userId", user.getId());
            return ResponseEntity.ok(user);
        })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid_credentials")));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRegisterRequest body) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(body));
        } catch (IllegalArgumentException ex) {
            String code = ex.getMessage() != null ? ex.getMessage() : "invalid_payload";
            if ("email_taken".equals(code)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", code));
            }
            if ("reserved_email".equals(code)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", code));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", code));
        }
    }
}
