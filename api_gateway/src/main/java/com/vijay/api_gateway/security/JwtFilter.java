package com.vijay.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtFilter implements GlobalFilter {

    private static final String SECRET =
            "mySecretKeymySecretKeymySecretKey";

    private final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Allow public endpoints
        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        String auth = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (auth == null || !auth.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            String token = auth.replace("Bearer ", "");

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String role = claims.get("role", String.class);
            if (!isAuthorized(path, role)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    private boolean isAuthorized(String path, String role) {

        if (path.startsWith("/admin") && !"ADMIN".equals(role)) {
            return false;
        }

        if (path.startsWith("/driver") && !"DRIVER".equals(role)) {
            return false;
        }

        return !path.startsWith("/orders") || "CUSTOMER".equals(role);
    }
}
