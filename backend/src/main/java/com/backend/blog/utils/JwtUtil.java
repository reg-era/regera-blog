package com.backend.blog.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

public class JwtUtil {

    private static final String SECRET = "8H6M6z2fv9YjVkjXB1doI/E6Cn2Vv2o6C5eEZYC9tUg="; // HS256 base-32
    private static final long EXPIRATION = 1000 * 60 * 60 * 24; // 24h

    private static final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String generateToken(Long id, String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("id", id)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + JwtUtil.EXPIRATION))
                .signWith(JwtUtil.key)
                .compact();
    }

    public static Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(JwtUtil.key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static Optional<Claims> extractClaimsFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return Optional.of(JwtUtil.validateToken(token));
            } catch (JwtException e) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

}
