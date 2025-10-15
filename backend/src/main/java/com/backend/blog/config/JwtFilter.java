package com.backend.blog.config;

import com.backend.blog.entities.User;
import com.backend.blog.services.UserService;
import com.backend.blog.utils.JwtUtil;
import io.jsonwebtoken.Claims;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;

    public JwtFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            try {
                Claims claims = JwtUtil.validateToken(token);
                String username = claims.getSubject();
                String tokenRole = claims.get("role", String.class);

                User user = this.userService.fetchUser(username);

                List<GrantedAuthority> authorities;
                String dbRole;
                if (user.getRole().equals(User.Role.ADMIN)) {
                    authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + User.Role.ADMIN),
                            new SimpleGrantedAuthority("ROLE_" + User.Role.BLOGGER));
                    dbRole = User.Role.ADMIN.name();
                } else {
                    authorities = List.of(new SimpleGrantedAuthority("ROLE_" + User.Role.BLOGGER));
                    dbRole = User.Role.BLOGGER.name();
                }

                if (!dbRole.equals(tokenRole)) {
                    String newToken = JwtUtil.generateToken(user.getId(), user.getUsername(), dbRole);
                    response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + newToken);
                }

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
                        authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);

                request.setAttribute("user", user);
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Invalid or expired JWT token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

}
