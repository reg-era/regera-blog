package com.backend.blog.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil {

    private static final String SECRET = "YourSuperSecretKeyForJwtGeneration1234!"; // HS256 RSA ECDSA
    private static final long EXPIRATION = 1000 * 60 * 60 * 24; // 24h

    private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String generateToken(Long id, String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("id", id)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Optional<Claims> extractClaimsFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return Optional.of(this.validateToken(token));
            } catch (JwtException e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

}
