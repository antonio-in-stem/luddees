package org.generation.luddies.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.generation.luddies.repository.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiAccessConfig implements WebMvcConfigurer, HandlerInterceptor {
    private final UserRepository users;

    public ApiAccessConfig(UserRepository users) {
        this.users = users;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(this).addPathPatterns("/api/**");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getRequestURI().substring(request.getContextPath().length());
        String method = request.getMethod();
        response.setHeader("Cache-Control", "no-store");
        boolean readOnly = "GET".equals(method) || "HEAD".equals(method);
        if ("OPTIONS".equals(method)) return true;
        if (!readOnly) {
            String origin = request.getHeader("Origin");
            String expectedOrigin = request.getScheme() + "://" + request.getHeader("Host");
            if ("cross-site".equals(request.getHeader("Sec-Fetch-Site"))
                    || (origin != null && !origin.equals(expectedOrigin))) {
                return reject(response, 403, "origin_not_allowed");
            }
        }
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")
                || path.equals("/api/auth/logout")) return true;
        if (readOnly && path.matches("/api/(products|categories|product-categories)(/.*)?")) return true;
        var session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof Long userId)) {
            return reject(response, 401, "authentication_required");
        }
        var user = users.findById(userId).orElse(null);
        if (user == null || !user.isActive()) return reject(response, 401, "authentication_required");
        if (user.getRole() == null || !"ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return reject(response, 403, "admin_required");
        }
        return true;
    }

    private boolean reject(HttpServletResponse response, int status, String error) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + error + "\"}");
        return false;
    }
}
