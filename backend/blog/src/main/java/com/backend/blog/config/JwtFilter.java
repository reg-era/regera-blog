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
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            try {
                Claims claims = jwtUtil.validateToken(token);
                String username = claims.getSubject();

                User user = this.userService.fetchUser(username);

                List<GrantedAuthority> authorities;
                if (user.getRole().equals(User.Role.ADMIN)) {
                    authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + User.Role.ADMIN),
                            new SimpleGrantedAuthority("ROLE_" + User.Role.BLOGGER));
                } else {
                    authorities = List.of(new SimpleGrantedAuthority("ROLE_" + User.Role.BLOGGER));
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
