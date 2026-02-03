package com.vijay.user_service.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // 256-bit key derived from string
    private final SecretKey key = Keys.hmacShaKeyFor(
            "vijay-super-secret-jwt-key-2026-delivery-system"
                    .getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email) // who the token belongs to
                .setIssuedAt(new Date()) // creation time
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key, SignatureAlgorithm.HS256) // sign with secret
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
