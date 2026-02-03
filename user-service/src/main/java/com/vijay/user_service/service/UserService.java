package com.vijay.user_service.service;

import com.vijay.user_service.entity.User;
import com.vijay.user_service.repository.UserRepository;
import com.vijay.user_service.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    public String register(User user) {
        repo.save(user);
        return "User Registered";
    }

    public String login(String email, String password) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return jwtUtil.generateToken(email);
    }

}
