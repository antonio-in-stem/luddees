package org.generation.luddies;

import org.generation.luddies.model.Roles;
import org.generation.luddies.model.User;
import org.generation.luddies.repository.RolesRepository;
import org.generation.luddies.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiAccessTests {
    @Autowired MockMvc mvc;
    @Autowired UserRepository users;
    @Autowired RolesRepository roles;
    @Autowired PasswordEncoder encoder;

    private User createUser(String roleName) {
        Roles role = roles.findByName(roleName).orElseGet(() -> {
            Roles fresh = new Roles();
            fresh.setName(roleName);
            return roles.save(fresh);
        });
        User user = new User();
        user.setEmail("qa@example.test");
        user.setFullName("Quality Test");
        user.setPasswordHash(encoder.encode("QualityTest!42"));
        user.setRole(role);
        return users.save(user);
    }

    @Test void anonymousUsersCannotReadPrivateResourcesOrMutateCatalog() throws Exception {
        for (String path : new String[]{"users", "roles", "carts", "orders", "order-items", "payments", "cart-items"}) {
            mvc.perform(get("/api/"+path)).andExpect(status().isUnauthorized());
        }
        mvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isUnauthorized());
        mvc.perform(get("/api/products")).andExpect(status().isOk());
    }

    @Test void loginCreatesServerSessionAndLogoutInvalidatesIt() throws Exception {
        createUser("ADMIN");
        var result = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"qa@example.test\",\"password\":\"QualityTest!42\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.passwordHash").doesNotExist()).andReturn();
        var session = (MockHttpSession) result.getRequest().getSession(false);
        assertNotNull(session);
        mvc.perform(get("/api/users").session(session)).andExpect(status().isOk())
            .andExpect(jsonPath("$[0].passwordHash").doesNotExist());
        mvc.perform(post("/api/auth/logout").session(session)).andExpect(status().isNoContent());
        assertTrue(session.isInvalid());
    }

    @Test void regularUsersCannotAccessAdministrationOrForgePayments() throws Exception {
        User user = createUser("USER");
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", user.getId());
        mvc.perform(get("/api/users").session(session)).andExpect(status().isForbidden());
        mvc.perform(post("/api/payments").session(session).contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test void crossSiteWritesAreRejected() throws Exception {
        mvc.perform(post("/api/auth/login").header("Origin","https://untrusted.test")
            .contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test void weakPasswordIsRejectedByServer() throws Exception {
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"qa@example.test\",\"password\":\"123\",\"fullName\":\"Quality Test\"}"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_password"));
    }
}
