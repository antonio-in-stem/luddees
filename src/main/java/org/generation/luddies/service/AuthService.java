package org.generation.luddies.service;

import org.generation.luddies.dto.auth.AuthRegisterRequest;
import org.generation.luddies.dto.auth.AuthUserResponse;
import org.generation.luddies.model.Roles;
import org.generation.luddies.model.User;
import org.generation.luddies.repository.RolesRepository;
import org.generation.luddies.repository.UserRepository;
import org.generation.luddies.util.PhoneParseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_FORMAT = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    public static final String RESERVED_ADMIN_EMAIL = "admin@luddies.com.mx";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean isEmailFormatValid(String email) {
        if (email == null) {
            return false;
        }
        String t = email.trim().toLowerCase(Locale.ROOT);
        return !t.isEmpty() && EMAIL_FORMAT.matcher(t).matches();
    }

    public Optional<AuthUserResponse> login(String email, String password) {
        if (email == null || password == null) {
            return Optional.empty();
        }
        String e = email.trim().toLowerCase(Locale.ROOT);
        Optional<User> opt = userRepository.findByEmail(e);
        if (opt.isEmpty()) {
            return Optional.empty();
        }
        User u = opt.get();
        if (!u.isActive()) {
            return Optional.empty();
        }
        if (!passwordEncoder.matches(password, u.getPasswordHash())) {
            return Optional.empty();
        }
        return Optional.of(toResponse(u));
    }

    @Transactional
    public AuthUserResponse register(AuthRegisterRequest req) {
        if (req == null || req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("invalid_payload");
        }
        String email = req.getEmail().trim().toLowerCase(Locale.ROOT);
        if (req.getPassword().length() < 8 || req.getPassword().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("invalid_password");
        }
        if (!isEmailFormatValid(email)) {
            throw new IllegalArgumentException("invalid_email");
        }
        if (RESERVED_ADMIN_EMAIL.equals(email)) {
            throw new IllegalArgumentException("reserved_email");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("email_taken");
        }
        String fullName = req.getFullName() != null ? req.getFullName().trim() : "";
        if (fullName.isEmpty() || fullName.length() > 150 || email.length() > 255) {
            throw new IllegalArgumentException("invalid_payload");
        }
        PhoneParseUtil.ParsedDial parsed = PhoneParseUtil.parseCombined(
                req.getPhone() != null ? req.getPhone() : "");

        Roles userRole = rolesRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("role_user_missing"));

        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setFullName(fullName);
        u.setPhoneDial(parsed.dial());
        u.setPhoneNumber(parsed.nationalDigits());
        u.setRole(userRole);
        u.setPreferredLanguage(User.Language.es);
        u.setActive(true);

        userRepository.save(u);
        return toResponse(u);
    }

    private AuthUserResponse toResponse(User u) {
        AuthUserResponse r = new AuthUserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setFullName(u.getFullName());
        r.setPhoneDial(u.getPhoneDial());
        r.setPhoneNumber(u.getPhoneNumber());
        String roleName = u.getRole() != null ? u.getRole().getName() : "USER";
        r.setRole("ADMIN".equalsIgnoreCase(roleName) ? "admin" : "user");
        return r;
    }
}
